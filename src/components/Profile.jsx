import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNextAction } from "../context/NextActionContext";
import { useNavigate } from "react-router-dom";
import { toast , ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
  });

  const { nextAction, setNextAction } = useNextAction();
  const email = sessionStorage.getItem("email");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("clicked")
    if (!formData.username || !formData.firstname || !formData.lastname) {
      console.log("Please fill in all fields");
      toast.error("⚠️ Please fill in all fields.", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
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

      if (response.data.success === true) {
        setNextAction(response.data.data[0].user.next_action);

        toast.success("✅ Profile created successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        setTimeout(() => {
          navigate("/register/uploadProfile");
        }, 2100);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ This username is already taken.", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  }

  useEffect(() => {
    if (nextAction !== "CREATE_PROFILE" || nextAction === null) {
      navigate("/register/email");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
      <div className="bg-[#1e1e1e] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-400">
          Your Profile
        </h2>

        <div>
          <label className="block text-gray-400 mb-1">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="First name"
              required
              value={formData.firstname}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Last name"
              required
              value={formData.lastname}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 hover:bg-blue-700 transition"
        >
          Save
        </button>
        <ToastContainer/>
      </div>
    </div>
  );
}

export default Profile;
