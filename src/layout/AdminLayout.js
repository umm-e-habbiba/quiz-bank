import React, { useEffect, useState } from 'react'
import { AppContent, AppHeader } from '../components/index'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { useNavigate } from 'react-router-dom'
const AdminLayout = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
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
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
