import React, { useState } from 'react';
import { FiClock, FiChevronDown, FiCheck, FiUser } from 'react-icons/fi';
import axios from 'axios';

const TaskCard = ({ task, onStatusChange, projectId, userId, userDetails }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const statusOptions = ['todo', 'in-progress', 'completed'];

  // Filter out the current user from available users
  const availableUsers = userDetails?.filter(user => user.role !== 'owner') || [];

  const handleAssignUser = async (assignedUserId) => {
    try {
      const response = await axios.post('http://localhost:5000/task/changeAssignedTo', {
        userId,
        projectId,
        taskId: task.id,
        assigned_to: [assignedUserId]
      });

      if (response.data.success) {
        // Close dropdown and refresh the board
        setShowUserDropdown(false);
        // You might want to add an onAssign prop to refresh the board
        if (typeof onStatusChange === 'function') {
          onStatusChange(task.id, task.status);
        }
      }
    } catch (error) {
      console.error('Failed to assign user:', error);
      alert(error.response?.data?.message || 'Failed to assign user');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className={`
      relative group flex flex-col p-4 rounded-xl backdrop-blur-sm
      border transition-all duration-300 hover:translate-y-[-2px]
      ${getStatusColor(task.status)}
    `}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white/90 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          {/* User Assignment Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                       bg-gray-700/50 text-gray-300 hover:bg-gray-700 
                       transition-all duration-300"
            >
              <FiUser className="w-4 h-4" />
              <FiChevronDown className={`w-4 h-4 transition-transform duration-300 
                ${showUserDropdown ? 'transform rotate-180' : ''}`} 
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl 
                            border border-gray-700 overflow-hidden z-50">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssignUser(user.id)}
                    className={`
                      flex items-center gap-2 w-full px-4 py-2 text-sm
                      hover:bg-gray-700 transition-colors duration-200
                      ${task.assigned_to?.id === user.id 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300'}
                    `}
                  >
                    <img 
                      src={user.profile_image_url || 
                           `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{user.name}</span>
                    {task.assigned_to?.id === user.id && <FiCheck className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Existing Status Dropdown */}
          <div className="relative ml-4">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                transition-all duration-300 
                ${getStatusColor(task.status)} hover:bg-opacity-20
              `}
            >
              <span className="capitalize">{task.status}</span>
              <FiChevronDown className={`w-4 h-4 transition-transform duration-300 
                ${showStatusDropdown ? 'transform rotate-180' : ''}`} 
              />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl 
                            border border-gray-700 overflow-hidden z-50">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(task.id, status);
                      setShowStatusDropdown(false);
                    }}
                    className={`
                      flex items-center gap-2 w-full px-4 py-2 text-sm capitalize
                      hover:bg-gray-700 transition-colors duration-200
                      ${task.status === status 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300'}
                    `}
                  >
                    {task.status === status && <FiCheck className="w-4 h-4" />}
                    <span>{status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {task.assigned_to && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img 
                    src={task.assigned_to.profile_image_url || 
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assigned_to.name)}&background=random`}
                    alt={task.assigned_to.name}
                    className="w-6 h-6 rounded-full ring-2 ring-gray-700"
                  />
                </div>
                <span className="text-sm text-gray-400">
                  {task.assigned_to.name}
                </span>
              </div>
            )}
          </div>

          {task.deadline && (
            <div className="flex items-center gap-1 text-gray-400">
              <FiClock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;