import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationDropdown from './NotificationDropdown';
import Todo from "./Todo";
import CollaborativeProject from "./Collaborative";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("todo");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/register/login");
    };

    const handleUpgrade = () => {
        navigate("/upgrade", { state: { user } });
    };

    useEffect(() => {
        const fetchUser = async () => {
            let token = sessionStorage.getItem("token");

            if (!token) {
                const tokenMatch = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("token="));
                token = tokenMatch ? tokenMatch.split("=")[1] : null;
            }

            try {
                const response = await axios.get("https://nodetraining-ny09.onrender.com/user/getUser", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    withCredentials: true
                });

                const userData = response.data.data[0].user;
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error("❌ Error fetching user:", error);
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    // Handle click outside of dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p className="text-xl animate-pulse">🔄 Verifying user...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Top Navbar */}
            <nav className="backdrop-blur-md bg-gray-800/30 sticky top-0 z-50 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            {user && (
                                <>
                                    <div className="relative" ref={profileRef}>
                                        <img
                                            src={user.photo || "https://lh3.googleusercontent.com/a/ACg8ocIa4g1EMnGziirPjc6zDlB3CfjzK-BJrpclmyhVTmIAJ0piRg=s96-c"}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full ring-2 ring-purple-500/50 transition-all duration-300 hover:ring-purple-500 cursor-pointer"
                                            referrerPolicy="no-referrer"
                                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                        />
                                        {profileMenuOpen && (
                                            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                                            <ul className="py-2 text-sm text-gray-200">
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                                    onClick={() => navigate("/admin/dashboard")}
                                                >
                                                    admin Dashboard
                                                </li>
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                                    onClick={() => {
                                                    // Add your profile logic or navigation here
                                                    console.log("View Profile clicked");
                                                    navigate("/user/profile")
                                                    }}
                                                >
                                                    View Profile
                                                </li>
                                            </ul>
                                        </div>
                                        )}
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

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-center gap-4 bg-gray-800/30 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    {[
                        { id: "todo", label: "Todo" },
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 shadow-lg">
                    {activeTab === "todo" && <Todo user={user} />}
                    {activeTab === "collab" && <CollaborativeProject user={user} />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
