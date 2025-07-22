import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNextAction } from "../context/NextActionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const { nextAction, setNextAction } = useNextAction();
  const email = sessionStorage.getItem("email");
  const unique_id = sessionStorage.getItem("id");
  const number = sessionStorage.getItem("phone_number");
  const navigate = useNavigate();

  function handleChange(e) {
    setOtp(e.target.value);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    try {
      const response = await axios.post(
        "https://nodetraining-ny09.onrender.com/register/verifyOtp",
        {
          unique_id,
          number,
          otp,
        }
      );

      if (response.data.success === true) {
        console.log("first")
        setNextAction(response.data.data[0].next_action);

        toast.success("✅ Verified successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        
        // Delay state update & navigation to avoid race condition with re-render
        setTimeout(() => {
          console.log("second");
          setNextAction(response.data.data[0].next_action);
          navigate("/register/createProfile/");
        }, 2100);

      }  
      else{
        setError("❌ Wrong OTP. Please try again.");
        setShowResend(true);
      }    
    } catch (err) {
      console.error(err.message);
      setError("An error occurred during verification.");
      setShowResend(true);
    }
  }

  async function handleResendOtp() {
    try {
      const response = await axios.post(
        "https://nodetraining-ny09.onrender.com/register/sendOTP",
        {
          unique_id,
          number,
        }
      );
      if (response.data.success) {
        setError("OTP resent successfully.");
        setShowResend(false);
      } else {
        setError("Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Error resending OTP.");
    }
  }

  useEffect(() => {
    if (nextAction !== "PHONE_VERIFICATION" || nextAction == null) {
      navigate("/register/createProfile");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-600">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Verify Phone Number</h1>
          <p className="text-sm text-gray-400 mt-2">
            Enter the OTP sent to your number
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900 border border-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP..."
            required
            value={otp}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </form>

        {showResend && (
          <button
            onClick={handleResendOtp}
            className="w-full mt-4 text-blue-400 hover:underline text-sm"
          >
            Resend OTP
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default VerifyOtp;
