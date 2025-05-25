import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function NotificationList() {
  const { accessToken } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/notifications', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setNotifications(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to load notifications')
      )
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (notifications.length === 0) return <div>No notifications.</div>;

  return (
    <ul className="space-y-3">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`p-3 rounded border ${
            n.read ? 'bg-gray-50' : 'bg-blue-50 font-semibold'
          }`}
        >
          <div>
            {n.type === 'bid' && (
              <span>
                New bid on <b>{n.project_title}</b>
              </span>
            )}
            {n.type === 'bid_status' && (
              <span>
                Your bid on <b>{n.project_title}</b> was <b>{n.status}</b>
              </span>
            )}
            {/* Add more types as needed */}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(n.created_at).toLocaleString()}
          </div>
          {n.project_id && (
            <Link
              to={`/dashboard?project=${n.project_id}`}
              className="text-aqua-blue underline text-xs"
            >
              View Project
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
