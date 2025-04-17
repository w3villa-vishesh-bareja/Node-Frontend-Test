import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";
import { useNavigate } from "react-router-dom";

const CollaborativeProject = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const fetchProjects = async () => {
        try {
            const res = await axios.post("http://localhost:5000/project/getAllProjects", {
                userId: user.id
            });
            setProjects(res.data.data[0]);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        }
    };
    async function handleProjectClick(projectUniqueId) {
        const res = await fetch(`/api/project/details?projectUniqueId=${projectUniqueId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: YOUR_USER_ID }),
        });
      
        const data = await res.json();
        if (data.success) {
          renderProjectDetails(data.data[0]);
        } else {
          console.error(data.message);
        }
      }
    const handleCreateProject = async ({ name, deadline }) => {
        try {
            await axios.post("http://localhost:5000/project/createProject", {
                name,
                deadline,
                userId: user.id,
                type: "collaborative"
            });
            fetchProjects(); // Refresh
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    function renderProjectDetails(project){
        navigate(`/project/${project.unique.id}`)
    }
    useEffect(() => {
        if (user?.id) fetchProjects();
    }, [user]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Collaborative Projects</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create Project
                </button>
            </div>

            <ul className="space-y-3" >
                {projects.map((project) => (
                    <li key={project.id} className="bg-gray-800 p-4 rounded shadow" onClick={handleProjectClick(project.unique_id)}>
                        <div className="text-lg">{project.name}</div>
                        <div className="text-sm text-gray-400">Status: {project.status}</div>
                        <div className="text-sm text-gray-400">Deadline: {project.deadline?.split("T")[0]}</div>
                    </li>
                ))}
            </ul>

            <CreateProjectModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateProject}
                userId={user.id}
            />
        </div>
    );
};

export default CollaborativeProject;
