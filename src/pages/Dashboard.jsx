import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Dashboard() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [bidData, setBidData] = useState({});
  const [profileForm, setProfileForm] = useState({
    description: '',
    service_type: 'rwh',
    price_range_min: '',
    price_range_max: '',
    service_areas: '',
    services: '',
  });
  const [image, setImage] = useState(null);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (!user.providerId) {
      setError('Provider ID not found. Ensure you are logged in as a provider.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const [messagesRes, projectsRes, providerRes] = await Promise.all([
          fetch('http://localhost:5000/messages/provider', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/projects', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/provider/${user.providerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (messagesRes.status === 401 || projectsRes.status === 401 || providerRes.status === 401) {
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
        if (!providerRes.ok) {
          throw new Error('Failed to fetch provider data');
        }

        setMessages(await messagesRes.json());
        setProjects(await projectsRes.json());
        const provider = await providerRes.json();
        setProfileForm({
          description: provider.description || '',
          service_type: provider.service_type || 'rwh',
          price_range_min: provider.price_range_min || '',
          price_range_max: provider.price_range_max || '',
          service_areas: provider.service_areas?.join(', ') || '',
          services: provider.services?.join(', ') || '',
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        if (err.message === 'Unauthorized' || err.message === 'Not a provider') {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: projectId, amount: Number(amount), description }),
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user.providerId) {
      setError('Provider ID not found');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:5000/provider/${user.providerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...profileForm,
          price_range_min: Number(profileForm.price_range_min),
          price_range_max: Number(profileForm.price_range_max),
          service_areas: profileForm.service_areas.split(',').map((area) => area.trim()),
          services: profileForm.services.split(',').map((service) => service.trim()),
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }
      setProfileMessage('Profile updated successfully');
      console.log('Updated provider:', await res.json());
    } catch (err) {
      setProfileMessage(err.message);
      console.error('Profile update error:', err);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!user.providerId) {
      setError('Provider ID not found');
      return;
    }
    if (!image) {
      setProfileMessage('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:5000/provider/${user.providerId}/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to upload image');
      }
      setProfileMessage('Image uploaded successfully');
      setImage(null);
      console.log('Uploaded image:', await res.json());
    } catch (err) {
      setProfileMessage(err.message);
      console.error('Image upload error:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Provider Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {profileMessage && <p className="message">{profileMessage}</p>}

      <section>
        <h3>Update Profile</h3>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={profileForm.description}
            onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
            required
          />
          <select
            name="service_type"
            value={profileForm.service_type}
            onChange={(e) => setProfileForm({ ...profileForm, service_type: e.target.value })}
            required
          >
            <option value="rwh">Rainwater Harvesting</option>
            <option value="borehole">Borehole</option>
          </select>
          <input
            type="number"
            name="price_range_min"
            placeholder="Min Price (KES)"
            value={profileForm.price_range_min}
            onChange={(e) => setProfileForm({ ...profileForm, price_range_min: e.target.value })}
            required
          />
          <input
            type="number"
            name="price_range_max"
            placeholder="Max Price (KES)"
            value={profileForm.price_range_max}
            onChange={(e) => setProfileForm({ ...profileForm, price_range_max: e.target.value })}
            required
          />
          <input
            type="text"
            name="service_areas"
            placeholder="Service Areas (comma-separated)"
            value={profileForm.service_areas}
            onChange={(e) => setProfileForm({ ...profileForm, service_areas: e.target.value })}
            required
          />
          <input
            type="text"
            name="services"
            placeholder="Services (comma-separated)"
            value={profileForm.services}
            onChange={(e) => setProfileForm({ ...profileForm, services: e.target.value })}
            required
          />
          <button type="submit">Update Profile</button>
        </form>
      </section>

      <section>
        <h3>Upload Profile Image</h3>
        <form onSubmit={handleImageUpload} className="image-form">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Upload Image</button>
        </form>
      </section>

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
                    Service: {project.service_type} | Budget: KES
                    {project.budget || 'N/A'} | Status: {project.status}
                  </small>
                </p>
                <input
                  type="number"
                  className="bid-input"
                  placeholder="Bid Amount (KES)"
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