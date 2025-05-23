import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Providers: Fetching providers");
    const fetchProviders = async () => {
      try {
        const response = await fetch("http://localhost:5000/providers");
        console.log("Providers: Response status", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }
        const data = await response.json();
        console.log("Providers: Data received", data);
        setProviders(data);
        setLoading(false);
      } catch (err) {
        console.error("Providers: Error", err.message);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  if (loading) {
    console.log("Providers: Rendering loading state");
    return <div className="text-center py-12">Loading providers...</div>;
  }
  if (error) {
    console.log("Providers: Rendering error state", error);
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  console.log("Providers: Rendering providers", providers);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          All Service Providers
        </h2>
        {providers.length === 0 ? (
          <p className="text-center text-gray-600">No providers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <div className="w-full overflow-hidden rounded-lg">
                  <img
                    src={
                      provider.image
                        ? `http://localhost:5000${
                            provider.image.startsWith("/")
                              ? provider.image
                              : "/uploads/" + provider.image
                          }`
                        : "https://placehold.co/256x192?text=No+Image"
                    }
                    alt={provider.name}
                    className="w-full aspect-[4/3] object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/256x192?text=No+Image";
                      console.log(
                        "Providers: Image load error for",
                        provider.name
                      );
                    }}
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
                          <i
                            key={index}
                            className="fas fa-star text-yellow-400"
                          ></i>
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
                          <i
                            key={index}
                            className="far fa-star text-gray-300"
                          ></i>
                        );
                      }
                    })}
                    <span className="text-gray-600 text-sm ml-2">
                      ({provider.rating || "0"} stars | {provider.reviews || 0}{" "}
                      Reviews)
                    </span>
                  </div>
                  <div className="mb-3 space-x-2">
                    {provider.certifications?.map((cert) => (
                      <span
                        key={cert}
                        className={`badge ${
                          cert.toLowerCase().includes("eco-friendly") ||
                          cert.toLowerCase().includes("rainwater")
                            ? "bg-aqua-green text-white"
                            : "bg-aqua-blue text-white"
                        }`}
                      >
                        {cert.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-3 text-sm">
                    {provider.description || "No description available"}
                  </p>
                  <p className="text-lg font-semibold text-aqua-teal">
                    Price Range: KES{" "}
                    {provider.price_range_min?.toLocaleString() || "N/A"} -{" "}
                    {provider.price_range_max?.toLocaleString() || "N/A"}
                  </p>
                  <Link
                    to={`/provider/${provider.id}`}
                    className="mt-4 inline-block text-aqua-blue font-semibold hover:underline"
                  >
                    View Profile{" "}
                    <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
