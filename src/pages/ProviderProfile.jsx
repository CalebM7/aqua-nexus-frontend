import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleContact = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerId: provider.user_id,
          content: "Interested in your services!",
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      alert("Message sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        let token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        let response = await fetch(`http://localhost:5000/provider/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          token = await refreshToken();
          if (!token) return;
          response = await fetch(`http://localhost:5000/provider/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        if (!response.ok) throw new Error("Failed to fetch provider");
        const data = await response.json();
        setProvider(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProvider();
  }, [id, navigate, refreshToken]);

  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!provider) return <div className="text-center mt-8">Loading...</div>;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          {provider.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              src={`http://localhost:5000${provider.image}`}
              alt={provider.name}
              className="w-64 h-48 object-cover rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 star-rating">
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
                ({provider.rating} stars | {provider.reviews || 0} Reviews)
              </span>
            </div>
            <div className="mb-4 space-x-2">
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
            <p className="text-gray-600 mb-4">
              {provider.description || "No description available"}
            </p>
            <p className="text-lg font-semibold text-aqua-teal mb-4">
              Service Type: {provider.service_type || "N/A"}
            </p>
            <p className="text-lg font-semibold text-aqua-teal mb-4">
              Price Range: KES {provider.price_range_min?.toLocaleString()} -{" "}
              {provider.price_range_max?.toLocaleString()}
            </p>
            <p className="text-gray-600 mb-4">
              Service Areas: {provider.service_areas?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">
              Services: {provider.services?.join(", ") || "N/A"}
            </p>
            <button
              onClick={handleContact}
              className="bg-aqua-teal text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition duration-300"
            >
              Contact Provider
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
