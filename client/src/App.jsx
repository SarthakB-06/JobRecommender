import { useState } from 'react'
import Navbar from './Navbar'
import LoginAndRegister from './pages/LoginAndRegister'
import axios from 'axios';
import Dashboard from './pages/dashboard';
import { BrowserRouter  as Router , Route , Routes } from 'react-router-dom';


function App() {
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAndRegister />} />
        <Route path="/dashboard" element={< Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
