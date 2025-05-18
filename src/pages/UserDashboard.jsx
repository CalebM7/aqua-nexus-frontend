import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import "../index.css";

export default function UserDashboard() {
  const { user, isAuthenticated, loading, attemptRefreshToken, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    console.log("UserDashboard: useEffect running", {
      user,
      isAuthenticated,
      loading,
      localStorage: {
        accessToken: !!localStorage.getItem("accessToken"),
        refreshToken: !!localStorage.getItem("refreshToken"),
        user: !!localStorage.getItem("user"),
      },
    });

    if (loading) {
      console.log("UserDashboard: Loading state, waiting...");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("UserDashboard: Not authenticated, redirecting to /login");
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "user") {
      console.log("UserDashboard: Non-user role, redirecting to /", {
        role: user.role,
      });
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      setFetchLoading(true);
      try {
        console.log("UserDashboard: Fetching data with token:", accessToken?.slice(0, 10) + "...");
        let projectsResponse = await fetch("http://localhost:5000/projects/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        let messagesResponse = await fetch("http://localhost:5000/messages/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (projectsResponse.status === 401) {
          console.log("UserDashboard: 401 for projects, attempting token refresh");
          const newToken = await attemptRefreshToken("fetchProjects");
          projectsResponse = await fetch("http://localhost:5000/projects/me", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
        if (messagesResponse.status === 401) {
          console.log("UserDashboard: 401 for messages, attempting token refresh");
          const newToken = await attemptRefreshToken("fetchMessages");
          messagesResponse = await fetch("http://localhost:5000/messages/user", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }

        if (!projectsResponse.ok) {
          const errorData = await projectsResponse.json();
          throw new Error(
            `Failed to fetch projects: ${errorData.error || "Unknown error"}`
          );
        }
        if (!messagesResponse.ok) {
          const errorData = await messagesResponse.json();
          throw new Error(
            `Failed to fetch messages: ${errorData.error || "Unknown error"}`
          );
        }

        const projectsData = await projectsResponse.json();
        const messagesData = await messagesResponse.json();
        console.log("UserDashboard: Data fetched", {
          projects: projectsData.length,
          messages: messagesData.length,
        });
        setProjects(projectsData);
        setMessages(messagesData);
      } catch (err) {
        console.error("UserDashboard: Fetch error:", err.message);
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, loading, navigate, accessToken, attemptRefreshToken]);

  const handleProjectPosted = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const handleReply = async (messageId, receiverId) => {
    const content = replyContent[messageId]?.trim();
    if (!content) {
      setError("Reply content cannot be empty");
      return;
    }

    try {
      console.log("UserDashboard: Sending reply with token:", accessToken?.slice(0, 10) + "...");
      let response = await fetch("http://localhost:5000/messages/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content,
          receiver_id: receiverId,
          project_id: null,
        }),
      });

      if (response.status === 401) {
        console.log("UserDashboard: 401 for reply, attempting token refresh");
        const newToken = await attemptRefreshToken("sendReply");
        response = await fetch("http://localhost:5000/messages/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify({
            content,
            receiver_id: receiverId,
            project_id: null,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to send reply: ${errorData.error || "Unknown error"}`
        );
      }

      setReplyContent({ ...replyContent, [messageId]: "" });
      alert("Reply sent successfully!");
      const messagesResponse = await fetch("http://localhost:5000/messages/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (messagesResponse.ok) {
        setMessages(await messagesResponse.json());
      }
    } catch (err) {
      console.error("UserDashboard: Reply error:", err.message);
      setError(err.message);
    }
  };

  if (fetchLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="bg-aqua-blue text-white py-2 px-4 rounded hover:bg-opacity-90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-aqua-blue mb-8 text-center">
          User Dashboard
        </h2>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Post a New Project
          </h3>
          <ProjectForm onProjectPosted={handleProjectPosted} />
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Messages</h3>
          {messages.length === 0 ? (
            <p>No messages received.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((msg) => (
                <li key={msg.id} className="border p-4 rounded bg-gray-50">
                  <p>
                    <strong>From:</strong> {msg.sender_email}
                    {msg.project_title
                      ? ` (Project: ${msg.project_title})`
                      : ""}
                  </p>
                  <p>{msg.content}</p>
                  <p>
                    <small>
                      Sent: {new Date(msg.created_at).toLocaleString()}
                    </small>
                  </p>
                  <textarea
                    className="w-full p-2 border rounded mt-2"
                    placeholder="Type your reply..."
                    value={replyContent[msg.id] || ""}
                    onChange={(e) =>
                      setReplyContent({
                        ...replyContent,
                        [msg.id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleReply(msg.id, msg.sender_id)}
                    className="bg-aqua-blue text-white p-2 rounded mt-2"
                  >
                    Reply
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Your Projects
          </h3>
          {projects.length === 0 ? (
            <p>No projects posted yet.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="border p-4 rounded bg-gray-50">
                  <p>
                    <strong>{project.title}</strong>
                  </p>
                  <p>{project.description || "No description"}</p>
                  <p>
                    <small>
                      Service: {project.service_type} | Budget: KES
                      {project.budget || "N/A"} | Status: {project.status}
                    </small>
                  </p>
                  {project.lat && project.long && (
                    <p>
                      <small>
                        Location: ({project.lat}, {project.long})
                      </small>
                    </p>
                  )}
                  <p>
                    <small>Permit Required: {project.permit_required ? "Yes" : "No"}</small>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}