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
import AttemptedQuestions from './views/pages/admin/AttemptedQuestions'
import UploadQuestions from './views/pages/admin/UploadQuestions'
import UploadFullLengthExam from './views/pages/admin/UploadFullLengthExam'
import ManageExams from './views/pages/admin/ManageExams'
import FullLengthExam from './views/pages/dashboard/FullLengthExam'
import PrevExams from './views/pages/dashboard/PrevExams'
import ReviewExam from './views/pages/dashboard/ReviewExam'
import ManageUserQuestions from './views/pages/admin/ManageUserQuestions'
import LatestExam from './views/pages/dashboard/LatestExam'
import AddQuestion from './views/pages/dashboard/AddQuestion'
import ViewQuestions from './views/pages/dashboard/ViewQuestions'
import ChangeAbout from './views/pages/admin/ChangeAbout'
import Notifications from './views/pages/dashboard/Notifications'
import AddNotification from './views/pages/admin/AddNotification'
import ViewNotification from './views/pages/admin/ViewNotification'
import ExamComments from './views/pages/admin/ExamComments'
import ManageTesterQues from './views/pages/tester/ManageTesterQues'
import ManageTesterExam from './views/pages/tester/ManageTesterExam'
import AddTesterUser from './views/pages/admin/AddTesterUser'
import ViewTesterQues from './views/pages/admin/ViewTesterQues'
import ManageTestingUsers from './views/pages/admin/ManageTestingUsers'

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
  { path: '/change-about', name: 'Change About Text', element: ChangeAbout },
  { path: '/manage-exam', name: 'Manage Exam', element: ManageExams },
  { path: '/attempted-questions', name: 'Questions Statistics', element: AttemptedQuestions },
  { path: '/upload-questions', name: 'Upload Questions', element: UploadQuestions },
  { path: '/full-length-exam', name: 'Full Length Exam', element: FullLengthExam },
  { path: '/full-length-exam/:id', name: 'Full Length Exam', element: FullLengthExam },
  { path: '/review-exam/:id', name: 'Review Exam', element: ReviewExam },
  { path: '/previous-exams', name: 'Previous Exams', element: PrevExams },
  { path: '/latest-exam', name: 'Latest Exam', element: LatestExam },
  { path: '/add-question', name: 'Add Question', element: AddQuestion },
  { path: '/view-questions', name: 'View All', element: ViewQuestions },
  { path: '/manage-user-questions', name: 'Questions By Users', element: ManageUserQuestions },
  { path: '/manage-notifications', name: 'Manage Notifications', element: AddNotification },
  { path: '/view-notifications', name: 'View Notifications', element: ViewNotification },
  { path: '/add-testing-user', name: 'Add Testing User', element: AddTesterUser },
  { path: '/view-tester-ques', name: 'View Tester Questions', element: ViewTesterQues },
  { path: '/manage-testing-user', name: 'Manage Doc/Students', element: ManageTestingUsers },
  {
    path: '/upload-full-length-exam',
    name: 'Upload Full Length Exam',
    element: UploadFullLengthExam,
  },
  // tester routes
  { path: '/tester-questions', name: 'Manage Questions', element: ManageTesterQues },
  { path: '/tester-exam', name: 'Manage Exam', element: ManageTesterExam },
]

export default routes
