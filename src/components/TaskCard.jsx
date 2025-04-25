import React, { useState } from 'react';

const TaskCard = ({ task, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions = ['todo', 'in-progress', 'completed'];

  return (
    <div className="flex justify-between bg-white/85 p-6 rounded-2xl w-full mb-4">
      <div>
        <div className="title font-black text-xl">
          {task.title}
        </div>
        <div className="name my-2 flex items-center gap-2">
          <div className="avatar w-6 h-6">
            <img 
              className="rounded-full" 
              src={task.assigned_to.profilePhoto} 
              alt={task.assigned_to.name}
            />
          </div>
          <div>{task.assigned_to.name}</div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div>Deadline: {new Date(task.deadline).toLocaleDateString()}</div>
        <div className="relative">
          <button
            className="bg-cyan-600 hover:ring-2 ring-blue-300 p-2 rounded-xl cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Change Status
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 
                    ${task.status === status ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    onStatusChange(task.id, status);
                    setShowDropdown(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;