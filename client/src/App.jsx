import { useState } from 'react'
import Navbar from './Navbar'
import LoginAndRegister from './pages/LoginAndRegister'


function App() {
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
