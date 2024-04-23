import React from 'react'
import { AppContent, AppHeader } from '../components/index'
import AdminSidebar from 'src/components/admin/AdminSidebar'

const AdminLayout = () => {
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
