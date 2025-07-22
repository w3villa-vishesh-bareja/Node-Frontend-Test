import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast , ToastContainer } from 'react-toastify'; // Import Toastify
import { useNextAction } from '../context/NextActionContext';

function SetUsername() {
  const [username, setUsername] = useState('');
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const navigate = useNavigate();
  const {token , setToken} = useNextAction();
  function handleChange(e) {
    setUsername(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter a username');
      return;
    }

    try {
      const response = await axios.post('https://nodetraining-ny09.onrender.com/setUsername', {
        email: email,
        username: username,
      });

      if (response.data.success) {
        toast.success('✅ Username set successfully!', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'dark',
        });
        sessionStorage.setItem("token",response.data.data[0].token);  
        setTimeout(() => {
          navigate('/dashboard');
        }, 2100);
      }
    } catch (err) {
      if (err.response.status === 409) {
        toast.error('❌ This username already exists.', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'dark',
        });
      } else {
        toast.error('❌ An error occurred. Please try again.', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'dark',
        });
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Enter a unique name</h1>
          <p className="text-sm text-gray-400 mt-2">
            Please enter a unique name to complete the registration process
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter a unique username"
            required
            value={username}
            className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 !important"
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 hover:bg-blue-700 transition"
        >
          Next
        </button>
        <ToastContainer/>
      </div>
    </div>
  );
}

export default SetUsername;
