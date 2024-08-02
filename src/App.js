import React, { Suspense, useEffect } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './index.css'
import QuizLayout from './layout/QuizLayout'
import AdminLayout from './layout/AdminLayout'
import ManageQuiz from './views/pages/admin/ManageQuiz'
import QuizPerformance from './views/pages/dashboard/QuizPerformance'
import ForgetPassword from './views/pages/login/ForgetPassword'
import ReviewQuiz from './views/pages/dashboard/ReviewQuiz'
import Comments from './views/pages/admin/Comments'
import Admin from './views/pages/admin/Admin'
import PreviousTests from './views/pages/dashboard/PreviousTests'
import AboutUs from './views/pages/dashboard/AboutUs'
import Feedback from './views/pages/dashboard/Feedback'
import Donations from './views/pages/dashboard/Donations'
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
import ViewTesterQues from './views/pages/admin/ViewTesterQues'
import AddTesterUser from './views/pages/admin/AddTesterUser'
import ManageTestingUsers from './views/pages/admin/ManageTestingUsers'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/" name="User" element={<DefaultLayout />} />
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route path="/register" name="Register Page" element={<Register />} />
          <Route path="*" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/quiz" name="Quiz" element={<QuizLayout />} />
          <Route path="/admin" name="Admin Dashboard" element={<Admin />} />
          <Route path="/manage-quiz" name="Manage Quiz" element={<ManageQuiz />} />
          <Route path="/comments" name="Comments" element={<Comments />} />
          <Route path="/quiz-performance" name="Quiz Performance" element={<QuizPerformance />} />
          <Route path="/review-quiz" name="Review Exam" element={<ReviewQuiz />} />
          <Route path="/review-quiz/:id" name="Review Exam" element={<ReviewQuiz />} />
          <Route path="/previous-tests" name="Previous Exams" element={<PreviousTests />} />
          <Route path="/about-us" name="About Us" element={<AboutUs />} />
          <Route path="/donations" name="Donations" element={<Donations />} />
          <Route path="/feedback" name="Feedback" element={<Feedback />} />
          <Route path="/manage-feedback" name="Manage Feedback" element={<ManageFeedbacks />} />
          <Route path="/change-about" name="Change About Text" element={<ChangeAbout />} />
          <Route path="/review-exam/:id" name="Review Exam" element={<ReviewExam />} />
          <Route path="/full-length-exam" name="Full Length Exam" element={<FullLengthExam />} />
          <Route path="/notifications" name="Notifications" element={<Notifications />} />
          <Route path="/exam-comments" name="Exam Comments" element={<ExamComments />} />
          <Route
            path="/full-length-exam/:id"
            name="Full Length Exam"
            element={<FullLengthExam />}
          />
          <Route path="/manage-exam" name="Manage Exam" element={<ManageExams />} />
          <Route
            path="/manage-notifications"
            name="Manage Notifications"
            element={<AddNotification />}
          />
          <Route path="/upload-questions" name="Upload Questions" element={<UploadQuestions />} />
          <Route path="/previous-exams" name="Previous Exams" element={<PrevExams />} />
          <Route path="/latest-exam" name="Latest Exam" element={<LatestExam />} />
          <Route path="/add-question" name="Add Question" element={<AddQuestion />} />
          <Route path="/view-questions" name="View All" element={<ViewQuestions />} />
          <Route
            path="/manage-user-questions"
            name="Questions By Users"
            element={<ManageUserQuestions />}
          />
          <Route
            path="/upload-full-length-exam"
            name="Upload Full Length Exam"
            element={<UploadFullLengthExam />}
          />
          <Route path="/forget-password" name="Forget Password" element={<ForgetPassword />} />
          <Route
            path="/attempted-questions"
            name="Questions Statistics"
            element={<AttemptedQuestions />}
          />
          <Route
            path="/forget-password/:id/:token"
            name="Forget Password"
            element={<ForgetPassword />}
          />
          <Route path="/add-testing-user" name="Add Doc/Students" element={<AddTesterUser />} />
          <Route
            path="/view-tester-ques"
            name="View Tester Questions"
            element={<ViewTesterQues />}
          />
          <Route
            path="/manage-testing-user"
            name="View Tester Questions"
            element={<ManageTestingUsers />}
          />
          {/* tester routes */}
          <Route path="/tester-questions" name="Manage Questions" element={<ManageTesterQues />} />
          <Route path="/tester-exam" name="Manage Exam" element={<ManageTesterExam />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
