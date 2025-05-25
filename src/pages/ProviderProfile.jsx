import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function ProviderProfile() {
  const { id } = useParams();
  const { accessToken, user } = useContext(AuthContext);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/providers/${id}`, {
      headers:
        user?.providerId === id
          ? { Authorization: `Bearer ${accessToken}` }
          : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch provider');
        return res.json();
      })
      .then(setProvider)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, accessToken, user]);

  if (loading)
    return <div className="text-center py-12">Loading profile...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!provider) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
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
            className="w-48 h-48 object-cover rounded-lg border"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2 text-aqua-blue">
              {provider.name}
            </h1>
            <div className="flex items-center mb-2 star-rating">
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
                  return (
                    <i key={index} className="far fa-star text-gray-300"></i>
                  );
                }
              })}
              <span className="text-gray-600 text-sm ml-2">
                ({provider.rating || '0'} stars | {provider.reviews || 0}{' '}
                Reviews)
              </span>
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
            <div className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Certifications:</span>{' '}
              {provider.certifications?.join(', ') || 'None'}
            </div>
            <div className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Description:</span>{' '}
              {provider.description}
            </div>
            {/* Add contact or action buttons as needed */}
          </div>
        </div>
      </div>
    </section>
  );
}
