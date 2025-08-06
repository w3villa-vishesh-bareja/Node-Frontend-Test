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
import Payment from './components/Payment'
import ProjectBoard from './components/ProjectBoard'
import AdminDashboard from './components/AdminDashboard'
import ProfilePage from './components/ProfileSPage'
// import io from 'socket.io-client';


// const socket = io('https://nodetraining-ny09.onrender.com',{
//   withCredentials : true
// })
// socket.on("connect",()=>{
//   console.log('connected to server via socket.io' , socket.id)
// });
// socket.on('disconnect', () => {
//   console.log('❌ Disconnected from server');
// });

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

        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/upgrade' element={<Payment/>} />
        <Route path='/project/:projectUniqueId' element={<ProjectBoard/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/user/profile" element={<ProfilePage/>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App

