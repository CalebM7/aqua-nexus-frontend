import React, { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProjectForm = ({ onProjectPosted }) => {
  const { user, accessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: 'borehole',
    budget: '',
    location: { lat: '', long: '' },
    permit_required: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'lat' || name === 'long') {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to post a project');
      setLoading(false);
      return;
    }

    if (!accessToken) {
      setError('No access token found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      console.log('ProjectForm: Sending POST with token:', accessToken.slice(0, 10) + '...');
      const response = await fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || null,
          location: {
            lat: parseFloat(formData.location.lat) || null,
            long: parseFloat(formData.location.long) || null,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post project');
      }

      const data = await response.json();
      console.log('ProjectForm: Project posted:', data);
      onProjectPosted(data);
      setFormData({
        title: '',
        description: '',
        service_type: 'borehole',
        budget: '',
        location: { lat: '', long: '' },
        permit_required: false,
      });
      alert('Project posted successfully!');
    } catch (err) {
      console.error('ProjectForm: Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form bg-white p-6 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Post a New Project</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Service Type</label>
        <select
          name="service_type"
          value={formData.service_type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="borehole">Borehole</option>
          <option value="rwh">Rainwater Harvesting</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Budget (KES)</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="lat"
            placeholder="Latitude"
            value={formData.location.lat}
            onChange={handleChange}
            className="w-full border rounded p-2"
            step="any"
          />
          <input
            type="number"
            name="long"
            placeholder="Longitude"
            value={formData.location.long}
            onChange={handleChange}
            className="w-full border rounded p-2"
            step="any"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="permit_required"
            checked={formData.permit_required}
            onChange={handleChange}
            className="mr-2"
          />
          Permit Required
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Posting...' : 'Post Project'}
      </button>
    </form>
  );
};

export default ProjectForm;