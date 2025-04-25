import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNextAction } from "../context/NextActionContext";

function Login() {
  const navigate = useNavigate();
  const { nextAction, setNextAction , token , setToken } = useNextAction();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGoogleLogin() {
    try {
      window.location.href = "http://localhost:5000/auth/google";
    } catch (error) {
      console.error("Google Auth Error:", error.response?.data || error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        ...formData,
      });

      if (response.data.success === true) {
        const nextAction = response.data.data[0].user.next_action;
        setNextAction(nextAction);
        console.log(response.data.data[0].token)

        setToken(response.data.data[0].token);
        console.log(token)
        if (nextAction === "NONE") {
          sessionStorage.setItem("token",response.data.data[0].token);

          navigate("/dashboard");
        } else if (nextAction === "PHONE_VERIFICATION") {
          navigate("/register/EnterNumber");
        } else if (nextAction === "CREATE_PROFILE") {
          navigate("/register/createProfile");
        } else if (nextAction === "UPLOAD_PROFILE_PHOTO") {
          navigate("/register/uploadProfile");
        } else {
          console.warn("Unknown next_action:", nextAction);
        }
      }
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login Error:", error.response?.data || error.message);
    }
  }
  useEffect
  (() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-xl p-12 w-full max-w-lg border border-red-600">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">Welcome Back</h1>
          <p className="text-base text-gray-400">
            Please enter your details to sign in
          </p>
        </div>

        <div className="mb-8">
          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg px-5 py-3 hover:bg-[#2a2a2a] transition text-white text-lg"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="h-6 w-6"
            />
            Sign in with Google
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full text-lg px-5 py-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={handleChange}
            required
            value={formData.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full text-lg px-5 py-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={handleChange}
            required
            value={formData.password}
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white text-lg rounded-lg py-3 hover:bg-red-700 transition cursor-pointer"
          >
            Sign In
          </button>
          {error && (
    <p className="text-red-500 text-sm mt-2">
      {error}
    </p>
  )}
        </form>

        <p className="text-center text-base text-gray-400 mt-8">
          Don’t have an account yet?{" "}
          <a
            href="/register/email"
            className="text-red-400 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
 