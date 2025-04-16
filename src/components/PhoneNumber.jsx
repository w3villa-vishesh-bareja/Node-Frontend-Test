import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNextAction } from "../context/NextActionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PhoneNumber() {
  const [number, setNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { nextAction, setNextAction } = useNextAction();

  const unique_id = sessionStorage.getItem("id");

  function handleChange(e) {
    setNumber(e.target.value);
    setErrorMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!number) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register/sendOTP",
        {
          unique_id: unique_id,
          number: number,
        }
      );

      if (response.data.success === true) {
        sessionStorage.setItem(
          "phone_number",
          response.data.data[0].user.phone_number
        );
        setNextAction(response.data.data[0].next_action);

        toast.success("✅ OTP sent successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });

        setTimeout(() => {
          navigate("/register/verifynumber");
        }, 1600); // Wait slightly more than toast duration
      } else {
        setErrorMessage(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
    }
  }

  useEffect(() => {
    if (nextAction !== "PHONE_VERIFICATION" || nextAction == null) {
      navigate("/register/email");
    }
  }, [nextAction]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
      <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-600 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">
            Enter your phone number
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            We'll send you an OTP to verify your number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            placeholder="Enter your phone number"
            required
            value={number}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errorMessage && (
            <div className="text-white text-sm bg-red-900 border border-red-700 rounded-md p-3">
              ❗ {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
        </form>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer />
    </div>
  );
}

export default PhoneNumber;
