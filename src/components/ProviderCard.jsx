import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
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
      </div>
    </div>
  );
}
