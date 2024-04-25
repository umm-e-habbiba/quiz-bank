import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
// import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './index.css'
import QuizLayout from './layout/QuizLayout'
import AdminLayout from './layout/AdminLayout'
import ManageQuiz from './views/pages/admin/ManageQuiz'
import QuizPerformance from './views/pages/dashboard/QuizPerformance'
import ForgetPassword from './views/pages/login/ForgetPassword'

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="*" name="User" element={<DefaultLayout />} />
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route path="/register" name="Register Page" element={<Register />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/quiz" name="Quiz" element={<QuizLayout />} />
          <Route path="/admin" name="Admin Dashboard" element={<AdminLayout />} />
          <Route path="/admin/quiz" name="Manage Quiz" element={<ManageQuiz />} />
          <Route path="/quiz-performance" name="Quiz Performance" element={<QuizPerformance />} />
          <Route path="/forget-password" name="Forget Password" element={<ForgetPassword />} />
          <Route
            path="/forget-password/:id/:token"
            name="Forget Password"
            element={<ForgetPassword />}
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
