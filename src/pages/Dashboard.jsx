import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState({}); // Track reply input per message
  const [bidData, setBidData] = useState({}); // Track bid input per project
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const [messagesRes, projectsRes] = await Promise.all([
          fetch('http://localhost:5000/messages/provider', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/projects', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (messagesRes.status === 401 || projectsRes.status === 401) {
          throw new Error('Unauthorized');
        }
        if (projectsRes.status === 403) {
          throw new Error('Not a provider');
        }
        if (!messagesRes.ok) {
          throw new Error('Failed to fetch messages');
        }
        if (!projectsRes.ok) {
          throw new Error('Failed to fetch projects');
        }

        setMessages(await messagesRes.json());
        setProjects(await projectsRes.json());
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        if (err.message === 'Unauthorized' || err.message === 'Not a provider') {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleReply = async (messageId, receiverId) => {
    const content = replyContent[messageId]?.trim();
    if (!content) {
      setError('Reply content cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, receiver_id: receiverId, project_id: null }),
      });

      if (!res.ok) {
        throw new Error('Failed to send reply');
      }

      setReplyContent({ ...replyContent, [messageId]: '' });
      alert('Reply sent successfully!');
    } catch (err) {
      console.error('Reply error:', err);
      setError(err.message);
    }
  };

  const handleBid = async (projectId) => {
    const { amount, description } = bidData[projectId] || {};
    if (!amount || amount <= 0) {
      setError('Bid amount must be a positive number');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: projectId, amount, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit bid');
      }

      setBidData({ ...bidData, [projectId]: { amount: '', description: '' } });
      alert('Bid submitted successfully!');
    } catch (err) {
      console.error('Bid error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Provider Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <section>
        <h3>Messages</h3>
        {messages.length === 0 ? (
          <p>No messages received.</p>
        ) : (
          <ul>
            {messages.map((msg) => (
              <li key={msg.id} className="message">
                <p>
                  <strong>From:</strong> {msg.sender_email}
                  {msg.project_title ? ` (Project: ${msg.project_title})` : ''}
                </p>
                <p>{msg.content}</p>
                <p>
                  <small>Sent: {new Date(msg.created_at).toLocaleString()}</small>
                </p>
                <textarea
                  className="reply-textarea"
                  placeholder="Type your reply..."
                  value={replyContent[msg.id] || ''}
                  onChange={(e) =>
                    setReplyContent({ ...replyContent, [msg.id]: e.target.value })
                  }
                />
                <button onClick={() => handleReply(msg.id, msg.sender_id)}>
                  Reply
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3>Project Inquiries</h3>
        {projects.length === 0 ? (
          <p>No project inquiries.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="project">
                <p>
                  <strong>{project.title}</strong> by {project.user_email}
                </p>
                <p>{project.description}</p>
                <p>
                  <small>
                    Service: {project.service_type} | Budget: $
                    {project.budget || 'N/A'} | Status: {project.status}
                  </small>
                </p>
                <input
                  type="number"
                  className="bid-input"
                  placeholder="Bid Amount ($)"
                  value={bidData[project.id]?.amount || ''}
                  onChange={(e) =>
                    setBidData({
                      ...bidData,
                      [project.id]: {
                        ...bidData[project.id],
                        amount: e.target.value,
                      },
                    })
                  }
                />
                <textarea
                  className="bid-textarea"
                  placeholder="Bid Description (e.g., timeline, approach)"
                  value={bidData[project.id]?.description || ''}
                  onChange={(e) =>
                    setBidData({
                      ...bidData,
                      [project.id]: {
                        ...bidData[project.id],
                        description: e.target.value,
                      },
                    })
                  }
                />
                <button onClick={() => handleBid(project.id)}>Submit Bid</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}