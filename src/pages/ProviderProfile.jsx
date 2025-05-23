import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const { user, refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProviderProfile: Fetching provider", id);
    const fetchProvider = async () => {
      try {
        // Try public fetch first (correct endpoint: /providers/:id)
        let response = await fetch(`http://localhost:5000/providers/${id}`);
        if (response.status === 401 || response.status === 403) {
          // If unauthorized, try with token if available
          let token = localStorage.getItem("accessToken");
          if (!token) {
            console.log("ProviderProfile: No token, redirecting to /login");
            navigate("/login");
            return;
          }
          response = await fetch(`http://localhost:5000/providers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 401 || response.status === 403) {
            console.log("ProviderProfile: Attempting token refresh");
            token = await refreshToken();
            if (!token) {
              console.log(
                "ProviderProfile: Refresh failed, redirecting to /login"
              );
              navigate("/login");
              return;
            }
            response = await fetch(`http://localhost:5000/providers/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
        if (!response.ok) {
          throw new Error("Failed to fetch provider");
        }
        const data = await response.json();
        console.log("ProviderProfile: Data received", data);
        setProvider(data);
      } catch (err) {
        console.error("ProviderProfile: Error", err.message);
        setError(err.message);
      }
    };
    fetchProvider();
  }, [id, navigate, refreshToken]);

  const handleContact = async (e) => {
    e.preventDefault();
    console.log("ProviderProfile: Sending message", {
      providerId: provider?.user_id,
      content: messageContent,
    });
    if (!messageContent.trim()) {
      setError("Message content cannot be empty");
      return;
    }
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
          content: messageContent,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      console.log("ProviderProfile: Message sent");
      setMessageContent("");
      alert("Message sent!");
    } catch (err) {
      console.error("ProviderProfile: Contact error", err.message);
      setError(err.message);
    }
  };

  if (error) {
    console.log("ProviderProfile: Rendering error state", error);
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }
  if (!provider) {
    console.log("ProviderProfile: Rendering loading state");
    return (
      <div className="text-center py-12">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin mx-auto"></div>
        <p className="text-gray-600">Loading provider...</p>
      </div>
    );
  }

  console.log("ProviderProfile: Rendering provider", provider);
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          {provider.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
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
                    "ProviderProfile: Image load error for",
                    provider.name
                  );
                }}
              />
            </div>
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
                ({provider.rating || "0"} stars | {provider.reviews || 0}{" "}
                Reviews)
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
              Price Range: KES{" "}
              {provider.price_range_min?.toLocaleString() || "N/A"} -{" "}
              {provider.price_range_max?.toLocaleString() || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">
              Service Areas: {provider.service_areas?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">
              Services: {provider.services?.join(", ") || "N/A"}
            </p>
            {user && (
              <form onSubmit={handleContact} className="contact-form">
                <textarea
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Type your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-aqua-teal text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition duration-300"
                >
                  Contact Provider
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
