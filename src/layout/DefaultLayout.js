import React, { useState, useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import Dashboard from 'src/views/dashboard/Dashboard'
const DefaultLayout = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      if (role == 'admin') {
        navigate('/admin')
      } else if (role == 'user') {
        navigate('/')
      } else if (role == 'tester') {
        navigate('/tester-questions')
      } else {
      }
    } else {
      navigate('/login')
    }
  }, [])
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 mx-4">
          <Dashboard />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
