import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNextAction } from '../context/NextActionContext';
import { useNavigate } from 'react-router-dom';

function Email() {
  const [email , setEmail] = useState('');
  const {nextAction,setNextAction} = useNextAction();
  const navigate = useNavigate();
  function handleChange(e){
    setEmail(e.target.value)
  }
  async function handleSubmit(e){
    e.preventDefault();

    if(!email){
      alert("please enter your email");
      return
    }
    
    const response  = await axios.post("http://localhost:5000/register" , {
      email:email
    })
    if(response.data.success == true){
      console.log(response.data.data[0].next_action);
      setNextAction(response.data.data[0].next_action);
    }
  }
  useEffect(()=>{
    if(nextAction=="PHONE_VERIFICATION"){
      navigate('/register/EnterNumber')
    }else if(nextAction=="CREATE_PROFILE"){
      navigate('/register/createProfile')
    }else if(nextAction=="UPLOAD_PROFILE_PHOTO"){
      navigate('/register/uploadProfile')
    }
  },[nextAction])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Enter your Email</h1>
          <p className="text-sm text-gray-500 mt-2">We'll send you a link to continue</p>
        </div>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value= {email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition">
          Next
        </button>
      </div>
    </div>
  )
}

export default Email
