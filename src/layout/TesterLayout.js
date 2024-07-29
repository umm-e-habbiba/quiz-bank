import React, { useEffect, useState } from 'react'
import { AppContent, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import TesterSidebar from 'src/components/tester/TesterSidebar'

const TesterLayout = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'tester') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  return (
    <div>
      <TesterSidebar />
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

export default TesterLayout
