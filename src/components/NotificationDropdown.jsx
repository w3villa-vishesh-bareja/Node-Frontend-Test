import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi';

const NotificationDropdown = ({ userId }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/project/fetchInvitations`,{
                userId:userId
            });
            if (response.data.success) {
                setInvitations(response.data.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteAction = async (projectId, action) => {
        try {
            await axios.post(`http://localhost:5000/project/${action}Invitation`, {
                projectId,
                userId
            });
            setInvitations(invitations.filter(inv => inv.id !== projectId));
        } catch (error) {
            console.error(`Failed to ${action} invitation:`, error);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            fetchInvitations();
        }
    }, [showDropdown]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-400 hover:text-white rounded-lg 
                         transition-all duration-300 hover:bg-gray-700"
            >
                <FiBell className="w-6 h-6" />
                {invitations.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                                   bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {invitations.length}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-xl 
                               border border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-400">
                                Loading invitations...
                            </div>
                        ) : invitations.length > 0 ? (
                            invitations.map((invitation) => (
                                <div key={invitation.id} 
                                     className="p-4 border-b border-gray-700 hover:bg-gray-700/50">
                                    <p className="text-white mb-2">
                                        Invitation to join project: {invitation.name}
                                    </p>
                                    <p className="text-sm text-gray-400 mb-3">
                                        From: {invitation.invited_by}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleInviteAction(invitation.project_id, 'accept')}
                                            className="px-3 py-1 bg-green-500/20 text-green-400 
                                                     rounded hover:bg-green-500/30 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleInviteAction(invitation.id, 'reject')}
                                            className="px-3 py-1 bg-red-500/20 text-red-400 
                                                     rounded hover:bg-red-500/30 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-400">
                                No pending invitations
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;