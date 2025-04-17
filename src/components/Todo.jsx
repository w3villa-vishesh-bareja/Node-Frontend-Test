import React, { useState, useEffect } from "react";
import axios from "axios";

const Todo = ({ user }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

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

    const handleAddTodo = async () => {
        if (newTodo.trim() === "") return;
        try {
            const response = await axios.post("http://localhost:5000/task/createSimpleTask", {
                userId: user.id,
                title: newTodo,
                description: "this is a new tdod"
            });
            setTodos([...todos, response.data.data[0]]);
            setNewTodo("");
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

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Todo List</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleAddTodo}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition"
                >
                    Add
                </button>
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
        </div>
    );
};

export default Todo;
