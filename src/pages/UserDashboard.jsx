import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProjectForm from '../components/ProjectForm';

const UserDashboard = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/projects/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && user?.role === 'user') {
      fetchProjects();
    }
  }, [accessToken, user]);

  const handleProjectPosted = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  if (user?.role !== 'user') {
    return null; // App.jsx handles redirect
  }

  return (
    <div className="dashboard container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <ProjectForm onProjectPosted={handleProjectPosted} />
      <h2 className="text-xl font-semibold mt-6 mb-4">Your Projects</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <p>{project.description}</p>
              <p>Service: {project.service_type}</p>
              <p>Budget: KES {project.budget}</p>
              <p>Location: ({project.lat}, {project.long})</p>
              <p>Permit Required: {project.permit_required ? 'Yes' : 'No'}</p>
              <p>Status: {project.status}</p>
              <p>Created: {new Date(project.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;