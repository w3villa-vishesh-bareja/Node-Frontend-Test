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

        console.log(user)
        navigate(`/project/${projectUniqueId}`,{
            state:{
                user:user
            }
        })

      }
    const handleCreateProject = async ({ name, deadline }) => {
        try {
            await axios.post("http://localhost:5000/project/createProject", {
                name,
                deadline,
                userId: user.id,
                type: "collaborative"
            });
            fetchProjects(); 
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };


    useEffect(() => {
        console.log("first")
        if (user?.id) fetchProjects();
    }, []);

    return (
        
        <div className="p-4">
                  {user.tier !== "TIER_2" && user.tier !== "TIER_3" && (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upgrade to Tier 2 or Tier 3</h2>
            <p className="mb-4">To access the Group feature, please upgrade your plan.</p>
            <button
              onClick={() => (window.location.href = "/upgrade")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
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
                    <li key={project.id} className="bg-gray-800 p-4 rounded shadow" onClick={()=>handleProjectClick(project.unique_id)} >
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
