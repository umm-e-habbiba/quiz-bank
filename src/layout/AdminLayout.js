import React, { useEffect, useState } from 'react'
import { AppContent, AppHeader } from '../components/index'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { useNavigate } from 'react-router-dom'
const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          {/* <AppContent /> */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
