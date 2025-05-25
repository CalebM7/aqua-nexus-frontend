import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import BidForm from '../components/BidForm';
import NotificationList from '../components/NotificationList';
import BidList from '../components/BidList';

export default function ProviderDashboard() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
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
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    console.log('ProviderDashboard: useEffect running', {
      user,
      isAuthenticated,
      loading,
      localStorage: {
        accessToken: !!localStorage.getItem('accessToken'),
        refreshToken: !!localStorage.getItem('refreshToken'),
        user: !!localStorage.getItem('user'),
      },
    });

    if (loading) {
      console.log('ProviderDashboard: Loading state, waiting...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log(
        'ProviderDashboard: Not authenticated or no user, redirecting to /login'
      );
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'provider') {
      console.log('ProviderDashboard: Non-provider user, redirecting to /', {
        role: user.role,
      });
      navigate('/', { replace: true });
      return;
    }

    if (!user.providerId) {
      console.error('ProviderDashboard: No providerId for provider user', {
        userId: user.userId,
        email: user.email,
      });
      setError(
        'Provider profile not found. Please contact support or complete your provider setup.'
      );
      setFetchLoading(false);
      return;
    }

    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        console.log(
          'ProviderDashboard: Fetching data with token:',
          token?.slice(0, 10) + '...'
        );
        const [messagesRes, projectsRes, providerRes, bidsRes] =
          await Promise.all([
            fetch('http://localhost:5000/messages/provider', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5000/projects', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:5000/providers/${user.providerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5000/bids/me', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        console.log('ProviderDashboard: API responses', {
          messagesStatus: messagesRes.status,
          projectsStatus: projectsRes.status,
          providerStatus: providerRes.status,
        });

        if (
          messagesRes.status === 401 ||
          projectsRes.status === 401 ||
          providerRes.status === 401
        ) {
          throw new Error('Unauthorized: Invalid or expired token');
        }
        if (projectsRes.status === 403) {
          throw new Error('Not a provider');
        }
        if (!messagesRes.ok) {
          const errorData = await messagesRes.json();
          throw new Error(
            `Failed to fetch messages: ${errorData.error || 'Unknown error'}`
          );
        }
        if (!projectsRes.ok) {
          const errorData = await projectsRes.json();
          throw new Error(
            `Failed to fetch projects: ${errorData.error || 'Unknown error'}`
          );
        }
        if (!providerRes.ok) {
          const errorData = await providerRes.json();
          throw new Error(
            `Failed to fetch provider data: ${
              errorData.error || 'Unknown error'
            }`
          );
        }

        const messagesData = await messagesRes.json();
        const projectsData = await projectsRes.json();
        const providerData = await providerRes.json();
        const myBidsData = await bidsRes.json();
        console.log('ProviderDashboard: Data fetched', {
          messages: messagesData.length,
          projects: projectsData.length,
          provider: providerData,
        });

        setMessages(messagesData);
        setProjects(projectsData);
        setMyBids(myBidsData);
        setProfileForm({
          description: providerData.description || '',
          service_type: providerData.service_type || 'rwh',
          price_range_min: providerData.price_range_min || '',
          price_range_max: providerData.price_range_max || '',
          service_areas: providerData.service_areas?.join(', ') || '',
          services: providerData.services?.join(', ') || '',
        });
      } catch (err) {
        console.error('ProviderDashboard: Fetch error:', err.message);
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, loading, navigate]);

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
        body: JSON.stringify({
          content,
          receiver_id: receiverId,
          project_id: null,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to send reply: ${errorData.error || 'Unknown error'}`
        );
      }
      setReplyContent({ ...replyContent, [messageId]: '' });
      alert('Reply sent successfully!');
      const messagesRes = await fetch(
        'http://localhost:5000/messages/provider',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (messagesRes.ok) {
        setMessages(await messagesRes.json());
      }
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
        body: JSON.stringify({
          project_id: projectId,
          amount: Number(amount),
          description,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to submit bid: ${errorData.error || 'Unknown error'}`
        );
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
    if (!user?.providerId) {
      setError('Provider ID not found');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `http://localhost:5000/providers/${user.providerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...profileForm,
            price_range_min: Number(profileForm.price_range_min),
            price_range_max: Number(profileForm.price_range_max),
            service_areas: profileForm.service_areas
              .split(',')
              .map((area) => area.trim())
              .filter((area) => area),
            services: profileForm.services
              .split(',')
              .map((service) => service.trim())
              .filter((service) => service),
          }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to update profile: ${errorData.error || 'Unknown error'}`
        );
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
    if (!user?.providerId) {
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
      const res = await fetch(
        `http://localhost:5000/providers/${user.providerId}/image`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Failed to upload image: ${errorData.error || 'Unknown error'}`
        );
      }
      setProfileMessage('Image uploaded successfully');
      setImage(null);
      console.log('Uploaded image:', await res.json());
    } catch (err) {
      setProfileMessage(err.message);
      console.error('Image upload error:', err);
    }
  };

  if (fetchLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="bg-aqua-blue text-white py-2 px-4 rounded hover:bg-opacity-90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-aqua-blue mb-8 text-center">
          Provider Dashboard
        </h2>
        {profileMessage && (
          <p className="text-green-500 mb-4 text-center">{profileMessage}</p>
        )}

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Notifications
          </h3>
          <NotificationList />
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Update Profile
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Expertise Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="e.g., Expert in rainwater harvesting systems"
                value={profileForm.description}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="service_type"
                className="block text-sm font-medium text-gray-700"
              >
                Service Type
              </label>
              <select
                id="service_type"
                name="service_type"
                value={profileForm.service_type}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    service_type: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="rwh">Rainwater Harvesting</option>
                <option value="borehole">Borehole Drilling</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="price_range_min"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Price (KES)
              </label>
              <input
                type="number"
                id="price_range_min"
                name="price_range_min"
                placeholder="e.g., 40000"
                value={profileForm.price_range_min}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    price_range_min: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price_range_max"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Price (KES)
              </label>
              <input
                type="number"
                id="price_range_max"
                name="price_range_max"
                placeholder="e.g., 120000"
                value={profileForm.price_range_max}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    price_range_max: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="service_areas"
                className="block text-sm font-medium text-gray-700"
              >
                Service Areas
              </label>
              <input
                type="text"
                id="service_areas"
                name="service_areas"
                placeholder="e.g., Nairobi, Kiambu, Machakos"
                value={profileForm.service_areas}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    service_areas: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label
                htmlFor="services"
                className="block text-sm font-medium text-gray-700"
              >
                Services Offered
              </label>
              <input
                type="text"
                id="services"
                name="services"
                placeholder="e.g., Installation, Maintenance"
                value={profileForm.services}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, services: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-aqua-blue text-white p-2 rounded hover:bg-opacity-90"
            >
              Update Profile
            </button>
          </form>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Upload Profile Image
          </h3>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-aqua-blue text-white p-2 rounded hover:bg-opacity-90"
            >
              Upload Image
            </button>
          </form>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">My Bids</h3>
          {myBids.length === 0 ? (
            <p>No bids submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {myBids.map((bid) => (
                <li key={bid.id} className="border p-4 rounded bg-gray-50">
                  <div>
                    <span className="font-semibold">Project:</span>{' '}
                    {bid.project_title}
                  </div>
                  <div>
                    <span className="font-semibold">Amount:</span> KES{' '}
                    {bid.amount}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                      className={
                        bid.status === 'accepted'
                          ? 'text-green-600'
                          : bid.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }
                    >
                      {bid.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(bid.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span>{' '}
                    {bid.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Project Inquiries
          </h3>
          {projects.length === 0 ? (
            <p>No project inquiries.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="border p-4 rounded bg-gray-50">
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
                  <BidForm projectId={project.id} onBidSubmitted={() => {}} />
                  <BidList projectId={project.id} ownerId={project.user_id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
