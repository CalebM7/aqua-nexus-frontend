import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function FeaturedProviders() {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        let token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        let response = await fetch("http://localhost:5000/providers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          token = await refreshToken();
          if (!token) return;
          response = await fetch("http://localhost:5000/providers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        if (!response.ok) throw new Error("Failed to fetch providers");
        const data = await response.json();
        const featured = data
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 3);
        setProviders(featured);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchFeaturedProviders();
  }, [navigate, refreshToken]);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <section id="providers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          Featured Service Providers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <img
                src={`http://localhost:5000${provider.image}`}
                alt={provider.name}
                className="w-64 h-48 object-cover rounded-lg"
              />
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
                    ({provider.rating} stars | {provider.reviews || 0} Reviews)
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
                  Price Range: KES {provider.price_range_min?.toLocaleString()}{" "}
                  - {provider.price_range_max?.toLocaleString()}
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
        <div className="text-center mt-12">
          <Link
            to="/providers"
            className="bg-aqua-teal text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition duration-300 shadow-md"
          >
            See All Providers
          </Link>
        </div>
      </div>
    </section>
  );
}
