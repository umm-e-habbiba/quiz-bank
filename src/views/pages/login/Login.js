import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CButton, CForm, CFormInput, CInputGroup, CSpinner, CAlert } from '@coreui/react'
import '../auth.css'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilEnvelopeOpen, cilCheckCircle } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import img1 from '../../../assets/images/image-1.png'
import img2 from '../../../assets/images/green-one-eye.png'
import img3 from '../../../assets/images/blue-icon.png'
// import img2 from '../../../assets/images/image-2.png'
import { API_URL } from 'src/store'
import AuthFooter from '../AuthFooter'
const Login = () => {
  const navigate = useNavigate()
  const [queryParameters] = useSearchParams()
  let getParams = useParams()
  let emailVerified = queryParameters.get('emailVerified')
  const [loginError, setLoginError] = useState(false)
  const [loginErrorValue, setLoginErrorValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [verifyEmail, setVerifyEmail] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      navigate('/')
    }
  }, [])

  const login = (data) => {
    setLoginError(false)
    setLoginErrorValue('')
    setIsLoading(true)
    setVerifyEmail(false)
    // console.log(data)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      email: data.email,
      password: data.password,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-login', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setIsLoading(false)
        if (result.token) {
          localStorage.setItem('token', result.token)
          if (result.message === 'Login successful as user') {
            setSuccess(true)
            setTimeout(() => {
              setSuccess(false)
              navigate('/')
            }, 2000)
            localStorage.setItem('user', 'user')
            localStorage.setItem('userId', result.userId)
          }
          if (result.message === 'Login successful as admin') {
            localStorage.setItem('user', 'admin')
            setSuccess(true)
            setTimeout(() => {
              setSuccess(false)
              navigate('/admin')
            }, 2000)
          }
        }
        if (result.error) {
          // if (result.message == 'Email not verified. Please verify your email to login.') {
          //   setVerifyEmail(true)
          // } else {
          setLoginError(true)
          setLoginErrorValue(result.message)
          // }
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        // setLoginError(true)
        // setLoginErrorValue(error)
      })
  }
  return (
    <div className="bg-body-tertiary min-vh-100">
      <div className="auth-wrapper flex flex-col dark:bg-black">
        <h2 className="dark:text-white">
          Welcome to <span className="text-[#35b18c]">ZAP-70!</span>
        </h2>
        <div className="inner rounded-lg">
          {/* <img src={img1} alt="" className="image-1" /> */}
          {/* <img src={img3} alt="" className="image-1" /> */}
          <CForm onSubmit={handleSubmit(login)} className="form">
            {emailVerified && (
              <CAlert color="success" className="d-flex align-items-center">
                <CIcon
                  icon={cilCheckCircle}
                  className="flex-shrink-0 me-2"
                  width={24}
                  height={24}
                />
                <div>Email verification Successful! Please Login.</div>
              </CAlert>
            )}

            <h3>Login</h3>
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilEnvelopeOpen} />
              </span>
              <CFormInput
                placeholder="Email"
                autoComplete="email"
                type="email"
                className="form-input"
                {...register('email', { required: true })}
                feedback="Please enter your email."
                invalid={errors.email ? true : false}
              />
            </CInputGroup>
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilLockLocked} />
              </span>
              <CFormInput
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className="form-input"
                {...register('password', { required: true, minLength: 8 })}
                feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                invalid={errors.password ? true : false}
              />
            </CInputGroup>
            <Link to="/forget-password" className="px-0 text-black">
              Forgot password?
            </Link>
            <br />
            <div className="mt-2">
              {loginError && <span className="text-red-400 my-3">{loginErrorValue}</span>}
            </div>
            {/* {verifyEmail && (
              <span className="text-red-400 mt-3">
                Email not verified.
                <CButton color="link" className="p-1 -mt-1 no-underline" onClick={emailVerify}>
                  Click here
                </CButton>{' '}
                to verify your email.
              </span>
            )} */}
            <div className="d-grid">
              <CButton type="submit" className="button">
                <span>{isLoading ? <CSpinner color="light" size="sm" /> : 'Login'}</span>
              </CButton>
            </div>
            <p className="mt-2 text-center text-xs text-black">
              Dont have an account?{' '}
              <Link to="/register" className="font-bold">
                Register
              </Link>
            </p>
          </CForm>
          <img src={img2} alt="" className="image-2" />
        </div>
        {/* <span className="created">
          Created by <Link to="https://themksolution.com/">The MK Solution</Link>
        </span> */}
      </div>
      {success && (
        <CAlert color="success" className="success-alert uppercase">
          Login successful!
        </CAlert>
      )}
      <AuthFooter />
    </div>
  )
}

export default Login
