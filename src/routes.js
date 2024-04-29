import React from 'react'
import Admin from './views/pages/admin/Admin'
import ManageQuiz from './views/pages/admin/ManageQuiz'
import Comments from './views/pages/admin/Comments'
import QuizPerformance from './views/pages/dashboard/QuizPerformance'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// admin

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/admin', name: 'Admin Dashboard', element: Admin },
  { path: '/admin/quiz', name: 'Manage Quiz', element: ManageQuiz },
  { path: '/admin/comments', name: 'Comments', element: Comments },
  { path: '/quiz-performance', name: 'Quiz Performance', element: QuizPerformance },
]

export default routes
