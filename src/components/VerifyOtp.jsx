import axios from 'axios';
import React, { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useNextAction } from '../context/NextActionContext';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const {nextAction , setNextAction} = useNextAction();
  const email = localStorage.getItem("email");
  const unique_id = localStorage.getItem("id");
  const number = localStorage.getItem("phone_number");
  const navigate = useNavigate();

  function handleChange(e) {
    setOtp(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register/verifyOtp", {
        unique_id,
        number,
        otp,
      });

      if (response.data.success === true) {
        navigate('/register/createProfile/');
        setNextAction(response.data.data[0].next_action);
      } else if(response.data.success == false) {
        setError("OTP verification failed. Please try again.");
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
      const response = await axios.post("http://localhost:5000/register/sendOTP", {
        unique_id,
        number,
      });
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
      console.log(nextAction)
    if (nextAction != "PHONE_VERIFICATION" || nextAction == null) {
      navigate("/register/email");
    }
  }, [nextAction]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Verify Phone Number</h1>
          <p className="text-sm text-gray-500 mt-2">Enter OTP sent to your number</p>
        </div>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP..."
            required
            value={otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition">
          Verify
        </button>

        {showResend && (
          <button
            onClick={handleResendOtp}
            className="w-full mt-4 text-blue-600 hover:underline text-sm"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}

export default VerifyOtp;
