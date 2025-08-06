import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProfilePDF from "./ProfilePDF.jsx"; // Ensure this file exists

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    tier: "",
    firstname: "",
    lastname: "",
  });

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://nodetraining-ny09.onrender.com/user/getUser", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      const userData = response.data.data[0].user;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        tier: userData.tier || "",
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch("https://nodetraining-ny09.onrender.com/user/edit-profile", formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setEditable(false);
      fetchUser();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="text-center text-white mt-10">
        <p className="animate-pulse">🔄 Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12121a] flex flex-col items-center justify-center p-4">
      {/* Top Controls */}
      <div className="w-full max-w-7xl flex flex-wrap justify-between items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
        >
          ⬅ Back
        </button>

        {user && (
          <PDFDownloadLink
            document={<ProfilePDF user={user} />}
            fileName="User_Profile.pdf"
            style={{
              textDecoration: "none",
              padding: "10px 15px",
              color: "#fff",
              backgroundColor: "#4CAF50",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {({ loading }) =>
              loading ? "Preparing PDF..." : "⬇ Download Profile"
            }
          </PDFDownloadLink>
        )}
      </div>

      <div className="w-full h-full max-w-7xl p-6 md:p-10 bg-[#1f1f2e] text-white rounded-none md:rounded-xl shadow-lg flex flex-col md:flex-row gap-8">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0 md:pr-6">
          <img
            src={user.profile_image_url}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
          />
          <h2 className="text-xl font-semibold mt-4">{formData.name}</h2>
          <p className="text-gray-400">{formData.email}</p>
          <p className="text-sm text-gray-600 mt-1 text-center px-2">ID: {user.unique_id}</p>
        </div>

        {/* Right Side */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name" name="firstname" value={formData.firstname} editable={editable} onChange={handleInputChange} />
            <Field label="Last Name" name="lastname" value={formData.lastname} editable={editable} onChange={handleInputChange} />
            <Field label="Full Name" name="name" value={formData.name} editable={editable} onChange={handleInputChange} />
            <Field label="Email" name="email" value={formData.email} editable={editable} onChange={handleInputChange} type="email" />
            <Field label="Phone Number" name="phone_number" value={formData.phone_number} editable={editable} onChange={handleInputChange} />
            <div>
              <label className="block text-sm mb-1 text-gray-400">Tier</label>
              <input
                type="text"
                name="tier"
                value={formData.tier}
                disabled
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 cursor-not-allowed text-gray-400"
              />
            </div>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={() => {
                if (editable) handleSave();
                else setEditable(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white transition"
            >
              {editable ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Field Component
const Field = ({ label, name, value, editable, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-400">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      className={`w-full p-2 bg-gray-700 rounded border ${
        editable ? "border-gray-500" : "border-gray-600"
      } ${editable ? "" : "text-gray-400 cursor-not-allowed"}`}
    />
  </div>
);

export default Profile;
