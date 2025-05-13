import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]); // Initialize as empty array
  const [error, setError] = useState(null); // Track errors
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/messages/provider', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => {
        console.error('Messages fetch error:', err);
        if (err.message === 'Unauthorized') navigate('/login');
      });

    fetch('http://localhost:5000/projects', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized');
        if (res.status === 403) throw new Error('Not a provider');
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(err => {
        console.error('Projects fetch error:', err);
        setError(err.message);
        if (err.message === 'Unauthorized' || err.message === 'Not a provider') navigate('/login');
      });
  }, [isAuthenticated, navigate]);

  return (
    <div className="dashboard-container">
      <h2>Provider Dashboard</h2>
      <section>
        <h3>Messages</h3>
        {messages.length === 0 ? (
          <p>No messages received.</p>
        ) : (
          <ul>
            {messages.map(msg => (
              <li key={msg.id}>
                From {msg.sender_email}: {msg.content} 
                {msg.project_title ? ` (Project: ${msg.project_title})` : ''} 
                (Sent: {new Date(msg.created_at).toLocaleString()})
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3>Project Inquiries</h3>
        {error ? (
          <p>Error: {error}</p>
        ) : projects.length === 0 ? (
          <p>No project inquiries.</p>
        ) : (
          <ul>
            {projects.map(project => (
              <li key={project.id}>
                <strong>{project.title}</strong> by {project.user_email}: 
                {project.description} (Status: {project.status})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}