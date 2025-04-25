import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import InviteUserModal from "./InviteuserModal";
import TaskCard from "./TaskCard";
import CreateProjectTaskModal from "./CreateProjectTaskModal";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{projects.name}</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Task
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Invite User
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 flex-1 items-start gap-4 overflow-x-auto">
        <div className="todo flex flex-col h-full justify-start items-center px-8 rounded-xl bg-gray-600/50 border border-gray-400">
          <h2 className="text-2xl font-semibold text-white mb-4 capitalize p-4">
            Todo
          </h2>
          {todos.map((task, i) => (
            <TaskCard key={i} task={task} onStatusChange={handleEdit} />
          ))}
        </div>

        <div className="in-progress flex flex-col h-full justify-start items-center px-8 rounded-xl bg-yellow-500/30 border border-yellow-500">
          <h2 className="text-2xl font-semibold text-white mb-4 capitalize p-4">
            In Progress
          </h2>
          {inProgress.map((task, i) => (
            <TaskCard key={i} task={task} onStatusChange={handleEdit} />
          ))}
        </div>

        <div className="completed flex flex-col h-full justify-start items-center px-8 rounded-xl bg-emerald-600/50 border border-emerald-500">
          <h2 className="text-2xl font-semibold text-white mb-4 capitalize p-4">
            Completed
          </h2>
          {completed.map((task, i) => (
            <TaskCard key={i} task={task} onStatusChange={handleEdit} />
          ))}
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
        userDetails={projects.userDetails} // Pass the userDetails array

      />
    </div>
  );
}

export default ProjectBoard;
