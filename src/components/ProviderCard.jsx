import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function ProviderCard({ provider }) {
  const { isAuthenticated, user, accessToken } = useContext(AuthContext);
  const [showMsgBox, setShowMsgBox] = useState(false);
  const [message, setMessage] = useState('');
  const [msgStatus, setMsgStatus] = useState('');

  const handleSendMessage = async () => {
    setMsgStatus('');
    if (!message.trim()) {
      setMsgStatus('Message cannot be empty');
      return;
    }
    try {
      // Use provider.user_id as receiver_id
      const res = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          receiver_id: provider.user_id, // <-- use user_id, not provider.id
          content: message,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setMsgStatus(err.error || 'Failed to send message');
        return;
      }
      setMsgStatus('Message sent!');
      setMessage('');
      setShowMsgBox(false);
    } catch (err) {
      setMsgStatus('Failed to send message');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
      <div className="w-full overflow-hidden rounded-lg">
        <img
          src={
            provider.image
              ? `http://localhost:5000${
                  provider.image.startsWith('/')
                    ? provider.image
                    : '/uploads/' + provider.image
                }`
              : 'https://placehold.co/256x192?text=No+Image'
          }
          alt={provider.name}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {provider.name}
        </h3>
        <div className="flex items-center mb-3 star-rating">
          {[...Array(5)].map((_, index) => {
            const rating = parseFloat(provider.rating) || 0;
            if (index + 1 <= Math.floor(rating)) {
              return (
                <i key={index} className="fas fa-star text-yellow-400"></i>
              );
            } else if (index < rating && rating % 1 >= 0.5) {
              return (
                <i
                  key={index}
                  className="fas fa-star-half-alt text-yellow-400"
                ></i>
              );
            } else {
              return <i key={index} className="far fa-star text-gray-300"></i>;
            }
          })}
          <span className="text-gray-600 text-sm ml-2">
            ({provider.rating || '0'} stars | {provider.reviews || 0} Reviews)
          </span>
        </div>
        <div className="mb-3 space-x-2">
          {provider.certifications?.map((cert) => (
            <span
              key={cert}
              className={`badge ${
                cert.toLowerCase().includes('eco-friendly') ||
                cert.toLowerCase().includes('rainwater')
                  ? 'bg-aqua-green text-white'
                  : 'bg-aqua-blue text-white'
              }`}
            >
              {cert.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Service Type:</span>{' '}
          {provider.service_type}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Areas:</span>{' '}
          {provider.service_areas?.join(', ')}
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <span className="font-semibold">Services:</span>{' '}
          {provider.services?.join(', ')}
        </div>
        <Link
          to={`/provider/${provider.id}`}
          className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
        >
          View Profile <i className="fas fa-arrow-right ml-1 text-xs"></i>
        </Link>
        {isAuthenticated && user?.role === 'user' && (
          <div className="mt-4">
            {!showMsgBox ? (
              <button
                className="bg-aqua-green text-white px-4 py-2 rounded"
                onClick={() => setShowMsgBox(true)}
              >
                Contact Provider
              </button>
            ) : (
              <div className="mt-2">
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-aqua-blue text-white px-3 py-1 rounded"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                    onClick={() => {
                      setShowMsgBox(false);
                      setMessage('');
                      setMsgStatus('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {msgStatus && (
                  <div
                    className={`mt-1 text-sm ${
                      msgStatus === 'Message sent!'
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {msgStatus}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
