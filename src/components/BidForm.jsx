import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function BidForm({ projectId, onBidSubmitted }) {
  const { accessToken, user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Success message state

  if (user?.role !== 'provider') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Enforce description length on frontend
    if (description.length < 50 || description.length > 500) {
      setError('Description must be between 50 and 500 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/bids',
        { project_id: projectId, amount, description },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setAmount('');
      setDescription('');
      setSuccess('Bid submitted successfully!'); // Set success message
      if (onBidSubmitted) onBidSubmitted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <div>
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Bid Amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
        />
      </div>
      <div>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Bid Description (50-500 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={50}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 text-right">
          {description.length} / 500 characters
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button
        type="submit"
        className="bg-aqua-blue text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Bid'}
      </button>
    </form>
  );
}
