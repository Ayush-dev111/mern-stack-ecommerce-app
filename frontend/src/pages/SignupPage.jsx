import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField';
const SignupPage = () => {
	const loading = false;
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	}
	return (

		<div className='flex flex-col justify-center py-4 sm:px-6 lg:px-8' >
			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-blue-400'>Create your account</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form onSubmit={handleSubmit} className='space-y-3'>
						{/* full name */}
						<InputField
						id= "name"
						type= "text"
						label= "Full Name"
						value= {formData.fullName}
						onChange={(e)=> setFormData({...formData, fullName: e.target.value})}
						placeholder= "John Doe"
						Icon= {User}
						/>

						{/* email */}
						<InputField
						id= "email"
						type= "email"
						label= "Email Address"
						value= {formData.email}
						onChange={(e)=> setFormData({...formData, email: e.target.value})}
						placeholder= "Enter your email"
						Icon= {Mail}
						/>

						{/* password */}
						<InputField
						id= "password"
						type= "password"
						label= "Password"
						value= {formData.password}
						onChange={(e)=> setFormData({...formData, password: e.target.value})}
						placeholder= "********"
						Icon= {Lock}
						/>

						{/* confirm password */}
						<InputField
						id= "confirm-password"
						type= "password"
						label= "Confirm Password"
						value= {formData.confirmPassword}
						onChange={(e)=> setFormData({...formData, confirmPassword: e.target.value})}
						placeholder= "********"
						Icon= {Lock}
						/>

						<button 
						 type="submit"
						 className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
						 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out disabled:opacity-50'
						 disabled={loading}>
							{loading ? (
							<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
							Loading....
							</>): (
							<>
							 <UserPlus className='mr-2 h-5 w-5' aria-hidden='true'/>
							 Signup
							</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-blue-400 hover:text-blue-300'>
						 Login here <ArrowRight className='inline h-4 w-4'/>
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	)
}

export default SignupPage