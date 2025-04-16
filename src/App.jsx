import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Email from './components/Email'
import VerifyEmail from './components/VerifyEmail'
import PhoneNumber from './components/PhoneNumber'
import VerifyOtp from './components/VerifyOtp'
import Profile from './components/Profile'
import UploadProfileImage from './components/PhotoUpload'
import SetUsername from './components/SetUsername'
import Dashboard from './components/Dashboard'

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
        <Route path="/register/setUsername" element={< SetUsername/>} />

        {/* Optional fallback route */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App

