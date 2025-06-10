import React, { useState } from 'react'
import { Player } from '@lottiefiles/react-lottie-player'
import {useNavigate} from 'react-router-dom'
import animationData from '../assets/login.json'
import axios from 'axios'

const LoginAndRegister = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/v1/users/register', { name , email, password })
      console.log('Registration successful:', response.data)
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log("Token stored after registration:", !!response.data.token);
      }
      navigate('/dashboard/register')
    
    } catch (error) {
      console.error('Registration failed:', error)
     
    }
  }
  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/v1/users/login', { email , password })
      
      console.log('Login successful:', response.data)
      localStorage.setItem('token', response.data.token)
      const userData = {
        id: response.data.user?.id || response.data.user?._id,
        name: response.data.user?.name || response.data.user?.name,
        email: response.data.user?.email || response.data.user?.email,
        resumeUploaded: response.data.user?.resumeUploaded || false,
        
      }
      localStorage.setItem('userData', JSON.stringify(userData))
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login Failed. Incorrect email or password.')
    }
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!isLogin) {
      handleRegister()
    } else {
      handleLogin()
    }
  }

  return (
    <div className='flex h-screen'>
      <div className='w-2/3 flex flex-col gap-12 items-center justify-center border bg-blue-300 border-gray-400'>
        <div className='justify-center flex flex-col items-center'>
          <h1 className='text-3xl font-bold mb-3'>Enter the World of Your Dreams!</h1>
          <p className='text-lg'>Where You Can get your <span className='text-primary text-xl font-bold'> Dream </span> Job in Single clicks</p>
        </div>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ width: 400, height: 400 }}
        />
      </div>
      <div className='w-1/3 flex flex-col items-center justify-center bg-blue-200'>
        <h2 className='text-2xl font-bold mb-3'>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>
        <p className='mb-4'>{isLogin ? 'Please login to your account to continue.' : 'Please register to create a new account.'}</p>
        <form  onSubmit={handleSubmit} action="" className='flex flex-col space-y-2'>
        {!isLogin && (
            <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder='Enter your name' className='rounded-md text-lg' />
          )}
          {/* <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder='Enter your name ' className='rounded-md text-lg' /> */}
          <input type="email" placeholder='Enter your Email' value={email} onChange={ev => setEmail(ev.target.value)} className='rounded-md text-lg'  />
          <input type="password" value={password} onChange={ev => setPassword(ev.target.value)} placeholder='Enter your password' className='rounded-md text-lg' />
          <button type='submit' className='bg-primary p-2 rounded-md text-white text-lg'>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className='mt-2 text-primary'>
          {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}

export default LoginAndRegister