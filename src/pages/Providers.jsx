import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    service_type: '',
    min_rating: '',
  });

  useEffect(() => {
    console.log('Providers: Fetching providers');
    const fetchProviders = async () => {
      try {
        let url = 'http://localhost:5000/providers';
        const params = [];
        if (filters.location)
          params.push(`location=${encodeURIComponent(filters.location)}`);
        if (filters.service_type)
          params.push(`service_type=${filters.service_type}`);
        if (filters.min_rating) params.push(`min_rating=${filters.min_rating}`);
        if (params.length) url += '?' + params.join('&');
        const response = await fetch(url);
        console.log('Providers: Response status', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch providers');
        }
        const data = await response.json();
        console.log('Providers: Data received', data);
        setProviders(data);
        setLoading(false);
      } catch (err) {
        console.error('Providers: Error', err.message);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProviders();
  }, [filters]);

  if (loading) {
    console.log('Providers: Rendering loading state');
    return <div className="text-center py-12">Loading providers...</div>;
  }
  if (error) {
    console.log('Providers: Rendering error state', error);
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  console.log('Providers: Rendering providers', providers);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          All Service Providers
        </h2>
        <form
          className="mb-8 flex flex-col md:flex-row gap-4 justify-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Location"
            className="p-2 border rounded"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
          <select
            className="p-2 border rounded"
            value={filters.service_type}
            onChange={(e) =>
              setFilters({ ...filters, service_type: e.target.value })
            }
          >
            <option value="">All Services</option>
            <option value="rwh">Rainwater Harvesting</option>
            <option value="borehole">Borehole Drilling</option>
          </select>
          <input
            type="number"
            placeholder="Min Rating"
            className="p-2 border rounded"
            min={1}
            max={5}
            value={filters.min_rating}
            onChange={(e) =>
              setFilters({ ...filters, min_rating: e.target.value })
            }
          />
        </form>
        {providers.length === 0 ? (
          <p className="text-center text-gray-600">No providers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
