import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useNextAction } from "../context/NextActionContext";

function Login() {
  const navigate = useNavigate();
  const { nextAction, setNextAction, token, setToken } = useNextAction();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://nodetraining-ny09.onrender.com/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await axios.post("https://nodetraining-ny09.onrender.com/login", formData);
      if (response.data.success === true) {
        const userData = response.data.data[0];
        setNextAction(userData.user.next_action);
        setToken(userData.token);

        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("id", userData.user.unique_id);
        sessionStorage.setItem("email", userData.user.email);
        socket.emit("register_user", userData.token);

        switch (userData.user.next_action) {
          case "NONE":
            navigate("/dashboard");
            break;
          case "PHONE_VERIFICATION":
            navigate("/register/EnterNumber");
            break;
          case "CREATE_PROFILE":
            navigate("/register/createProfile");
            break;
          case "UPLOAD_PROFILE_PHOTO":
            navigate("/register/uploadProfile");
            break;
          default:
            console.warn("Unknown next_action:", userData.user.next_action);
        }
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) navigate("/dashboard");
    sessionStorage.clear();
  }, [navigate]);

  return (
    <div className="min-h-screen relative bg-[#0f0f0f] overflow-hidden">
      {/* Glowing abstract blobs */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-red-500 rounded-full opacity-30 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500 rounded-full opacity-30 blur-[120px] animate-pulse delay-200"></div>

      <div className="min-h-screen flex items-center justify-center px-4 text-white relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-xl p-10 w-full max-w-md transition-all duration-300">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3771/3771380.png"
              alt="Task Manager Logo"
              className="w-14 h-14 mb-2"
            />
            <h1 className="text-3xl font-bold text-red-500">TaskMaster</h1>
            <p className="text-sm text-gray-400 mt-1">
              Organize your work efficiently
            </p>
          </div>

          {/* Google Sign-in */}
          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg px-5 py-3 hover:bg-[#2a2a2a] transition text-white text-base mb-6"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-700" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border ${
                error ? "border-red-500 ring-1 ring-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-red-500`}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border ${
                  error ? "border-red-500 ring-1 ring-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-red-500`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg text-base font-semibold hover:bg-red-700 transition"
            >
              Sign In
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          {/* Bottom Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register/email" className="text-red-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;