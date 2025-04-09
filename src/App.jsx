// import { useState } from 'react'
// import axios from 'axios'
// import './App.css'
// import Register from './components/Email'
// import Login from './components/Login'
// import Email from './components/Email'
// import VerifyEmail from './components/VerifyEmail'

// function App() {
//   // const handleGoogleAuth = async () => {
//   //   try {
//   //    window.location.href = "http://localhost:5000/auth/google"
//   //   } catch (error) {
//   //     console.error("Google Auth Error:", error.response?.data || error.message);
//   //   }
//   // };
//   return (
//     <>
//       {/* <button onClick={handleGoogleAuth}/>
//        */}
//        <Login/>
//        <Email/>
//       <VerifyEmail/>

//     </>                                                                    
//   )
// }
// export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Email from './components/Email'
import VerifyEmail from './components/VerifyEmail'
import PhoneNumber from './components/PhoneNumber'
import VerifyOtp from './components/VerifyOtp'
import Profile from './components/Profile'
import UploadProfileImage from './components/PhotoUpload'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/email" element={<Email />} />
        <Route path="/register/verifyEmail" element={<VerifyEmail />} />
        <Route path="/register/EnterNumber" element={<PhoneNumber />} />
        <Route path="/register/verifynumber" element={< VerifyOtp/>} />
        <Route path="/register/createProfile" element={< Profile/>} />
        <Route path="/register/uploadProfile" element={< UploadProfileImage/>} />
        {/* Optional fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App

