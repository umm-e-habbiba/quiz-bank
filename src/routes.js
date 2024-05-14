import React from 'react'
import Admin from './views/pages/admin/Admin'
import ManageQuiz from './views/pages/admin/ManageQuiz'
import Comments from './views/pages/admin/Comments'
import QuizPerformance from './views/pages/dashboard/QuizPerformance'
import PreviousTests from './views/pages/dashboard/PreviousTests'
import AboutUs from './views/pages/dashboard/AboutUs'
import Donations from './views/pages/dashboard/Donations'
import Feedback from './views/pages/dashboard/Feedback'
import ManageFeedbacks from './views/pages/admin/ManageFeedbacks'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// admin

const routes = [
  { path: '/', name: 'Dashboard', element: Dashboard },
  { path: '/admin', name: 'Admin Dashboard', element: Admin },
  { path: '/manage-quiz', name: 'Manage Quiz', element: ManageQuiz },
  { path: '/comments', name: 'Comments', element: Comments },
  { path: '/quiz-performance', name: 'Quiz Performance', element: QuizPerformance },
  { path: '/previous-tests', name: 'Previous Exams', element: PreviousTests },
  { path: '/about-us', name: 'About Us', element: AboutUs },
  { path: '/donations', name: 'Donations', element: Donations },
  { path: '/feedback', name: 'Feedback', element: Feedback },
  { path: '/manage-feedback', name: 'Manage Feedback', element: ManageFeedbacks },
]

export default routes
