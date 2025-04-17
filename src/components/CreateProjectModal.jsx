import React, { useState } from "react";

const CreateProjectModal = ({ isOpen, onClose, onCreate, userId }) => {
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = async () => {
        if (!name || !deadline) {
            alert("Please fill in all fields");
            return;
        }

        await onCreate({ name, deadline });
        setName("");
        setDeadline("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Collaborative Project</h2>
                
                <label className="block mb-2">
                    Project Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-600"
                    />
                </label>

                <label className="block mb-4">
                    Deadline:
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-600"
                    />
                </label>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
