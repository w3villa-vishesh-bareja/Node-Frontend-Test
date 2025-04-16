import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Email() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailExists(false);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });

      if (response.data.success === true) {
        setConfirmEmail(true);
      } else if (
        response.data.success === false &&
        response.data.message === "Email already exists"
      ) {
        setEmailExists(true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailExists(true);
    }
  }

  function handleLoginRedirect() {
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 text-white">
<div
  className={`bg-[#1e1e1e] rounded-2xl shadow-xl p-12 w-full max-w-lg ${
    confirmEmail ? 'border-green-600' : 'border-red-600'
  } border`}
>
        <div className="text-center mb-8">
        <h1
      className={`text-4xl font-bold mb-2 ${
        confirmEmail ? 'text-green-400' : 'text-red-500'
      }`}
    >
      Register
    </h1>
          <p className="text-base text-gray-400">
            We'll send you a link to continue
          </p>
        </div>

        {confirmEmail ? (
          <div className="text-green-300 font-medium text-center text-base bg-[#1c2b1c] border border-green-700 rounded-md p-4">
  ✅ A confirmation email has been sent. Please check your inbox.
</div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  className={`w-full text-lg px-5 py-3 bg-[#2a2a2a] text-white border ${
                    emailExists ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200`}
                  onChange={handleEmailChange}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  className="w-full text-lg px-5 py-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                  onChange={handlePasswordChange}
                />
              </div>

              {emailExists && (
                <div className="text-white bg-red-900 border border-red-700 text-base rounded-md p-4 text-center transition duration-200">
                  ❗ This email is already registered. Please{" "}
                  <span
                    className="text-blue-400 underline cursor-pointer"
                    onClick={handleLoginRedirect}
                  >
                    login
                  </span>
                  .
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white text-lg rounded-lg py-3 hover:bg-red-700 transition duration-200"
              >
                Next
              </button>
            </form>

            <div className="text-center mt-6 text-base text-gray-400">
              Already registered?{" "}
              <span
                className="text-red-400 cursor-pointer hover:underline"
                onClick={handleLoginRedirect}
              >
                Login
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Email;
