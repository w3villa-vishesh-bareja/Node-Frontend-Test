import React, { useEffect, useState } from "react";
import { useNextAction } from "../context/NextActionContext";
import { useNavigate } from "react-router-dom";

function PhotoUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const email = localStorage.getItem('email')
  const {nextAction , setNextAction} = useNextAction();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", image);
    formData.append("email",email);

    try {
      const res = await fetch("http://localhost:5000/register/uploadProfile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success==true) {
        alert("Image uploaded successfully!");
        setNextAction(data.data[0].next_action);
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  useEffect(()=>{
    if(nextAction != "UPLOAD_PROFILE_PHOTO" || nextAction == null) {
      navigate("/register/email");
    }
  },[])
  return (
    <form
    onSubmit={handleSubmit}
    className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center gap-4"
  >
    <h2 className="text-xl font-semibold text-gray-800">Upload Your Photo</h2>

    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
    />

    {preview && (
      <img
        src={preview}
        alt="Preview"
        className="mt-4 rounded-xl w-32 h-32 object-cover border"
      />
    )}

    <button
      type="submit"
      className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
    >
      Upload
    </button>
  </form>
  );
}

export default PhotoUpload;
