import React, { useState } from 'react';
import axios from 'axios';

const CreateProjectTaskModal = ({ isOpen, onClose, projectId, userId, onTaskCreated, userDetails }) => {
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    deadline: '',
    type: 'collaborative',
    assigned_to: null
  });
  const [error, setError] = useState('');

  const availableUsers = userDetails?.filter(user => user.role !== 'owner') || [];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        const assigned_to = formData.assigned_to ? [parseInt(formData.assigned_to)] : null;

      const response = await axios.post('http://localhost:5000/task/createTask', {
        userId,
        projectId,
        ...formData,
        assigned_to
      });

      if (response.data.success) {
        onTaskCreated();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[500px]">
        <h2 className="text-xl font-semibold text-white mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Task Name
            </label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Task Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="collaborative">Collaborative</option>
              <option value="group">Group</option>
            </select>
          </div> */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Assign To
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select user to assign</option>
              {availableUsers.map(user => (
                <div key={user.id} className="flex items-center">
                  <option value={user.id}>
                    {user.name}
                  </option>
                </div>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectTaskModal;