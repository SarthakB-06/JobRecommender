import { useState } from 'react'
import Navbar from './Navbar'
import LoginAndRegister from './pages/LoginAndRegister'
import axios from 'axios';


function App() {
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  return (
    <>
      <div className='bg-neutral-light h-screen'>
        {/* <Navbar /> */}
        <LoginAndRegister/>
      </div>
    </>
  )
}

export default App
