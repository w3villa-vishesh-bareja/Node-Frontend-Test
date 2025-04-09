import React, { useState } from 'react'
import axios from 'axios';
function Login() {
    console.log("first")
    const [formData , setFormData] = useState({
        email:null,
        password:null
    })
    function handleChange(e){
        const {name , value} = e.target;
        setFormData(prev=>({
            ...prev,
            [name]:value,
        }))
        console.log(formData.email)
    }
    async function handleSubmit(e) {
        e.preventDefault();
    
        if (!formData.email || !formData.password) {
          alert("Email and password are required");
          return;
        }
    
        try {
          const response = await axios.post(
            "http://localhost:5000/login",
            {
              ...formData,
            }
          );
          console.log(response.data); 
          if(response.data.success == true){
            navigate('/');
          }
        } catch (error) {
          console.error(error);
        }
      }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Please enter your details to sign in</p>
        </div>

        <div className="mb-6">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            name='email'
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
            value={formData.email}
          />
          <input
            type="password"
            name='password'
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
            value={formData.password}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>

        <button className="w-full bg-blue-600 text-white rounded-lg py-2 mt-6 hover:bg-blue-700 transition cursor-pointer" 
        onClick={handleSubmit}>
          Sign In
        </button>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account yet?{' '}
          <a href="/register/email" className="text-blue-600 font-medium hover:underline" >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
