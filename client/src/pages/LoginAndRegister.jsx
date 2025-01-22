import React from 'react'
// import { Lottie } from 'lottie-react'
import { Player } from '@lottiefiles/react-lottie-player'
import animationData from '../assets/login.json'

const LoginAndRegister = () => {
  return (
    <div className=' flex h-screen'>
      <div className='w-2/3 flex flex-col gap-12 items-center justify-center border bg-blue-300 border-gray-400'>
      <div className='justify-center flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-3'>Enter the World of Your Dreams!</h1>
      <p className='text-lg'>Where You Can get your <span className='text-primary text-xl font-bold'> Dream </span> Job in Single clicks </p>
      </div>
      <Player
          autoplay
          loop
          src={animationData}
          style={{ width: 400, height: 400 }}
        />
      </div>
      <div className='w-1/3 flex flex-col items-center justify-center bg-blue-200'>
      <h2 className='text-2xl font-bold mb-3'>Welcome Back!</h2>
        <p className='mb-4'>Please login to your account to continue.</p>
        <form action="" className='flex flex-col space-y-2'>
         <input type="text" placeholder='Enter your name' className='rounded-md text-lg ' />
         <input type="password" placeholder='Enter your password' className='rounded-md text-lg' />
         <button className='bg-primary p-2 rounded-md text-white text-lg'>Login</button>

        </form>
      </div>
    </div>
  )
}

export default LoginAndRegister