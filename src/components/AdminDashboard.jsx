import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const admin = JSON.parse(sessionStorage.getItem("user"));

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://nodetraining-ny09.onrender.com/admin/users", {
                withCredentials: true
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error("❌ Error fetching users:", error);
        }
    };

    const toggleBlockUser = async (userId, isActive) => {
        const action = isActive ? "block" : "unblock";

        try {
            await axios.patch(`https://nodetraining-ny09.onrender.com/admin/users/${userId}/${action}`);
            fetchUsers();
        } catch (error) {
            console.error(`❌ Error trying to ${action} user:`, error);
        }
    };

    const upgradeTier = async (userId, currentTier) => {
        const tiers = ["TIER_1", "TIER_2", "TIER_3"];
        const nextTierIndex = tiers.indexOf(currentTier) + 1;
        if (nextTierIndex >= tiers.length) return;

        try {
            await axios.patch(`https://nodetraining-ny09.onrender.com/admin/users/${userId}/tier`, {
                tier: tiers[nextTierIndex]
            });
            fetchUsers();
        } catch (error) {
            console.error("❌ Error upgrading tier:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-8">
            {/* Admin Profile Top Left */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        <img
                            src={admin?.profile_image_url || "https://via.placeholder.com/40"}
                            alt="Admin"
                            className="w-10 h-10 rounded-full border border-gray-600"
                        />
                        <span className="font-medium">{admin?.name || "Admin"}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                            <ul className="py-2 text-sm text-gray-200">
                                <li
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    User Dashboard
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                    // Add your profile logic or navigation here
                                    console.log("View Profile clicked");
                                    }}
                                >
                                    View Profile
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard - User Listing</h2>

            <div className="overflow-x-auto rounded-xl bg-gray-800/30 backdrop-blur-md shadow-lg">
                <table className="min-w-full divide-y divide-gray-700 text-white">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Tier</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-700/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.phone_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.tier}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleBlockUser(user.id, user.isActive)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                                user.isActive
                                                    ? "bg-red-600 hover:bg-red-700"
                                                    : "bg-green-600 hover:bg-green-700"
                                            }`}
                                        >
                                            {user.isActive ? "Block" : "Unblock"}
                                        </button>
                                        <button
                                            disabled={user.tier === "TIER_3"}
                                            onClick={() => upgradeTier(user.id, user.tier)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                                user.tier === "TIER_3"
                                                    ? "bg-gray-600 cursor-not-allowed"
                                                    : "bg-purple-600 hover:bg-purple-700"
                                            }`}
                                        >
                                            Upgrade Tier
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
