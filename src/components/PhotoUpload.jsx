import React, { useEffect, useState } from "react";
import { useNextAction } from "../context/NextActionContext";
import { useNavigate } from "react-router-dom";
import { toast , ToastContainer } from "react-toastify";

function PhotoUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const email = sessionStorage.getItem("email");
  const { nextAction, setNextAction , token ,setToken } = useNextAction();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextAction !== "UPLOAD_PROFILE_PHOTO" || nextAction == null) {
      navigate("/register/email");
    }
  }, []);

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
      toast.error("⚠️ Please select an image.", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", image);
    formData.append("email", email);

    try {
      const res = await fetch("https://nodetraining-ny09.onrender.com/register/uploadProfile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success === true) {
        toast.success("✅ Image uploaded successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        setNextAction(data.data[0].user.next_action);
        setToken(token);
        sessionStorage.setItem(token)
        setTimeout(() => {
          navigate("/dashboard");
        }, 2100);
      } else {
        throw new Error("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const handleSkip = async () => {
    try {
      const res = await fetch("https://nodetraining-ny09.onrender.com/register/uploadProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success === true) {
        toast.info("⏭️ Skipped photo upload.", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        setNextAction(data.data[0].user.next_action);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2100);
      } else {
        throw new Error("Skip failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Try again.", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto mt-16 p-10 bg-[#1e1e1e] rounded-2xl shadow-lg flex flex-col items-center gap-6 text-white border border-blue-500"
      >
        <h2 className="text-2xl font-semibold text-blue-400">Upload Your Photo</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400
                     file:mr-4 file:py-3 file:px-6
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-6 rounded-xl w-40 h-40 object-cover border"
          />
        )}

        <div className="flex gap-6 mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition"
          >
            Skip
          </button>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
}

export default PhotoUpload;
