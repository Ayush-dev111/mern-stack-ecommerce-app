import React from 'react'
import { useState } from 'react';
import { motion } from 'framer-motion'
import { ArrowRight, Loader, Lock, LogIn, Mail} from 'lucide-react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
import { useAuthStore } from '../store/useAuthStore';
const LoginPage = () => {
  const {login , isLogingUp} = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
  }
  return (
  <div className='flex flex-col justify-center py-4 sm:px-6 lg:px-8' >
      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-blue-400'>Log in to your account</h2>
      </motion.div>

      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className='space-y-3'>

            {/* email */}
            <InputField
            id= "email"
            type= "email"
            label= "Email Address"
            value= {email}
            onChange={(e)=> setEmail(e.target.value)}
            placeholder= "Enter your email"
            Icon= {Mail}
            />

            {/* password */}
            <InputField
            id= "password"
            type= "password"
            label= "Password"
            value= {password}
            onChange={(e)=> setPassword(e.target.value)}
            placeholder= "********"
            Icon= {Lock}
            />

            <button 
             type="submit"
             className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
             text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline:none transition duration-150 ease-in-out disabled:opacity-50'
             disabled={isLogingUp}>
              {isLogingUp ? (
              <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
              Loading....
              </>): (
              <>
               <LogIn className='mr-2 h-5 w-5' aria-hidden='true'/>
               Login
              </>
              )}
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-gray-400'>
            Not a member?{" "}
            <Link to='/signup' className='font-medium text-blue-400 hover:text-blue-300'>
             Sign up Now <ArrowRight className='inline h-4 w-4'/>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage