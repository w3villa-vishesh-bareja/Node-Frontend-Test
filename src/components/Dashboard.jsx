import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const navigate = useNavigate();

    // Handler for logout functionality
    const handleLogout = () => {
        sessionStorage.removeItem("token"); 
        sessionStorage.removeItem("email");   
        sessionStorage.removeItem("id");   
        sessionStorage.removeItem("phone_number");   
        sessionStorage.removeItem("user");
        navigate("/register/login");
    };

    // Fetch todos from API
    const fetchTodos = async () => {
        console.log("Fetching todos from API");
        // Simulate API call
        const fetchedTodos = [
            { id: 1, task: "Learn React", completed: false },
            { id: 2, task: "Build a Todo App", completed: true },
        ];
        setTodos(fetchedTodos);
    };

    // Add a new todo
    const handleAddTodo = async () => {
        if (newTodo.trim() === "") return;
        console.log("Adding new todo via API");
        // Simulate API call
        const addedTodo = { id: Date.now(), task: newTodo, completed: false };
        setTodos([...todos, addedTodo]);
        setNewTodo("");
    };

    // Toggle todo completion
    const handleToggleTodo = async (id) => {
        console.log(`Toggling todo completion via API for id: ${id}`);
        // Simulate API call
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    // Delete a todo
    const handleDeleteTodo = async (id) => {
        console.log(`Deleting todo via API for id: ${id}`);
        // Simulate API call
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    useEffect(() => {
        const getTokenFromCookie = () => {
            const tokenMatch = document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="));
              return tokenMatch ? tokenMatch.split("=")[1] : null;
          };
          const token = getTokenFromCookie();
          console.log(token)
          if (token) {
            sessionStorage.setItem("token", token);
          }else{
            navigate("/login")
          }
            (
            async ()=>{
            try {
                const response = await axios.get("http://localhost:5000/user/getUser" , {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                sessionStorage.setItem("user",JSON.stringify(response.data.data[0].user));
              } catch (error) {
                console.error(error);
                navigate('/login')
              }
          })();
        fetchTodos();
    }, []);

    return (
        <div style={{ backgroundColor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
            <nav style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                <h1>Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#bb86fc",
                        color: "#121212",
                        border: "none",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </nav>

            
            <div style={{ padding: "2rem" }}>
                <h2>Todo List</h2>
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task"
                        style={{
                            padding: "0.5rem",
                            marginRight: "0.5rem",
                            backgroundColor: "#333",
                            color: "#fff",
                            border: "1px solid #555",
                        }}
                    />
                    <button
                        onClick={handleAddTodo}
                        style={{
                            backgroundColor: "#03dac6",
                            color: "#121212",
                            border: "none",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                        }}
                    >
                        Add
                    </button>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.5rem",
                                padding: "0.5rem",
                                backgroundColor: "#333",
                                borderRadius: "4px",
                            }}
                        >
                            <span
                                onClick={() => handleToggleTodo(todo.id)}
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                    cursor: "pointer",
                                }}
                            >
                                {todo.task}
                            </span>
                            <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                style={{
                                    backgroundColor: "#cf6679",
                                    color: "#121212",
                                    border: "none",
                                    padding: "0.5rem",
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;