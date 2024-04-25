import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import '../auth.css'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilEnvelopeOpen } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import img1 from '../../../assets/images/image-1.png'
import img2 from '../../../assets/images/image-2.png'
const Login = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState(false)
  const [loginErrorValue, setLoginErrorValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const {
    register,
    handleSubmit,
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
    console.log(data)
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

    fetch('http://localhost:8000/user-login', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.token) {
          localStorage.setItem('token', result.token)
          if (result.message === 'Login successful as user') {
            navigate('/')
          }
          if (result.message === 'Login successful as admin') {
            navigate('/admin')
          }
        } else {
          setLoginError(true)
          setLoginErrorValue(result)
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setLoginError(true)
        setLoginErrorValue('Something went wrong!')
      })
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <div className="auth-wrapper">
        <div className="inner">
          <img src={img1} alt="" className="image-1" />
          <CForm onSubmit={handleSubmit(login)} className="form">
            <h3>Login</h3>
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilEnvelopeOpen} />
              </span>
              <CFormInput
                placeholder="Email"
                autoComplete="email"
                type="email"
                className="form-control"
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
                {...register('password', { required: true, minLength: 8 })}
                feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                invalid={errors.password ? true : false}
              />
            </CInputGroup>
            <Link to="/forget-password" className="px-0">
              Forgot password?
            </Link>
            <br />
            {loginError && <span className="text-red-400 mt-3">{loginErrorValue}</span>}
            <div className="d-grid">
              <CButton type="submit" className="button">
                <span>{isLoading ? <CSpinner color="light" size="sm" /> : 'Login'}</span>
              </CButton>
            </div>
            <p className="mt-2 text-center text-xs">
              Dont have an account?{' '}
              <Link to="/register" className="font-bold">
                Register
              </Link>
            </p>
          </CForm>
          <img src={img2} alt="" className="image-2" />
        </div>
      </div>
      {/* <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(login)}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        type="email"
                        autoComplete="username"
                        {...register('email', { required: true })}
                        feedback="Please enter your email."
                        invalid={errors.email ? true : false}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: true, minLength: 8 })}
                        feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                        invalid={errors.password ? true : false}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> 
                    </CRow>

                    {loginError && <span className="text-red-400 mt-3">{loginErrorValue}</span>}
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Sign up for your new account</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer> */}
    </div>
  )
}

export default Login
