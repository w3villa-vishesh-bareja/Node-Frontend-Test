import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateProjectModal from "./CreateProjectModal";
import CreateTaskModal from "./CreateTaskModal";

const Todo = ({ user }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [showTaskModal, setShowTaskModal] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchTodos = async () => {
            try {
                const response = await axios.post("http://localhost:5000/task/getSimpleTasks", {
                    userId: user.id,
                    type: "simple",
                });
                const tasks = response.data.data[0];
                setTodos(tasks);
            } catch (err) {
                console.error("Failed to fetch todos:", err);
            }
        };
        fetchTodos();
    }, [user]);

    const handleAddTodo = async (title) => {
        try {
            const response = await axios.post("http://localhost:5000/task/createSimpleTask", {
                userId: user.id,
                title: title,
                description: "This is a new todo",
            });
            const createdTask = response.data.data;
            if (createdTask) {
                setTodos([...todos, createdTask]);
            } else {
                console.error("Failed to create task: Invalid response from API");
            }
        } catch (error) {
            console.error("Error creating todo:", error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete("http://localhost:5000/task/deleteSimpleTaskSingle", {
                data: {
                    userId: user.id,
                    type: "simple",
                    taskId: id,
                },
            });
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const handleCreateProject = async ({ name, deadline }) => {
        try {
            await axios.post("http://localhost:5000/project/createProject", {
                name,
                deadline,
                userId: user.id,
                type: "collaborative",
            });
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Todo List</h2>
                <div className="space-x-3">
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-light"
                    >
                        + Add Task
                    </button>
                    
                </div>
            </div>
            
            <ul className="space-y-3">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded shadow"
                    >
                        <span>{todo.title}</span>
                        <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <CreateTaskModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onCreate={handleAddTodo}
            />
            

        </div>
    );
};

export default Todo;