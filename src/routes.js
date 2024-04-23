import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AdminDashboard = React.lazy(() => import('./views/admin/AdminDashboard'))

// admin
const ManageQuiz = React.lazy(() => import('./views/admin/ManageQuiz'))

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/admin/quiz', name: 'Manage Quiz', element: ManageQuiz },
  { path: '/admin', name: 'Admin', element: AdminDashboard },
]

export default routes
