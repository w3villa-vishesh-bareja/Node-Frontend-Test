import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useNextAction } from '../context/NextActionContext';

function VerifyEmail() {
  const [status, setStatus] = useState("loading"); // 'loading', 'verified', 'resent', 'error'
  const [message, setMessage] = useState("");
  const { setNextAction } = useNextAction();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus("error");
        setMessage("No token found.");
        return;
      }

      let decodedEmail = '';
      try {
        const decoded = jwtDecode(token);
        decodedEmail = decoded.email;
      } catch (err) {
        console.error("Invalid token");
        setStatus("error");
        setMessage("Invalid or malformed token.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/register/verifyEmail", {
          email: decodedEmail,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 201) {
          const { email, unique_id } = response.data.data[0].user;
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("id", unique_id);
          setNextAction(response.data.data[0].next_action);
          setStatus("verified");
        } else if (response.status === 200) {
          setStatus("resent");
          setMessage("Your link was expired. A new verification email has been sent.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Verification failed. Please try again later.");
      }
    }

    verifyToken();
  }, [token, setNextAction]);

  function handleNext() {
    navigate("/register/EnterNumber");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {status === "loading" && (
          <div className="text-blue-600 text-lg">Verifying your email... 🔄</div>
        )}

        {status === "verified" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Email Verified</h1>
            <p className="text-gray-700 mb-6">Your email has been successfully verified.</p>
            <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Next
            </button>
          </>
        )}

        {status === "resent" && (
          <>
            <h1 className="text-xl font-semibold text-yellow-600 mb-4">⚠️ Link Expired</h1>
            <p className="text-gray-700 mb-6">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-semibold text-red-600 mb-4">❌ Verification Failed</h1>
            <p className="text-gray-700">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
