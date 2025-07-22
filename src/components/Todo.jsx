import React, { useState, useEffect } from "react";
import axios from "axios";
import EditTaskModal from './EditTaskModal';
import CreateTaskModal from "./CreateTaskModal";
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'; 

const Todo = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const fetchTodos = async () => {
    try {
      const response = await axios.post(
        "https://nodetraining-ny09.onrender.com/task/getSimpleTasks",
        {
          userId: user.id,
          type: "simple",
        }
      );
      const tasks = response.data.data[0];
      setTodos(tasks);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  useEffect(() => {
    console.log(user);
    if (!user) return;
    fetchTodos();
  }, [user]);

  const handleAddTodo = async (formData) => {
    try {
      const response = await axios.post(
        "https://nodetraining-ny09.onrender.com/task/createSimpleTask",
        {
          userId: user.id,
          title: formData.title,
          description: formData.description || "This is a new todo",
        }
      );
      const createdTask = response.data.data[0];
      if (createdTask) {
        setTodos([...todos, createdTask]);
      } else {
        console.error("Failed to create task: Invalid response from API");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };
  const handleDeleteMultipleTodos = async () => {
    try {
      await axios.delete(
        "https://nodetraining-ny09.onrender.com/task/deleteMultipleSimpleTasks",
        {
          data: {
            userId: user.id,
            type: "simple",
            taskIds: deleteList,
          },
        }
      );
      setTodos(todos.filter((todo) => !deleteList.includes(todo.id)));
      setDeleteList([]);
    } catch (error) {
      console.error("Failed to delete todos:", error);
    }
  };
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete("https://nodetraining-ny09.onrender.com/task/deleteSimpleTaskSingle", {
        data: {
          userId: user.id,
          type: "simple",
          taskId: id,
        },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      // fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleSelectTodo = (id) => {
    if (deleteList.includes(id)) {
      setDeleteList(deleteList.filter((todoId) => todoId !== id));
    } else {
      setDeleteList([...deleteList, id]);
    }
  };
  const handleEdit = async (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };
  
  const handleEditSave = (updatedTask) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTask.id ? updatedTask : todo
    ));
    setEditingTask(null);
  };
  console.log(user);

  return (
    <div className="min-h-screen bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white/90 tracking-wide">Todo List</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDeleteMultipleTodos}
            className={`
              group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
              ${deleteList.length === 0 
                ? 'hidden' 
                : 'bg-red-500/80 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'}
            `}
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete Selected</span>
          </button>
          
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                     text-white px-4 py-2 rounded-lg transition-all duration-300 
                     hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105
                     shadow-lg hover:shadow-blue-500/25"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`
              group relative flex items-center justify-between p-4 rounded-xl shadow-lg
              backdrop-blur-md transition-all duration-300 hover:translate-x-2
              ${todo.status === 'completed' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : todo.status === 'in-progress' 
                ? 'bg-yellow-500/10 border border-yellow-500/20' 
                : 'bg-gray-700/30 border border-gray-600/20'}
            `}
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={deleteList.includes(todo.id)}
                onChange={() => handleSelectTodo(todo.id)}
                className="w-5 h-5 rounded border-gray-500 text-blue-500 
                         focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <div className="flex flex-col">
                <span className="text-lg text-white/90 font-medium">{todo.title}</span>
                {todo.description && (
                  <span className="text-sm text-gray-400">{todo.description}</span>
                )}
                {todo.deadline && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(todo.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleEdit(todo)}
                className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 
                         text-cyan-500 hover:bg-cyan-500/20 transition-all duration-300"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                disabled={deleteList.length > 0}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 
                         text-red-500 hover:bg-red-500/20 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 
                       px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create your first task</span>
            </button>
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onCreate={handleAddTodo}
      />
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={editingTask}
        userId={user?.id}
        onEdit={handleEditSave}
      />
    </div>
  );
};

export default Todo;
