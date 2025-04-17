import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                const response = await axios.get("http://localhost:5000/user/getUser", {
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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Top Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center gap-3">
                    {user && (
                        <>
                            <img
                                src={user.photo || "https://lh3.googleusercontent.com/a/ACg8ocIa4g1EMnGziirPjc6zDlB3CfjzK-BJrpclmyhVTmIAJ0piRg=s96-c"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                            <span className="text-lg font-medium">{user.name}</span>
                        </>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
                >
                    Logout
                </button>
            </nav>

            {/* Tabs */}
            <div className="flex justify-center gap-6 bg-gray-800 py-4 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab("todo")}
                    className={`px-4 py-2 rounded ${activeTab === "todo" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    Todo
                </button>
                <button
                    onClick={() => setActiveTab("group")}
                    className={`px-4 py-2 rounded ${activeTab === "group" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    Group
                </button>
                <button
                    onClick={() => setActiveTab("collab")}
                    className={`px-4 py-2 rounded ${activeTab === "collab" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    Collaborative Project
                </button>
            </div>

            {/* Section Content */}
            <main className="px-6 py-8">
                {activeTab === "todo" && <Todo user={user} />}
                {activeTab === "group" && <Group user={user} />}
                {activeTab === "collab" && <CollaborativeProject user={user} />}
            </main>
        </div>
    );
};

export default Dashboard;
