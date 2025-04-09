import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNextAction } from "../context/NextActionContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });
  const [error, setError] = useState("");
  const {nextAction , setNextAction} = useNextAction();
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.username || !formData.firstname || !formData.lastname) {
      setError("Please fill every field");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register/createProfile",
        {
          ...formData,
          email,
        }
      );
      console.log(response.data); 
      setError("");
      if(response.data.success == true){
        setNextAction(response.data.data[0].next_action);
        navigate('register/uploadProfile');
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  }
  useEffect(()=>{
    if(nextAction != "CREATE_PROFILE" || nextAction == null) {
        navigate("/register/email");
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Your Profile
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div>
          <label className="block text-gray-600 mb-1">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="First name"
              required
              value={formData.firstname}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              required
              value={formData.lastname}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;
