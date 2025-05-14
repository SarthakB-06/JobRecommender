import { useState } from 'react'
import Navbar from './Navbar'
import LoginAndRegister from './pages/LoginAndRegister'
import axios from 'axios';
import DashboardbeforeLogin from './pages/DashboardbeforeLogin';
import DashboardafterLogin from './pages/DashboardafterLogin';
import LandingPage from './pages/LandingPage';
import { BrowserRouter  as Router , Route , Routes } from 'react-router-dom';


function App() {
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/dashboard/register" element={< DashboardbeforeLogin/>} />
        <Route path="/dashboard" element={< DashboardafterLogin/>} />
      </Routes>
    </Router>
  )
}

export default App
