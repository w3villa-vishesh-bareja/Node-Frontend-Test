import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationDropdown from './NotificationDropdown';
import Todo from "./Todo";
import Group from "./Group";
import CollaborativeProject from "./Collaborative";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("todo");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/register/login");
    };

    const handleUpgrade = () => {   
        navigate("/upgrade",{
            state:{
                user:user
            }
        });
    }
    useEffect(() => {
        let token = sessionStorage.getItem("token");

        const getTokenFromCookie = () => {
            const tokenMatch = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
            return tokenMatch ? tokenMatch.split("=")[1] : null;
        };

        if (!token) token = getTokenFromCookie();
        if (!token) {
            navigate("/login");
            return;
        }

        sessionStorage.setItem("token", token);

        (async () => {
            try {
                const response = await axios.get("https://nodetraining-ny09.onrender.com/user/getUser", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data.data[0].user;
                sessionStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        })();
    }, []);
    console.log(user);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Top Navbar - Modernized */}
            <nav className="backdrop-blur-md bg-gray-800/30 sticky top-0 z-50 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            {user && (
                                <>
                                    <div className="relative">
                                        <img
                                            src={user.photo || "https://lh3.googleusercontent.com/a/ACg8ocIa4g1EMnGziirPjc6zDlB3CfjzK-BJrpclmyhVTmIAJ0piRg=s96-c"}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full ring-2 ring-purple-500/50 transition-all duration-300 hover:ring-purple-500"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-medium text-white/90">{user.name}</span>
                                        <span className="text-sm text-gray-400">{user.tier}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {(user?.tier === 'TIER_1' || user?.tier === 'TIER_2') && (
                                <button
                                    onClick={handleUpgrade}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                                             text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105
                                             shadow-lg hover:shadow-purple-500/25"
                                >
                                    Upgrade Tier
                                </button>
                            )}
                            {user && <NotificationDropdown userId={user.id} />}

                            <button
                                onClick={handleLogout}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg
                                         transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tabs - Modernized */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-center gap-4 bg-gray-800/30 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    {[
                        { id: "todo", label: "Todo" },
                        { id: "group", label: "Group" },
                        { id: "collab", label: "Collaborative Project" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105
                                ${activeTab === tab.id 
                                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg" 
                                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Modernized */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
                    {activeTab === "todo" && <Todo user={user} />}
                    {activeTab === "group" && <Group user={user} />}
                    {activeTab === "collab" && <CollaborativeProject user={user} />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
