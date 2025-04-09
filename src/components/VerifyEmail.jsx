import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useNextAction } from '../context/NextActionContext';

function VerifyEmail() {
  const[password , setPassword] = useState('');
  const{nextAction , setNextAction} = useNextAction();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")
  let decodedEmail='';
  if(token){
    try{
        const decoded = jwtDecode(token);
        decodedEmail = decoded.email;
    }catch(error){
        console.error(error);
    }
  }

  function handleChange(e){
    setPassword(e.target.value)
  }
  async function handleSubmit(e){
    e.preventDefault();

    if(!password){
      alert("please enter password");
      return
    }
    
    const response  = await axios.post("http://localhost:5000/register/verifyEmail" , {
      password:password,
      email:decodedEmail
    },
    {
        headers: {
          Authorization: `Bearer ${token}`
        }
    })
    // console.log(response.data[0].user.email , response.data[0].user.unique_id);
    // console.log(response.data.data[0].user.email , response.deta.data[0].user.unique_id);
    if (response.data.success) {
        const { email, unique_id } = response.data.data[0].user;
        localStorage.setItem("email", email);
        localStorage.setItem("id", unique_id);
        setNextAction(response.data.data[0].next_action);
        navigate('/register/EnterNumber');
      } else {
        alert("Verification failed. Try again.");
      }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Enter your password</h1>
          <p className="text-sm text-gray-500 mt-2">Please Create a password to complete email verification process</p>
        </div>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Enter your password"
            required
            value= {password}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition">
          Create Password
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail
