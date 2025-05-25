import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function BidList({ projectId, ownerId, onStatusChange }) {
  const { accessToken, user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/bids?project_id=${projectId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setBids(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to load bids')
      )
      .finally(() => setLoading(false));
  }, [projectId, accessToken]);

  const handleStatus = (bidId, status) => {
    axios
      .patch(
        `http://localhost:5000/bids/${bidId}`,
        { status },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        setBids((prev) =>
          prev.map((b) => (b.id === bidId ? { ...b, status } : b))
        );
        if (onStatusChange) onStatusChange(bidId, status);
      })
      .catch((err) =>
        setError(err.response?.data?.error || 'Failed to update bid')
      );
  };

  if (loading) return <div>Loading bids...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (bids.length === 0) return <div>No bids yet.</div>;

  return (
    <ul className="space-y-4">
      {bids.map((bid) => (
        <li key={bid.id} className="border p-4 rounded bg-gray-50">
          <div>
            <span className="font-semibold">Amount:</span> KES {bid.amount}
          </div>
          <div>
            <span className="font-semibold">Provider:</span> {bid.provider_name}
            {bid.provider_rating && (
              <span className="ml-2 text-yellow-500">
                ★ {bid.provider_rating}
              </span>
            )}
          </div>
          <div>
            <span className="font-semibold">Description:</span>{' '}
            {bid.description}
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
          {user?.userId === ownerId && bid.status === 'pending' && (
            <div className="mt-2 flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleStatus(bid.id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleStatus(bid.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
