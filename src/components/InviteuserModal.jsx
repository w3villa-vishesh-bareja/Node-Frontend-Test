import React, { useState } from 'react';
import axios from 'axios';

const InviteUserModal = ({ isOpen, onClose, projectId, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://nodetraining-ny09.onrender.com/project/searchUser?name=${value}`);
      if (response.data.success) {
        setSearchResults(response.data.data[0]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search users');
    }
  };

  const handleInvite = async (receiverId) => {
    console.log(receiverId)
    try {
      const response = await axios.post('https://nodetraining-ny09.onrender.com/project/inviteUsers', {
        userId,
        receiverId,
        projectId
      });

      if (response.data.success) {
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to invite user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[500px]">
        <h2 className="text-xl font-semibold text-white mb-4">Invite User</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div 
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-gray-700 rounded"
            >
              <span className="text-white">{user.name}</span>
              <button
                onClick={() => handleInvite(user.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Invite
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteUserModal;