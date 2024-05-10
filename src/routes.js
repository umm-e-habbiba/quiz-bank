import React from 'react'
import Admin from './views/pages/admin/Admin'
import ManageQuiz from './views/pages/admin/ManageQuiz'
import Comments from './views/pages/admin/Comments'
import QuizPerformance from './views/pages/dashboard/QuizPerformance'
import PreviousTests from './views/pages/dashboard/PreviousTests'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// admin

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/admin', name: 'Admin Dashboard', element: Admin },
  { path: '/manage-quiz', name: 'Manage Quiz', element: ManageQuiz },
  { path: '/comments', name: 'Comments', element: Comments },
  { path: '/quiz-performance', name: 'Quiz Performance', element: QuizPerformance },
  { path: '/previous-tests', name: 'Previous Exams', element: PreviousTests },
]

export default routes
