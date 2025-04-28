import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import InviteUserModal from "./InviteuserModal";
import TaskCard from "./TaskCard";
import CreateProjectTaskModal from "./CreateProjectTaskModal";
import { FiUserPlus, FiPlus } from "react-icons/fi";

function ProjectBoard() {
  const [projects, setProjects] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const user = state?.user; // Extract user from state
  const [error, setError] = useState("");
  const { projectUniqueId } = useParams();
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/project/getProjectDetails?projectUniqueId=${projectUniqueId}`,
        {
          userId: user.id,
        }
      );
      const data = res.data;
      console.log(data);
      if (data.success) {
        setProjects(data.data[0]);
        const tasks = data.data[0].tasks;
        setTodos(tasks.filter((task) => task.status === "todo"));
        setInProgress(tasks.filter((task) => task.status === "in-progress"));
        setCompleted(tasks.filter((task) => task.status === "completed"));
      } else {
        setError(data.message || "Failed to fetch projects.");
      }
    } catch (err) {
      console.log("Error fetching projects:", err);
      setError("An error occurred while fetching projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setError("User data is missing. Please navigate from the correct page.");
      setLoading(false);
      return;
    }

    fetchProjects();
  }, [projectUniqueId, user]);

  const handleEdit = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/task/changeStatus`, {
        userId: user.id,
        projectId: projects.id,
        taskId: taskId,
        status: newStatus,
      });

      if (res.data.success) {
        fetchProjects();
      } else {
        setError(res.data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert(error.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-700 rounded mb-4"></div>
          <p className="text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {projects.name}
          </h1>
          <p className="text-gray-400 mt-2">
            {projects.description || "No description provided"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                     text-white px-4 py-2 rounded-lg transition-all duration-300 
                     hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105
                     shadow-lg hover:shadow-blue-500/25"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 
                     text-white px-4 py-2 rounded-lg transition-all duration-300 
                     hover:from-green-600 hover:to-emerald-600 transform hover:scale-105
                     shadow-lg hover:shadow-green-500/25"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Invite User</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="kanban-column bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white/90 p-4 border-b border-gray-700/50">
            Todo
            <span className="ml-2 text-sm text-gray-400">({todos.length})</span>
          </h2>
          <div className="p-4 space-y-4 min-h-[200px]">
            {todos.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleEdit}
                projectId={projects.id}
                userId={user.id}
                userDetails={projects.userDetails}
              />
            ))}
            {todos.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No tasks yet
              </div>
            )}
          </div>
        </div>

        <div className="kanban-column bg-yellow-600/30 backdrop-blur-md rounded-xl border border-yellow-500/20">
          <h2 className="text-xl font-semibold text-white/90 p-4 border-b border-yellow-500/20">
            In Progress
            <span className="ml-2 text-sm text-gray-400">
              ({inProgress.length})
            </span>
          </h2>
          <div className="p-4 space-y-4 min-h-[200px]">
            {inProgress.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleEdit}
                projectId={projects.id}
                userId={user.id}
                userDetails={projects.userDetails}
              />
            ))}
            {inProgress.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No tasks in progress
              </div>
            )}
          </div>
        </div>

        <div className="kanban-column bg-green-700/30 backdrop-blur-md rounded-xl border border-green-500/20">
          <h2 className="text-xl font-semibold text-white/90 p-4 border-b border-green-500/20">
            Completed
            <span className="ml-2 text-sm text-gray-400">
              ({completed.length})
            </span>
          </h2>
          <div className="p-4 space-y-4 min-h-[200px]">
            {completed.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleEdit}
                projectId={projects.id}
                userId={user.id}
                userDetails={projects.userDetails}
              />
            ))}
            {completed.length === 0 && (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No completed tasks
              </div>
            )}
          </div>
        </div>
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        projectId={projects.id}
        userId={user.id}
      />

      <CreateProjectTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        projectId={projects.id}
        userId={user.id}
        onTaskCreated={fetchProjects}
        userDetails={projects.userDetails}
      />
    </div>
  );
}

export default ProjectBoard;
