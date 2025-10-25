import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import LoadingSpinner from './components/LoadingSpinner'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
const App = () => {
  const { checkAuth, user, checkingAuth }= useAuthStore()

  useEffect(()=>{
    checkAuth()
  }, [checkAuth]);
  
  
  if(checkingAuth) return <LoadingSpinner/>
  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
  bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.4)_0%,rgba(37,99,235,0.35)_45%,rgba(0,0,0,0.25)_100%)]
  animate-[glowPulse_6s_ease-in-out_infinite] pointer-events-none">
          </div>
        </div>
      </div>


      <div className='relative z-20 pt-20'>
        <Navbar />
        <Routes>
          <Route path='/' element={!user ? <Navigate to={'/login'}/> :<HomePage />} />
          <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to={'/'} />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to={'/'} />} />
          <Route path='/category/:category' element={<CategoryPage/>} />
        </Routes>
      </div>

      <Toaster/>
    </div>
  )
}

export default App