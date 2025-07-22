import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiClock, FiActivity, FiTrash2 } from 'react-icons/fi';

const CollaborativeProject = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    
    const fetchProjects = async () => {
        try {
            const res = await axios.post("https://nodetraining-ny09.onrender.com/project/getAllProjects", {
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
      const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation(); 
        try{
            const response = await axios.delete(`https://nodetraining-ny09.onrender.com/project/deleteProject`, {
                data: {
                    userId: user.id,
                    projectId: projectId
                }
            });
            if (response.data.success) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const handleCreateProject = async ({ name, deadline }) => {
        try {
            await axios.post("https://nodetraining-ny09.onrender.com/project/createProject", {
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
        <div className="min-h-screen bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            {user.tier !== "TIER_2" && user.tier !== "TIER_3" ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="bg-gray-800/80 backdrop-blur-md text-white p-8 rounded-xl shadow-lg 
                                  border border-gray-700/50 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text 
                                     bg-gradient-to-r from-blue-400 to-purple-400">
                            Upgrade Required
                        </h2>
                        <p className="mb-6 text-gray-300 leading-relaxed">
                            To access Collaborative Projects and unlock advanced features, 
                            please upgrade to Tier 2 or Tier 3.
                        </p>
                        <button
                            onClick={() => navigate("/upgrade", { state: { user }})}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 
                                     hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 
                                     rounded-lg transition-all duration-300 transform hover:scale-105
                                     shadow-lg hover:shadow-purple-500/25"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold text-white/90 tracking-wide">
                            Collaborative Projects
                        </h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                                     text-white px-4 py-2 rounded-lg transition-all duration-300 
                                     hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105
                                     shadow-lg hover:shadow-blue-500/25"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span>Create Project</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => handleProjectClick(project.unique_id)}
                                className="group bg-gray-800/50 backdrop-blur-md border border-gray-700/50 
                                         p-6 rounded-xl shadow-lg transition-all duration-300 
                                         hover:bg-gray-800/70 hover:shadow-xl hover:scale-105 cursor-pointer"
                            >
                                <h3 className="text-xl font-medium text-white/90 mb-4">
                                    {project.name}
                                </h3>
                                {project.owner === user.id && (
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.unique_id)}
                                            className="text-red-500 cursor-pointer "
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                <h3 className="text-md font-light text-white/90 mb-4">
                                    Project Owner: {project.owner_name}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-400">
                                        <FiActivity className="w-4 h-4 mr-2" />
                                        <span className="text-sm capitalize">
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <FiClock className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            {new Date(project.deadline).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 
                                              to-purple-500/10 opacity-0 group-hover:opacity-100 
                                              transition-opacity duration-300 pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-gray-500 text-lg mb-4">No projects yet</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 bg-blue-500/20 text-blue-400 
                                         px-4 py-2 rounded-lg hover:bg-blue-500/30 
                                         transition-all duration-300"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Create your first project</span>
                            </button>
                        </div>
                    )}

                    <CreateProjectModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onCreate={handleCreateProject}
                        userId={user.id}
                    />
                </>
            )}
        </div>
    );
};

export default CollaborativeProject;
