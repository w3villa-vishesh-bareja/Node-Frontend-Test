import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNextAction } from "../context/NextActionContext";

function PhoneNumber() {
  const [number, setNumber] = useState("");
  const navigate = useNavigate();
  const { nextAction, setNextAction } = useNextAction();
  console.log(nextAction);
  const email = localStorage.getItem("email");
  const unique_id = localStorage.getItem("id");

  function handleChange(e) {
    setNumber(e.target.value);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!number) {
      alert("please enter your number");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/register/sendOTP",
      {
        unique_id: unique_id,
        number: number,
      }
    );
    if (response.data.success == true) {
      localStorage.setItem(
        "phone_number",
        response.data.data[0].user.phone_number
      );
      setNextAction(response.data.data[0].next_action);
      navigate("/register/verifynumber");
    }
  }
  useEffect(() => {
    console.log(nextAction)
  if (nextAction != "PHONE_VERIFICATION" || nextAction == null) {
    navigate("/register/email");
  }
}, [nextAction]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Enter your phone number
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            We'll send you a otp to verify your number
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="tel"
            placeholder="Enter your phone number"
            required
            value={number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default PhoneNumber;
