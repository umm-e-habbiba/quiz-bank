import React, { useState, useEffect } from 'react'
import { CButton, CForm, CFormInput, CInputGroup, CSpinner, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCheckCircle,
  cilEnvelopeOpen,
  cilLockLocked,
  cilLockUnlocked,
  cilUser,
  cilUserPlus,
} from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import '../auth.css'
import img1 from '../../../assets/images/image-1.png'
// import img2 from '../../../assets/images/image-2.png'
import img2 from '../../../assets/images/green-one-eye.png'
import { API_URL } from 'src/store'
import AuthFooter from '../AuthFooter'
const Register = () => {
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registerErrorValue, setRegisterErrorValue] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  })
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      navigate('/')
    }
  }, [])

  const signup = (data) => {
    setRegisterError(false)
    setRegisterErrorValue('')
    setIsLoading(true)
    console.log(data)

    if (data.password == data.repeatPassword) {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        password: data.password,
        repeatPassword: data.repeatPassword,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(API_URL + 'user-signup', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          setIsLoading(false)
          if (result.success) {
            setSuccess(true)
            // setTimeout(() => {
            //   navigate('/login')
            //   setSuccess(false)
            // }, 2000)
          }
          if (result.error) {
            setRegisterError(true)
            setRegisterErrorValue(result.message)
          }
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)
        })
    } else {
      setRegisterError(true)
      setRegisterErrorValue('Password not matched.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 h-full">
      <div className="auth-wrapper flex flex-col dark:bg-black">
        <h2 className="dark:text-white">
          Welcome to <span className="text-[#35b18c]">ZAP-70!</span>
        </h2>
        <div className="inner">
          {/* <img src={img1} alt="" className="image-1" /> */}
          <CForm onSubmit={handleSubmit(signup)} className="form">
            <h3>New Account?</h3>
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilUser} />
              </span>
              <CFormInput
                placeholder="First Name"
                autoComplete="firstname"
                type="text"
                className="form-input"
                {...register('firstname', { required: true })}
                feedback="Please enter your firstname"
                invalid={errors.firstname ? true : false}
              />
            </CInputGroup>
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilUserPlus} />
              </span>
              <CFormInput
                placeholder="Last Name"
                autoComplete="lastname"
                type="text"
                className="form-input"
                {...register('lastname', { required: true })}
                feedback="Please enter your lastname"
                invalid={errors.lastname ? true : false}
              />
            </CInputGroup>
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
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilLockUnlocked} />
              </span>
              <CFormInput
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                className="form-input"
                {...register('repeatPassword', { required: true, minLength: 8 })}
                feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                invalid={errors.repeatPassword ? true : false}
              />
            </CInputGroup>
            {registerError && <span className="text-red-400">{registerErrorValue}</span>}
            {success && (
              <CAlert color="success" className="d-flex align-items-center">
                <CIcon
                  icon={cilCheckCircle}
                  className="flex-shrink-0 me-2"
                  width={24}
                  height={24}
                />
                <div>We’ve sent you an email with instructions. Kindly check your email.</div>
              </CAlert>
            )}
            <div className="d-grid">
              <CButton type="submit" className="button">
                <span>{isLoading ? <CSpinner color="light" size="sm" /> : 'Create Account'}</span>
              </CButton>
            </div>
            <p className="mt-2 text-center text-xs">
              Already have an account?{' '}
              <Link to="/login" className="font-bold">
                Login
              </Link>
            </p>
          </CForm>
          <img src={img2} alt="" className="image-2" />
        </div>
      </div>
      {/* {success && (
        <CAlert color="success" className="success-alert uppercase">
          User Registration Successful! Please Login.
        </CAlert>
      )} */}
      <AuthFooter />
    </div>
  )
}

export default Register
