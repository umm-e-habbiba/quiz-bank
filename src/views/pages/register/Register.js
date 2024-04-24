import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeOpen,
  cilLockLocked,
  cilLockUnlocked,
  cilUser,
  cilUserFollow,
  cilUserPlus,
  cilUserUnfollow,
} from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import '../auth.css'
import img1 from '../../../assets/images/image-1.png'
import img2 from '../../../assets/images/image-2.png'
const Register = () => {
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState(false)
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

      fetch('http://localhost:8000/user-signup', requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result)
          setIsLoading(false)
          if (result == 'User created successfully') {
            navigate('/login')
          } else {
            setRegisterError(true)
            setRegisterErrorValue(result)
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
    <div className="bg-body-tertiary min-vh-100 h-full d-flex flex-row align-items-center">
      <div className="auth-wrapper">
        <div className="inner">
          <img src={img1} alt="" className="image-1" />
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
            <CInputGroup className="mb-3 form-holder">
              <span className="lnr">
                <CIcon icon={cilLockUnlocked} />
              </span>
              <CFormInput
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                {...register('repeatPassword', { required: true, minLength: 8 })}
                feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                invalid={errors.repeatPassword ? true : false}
              />
            </CInputGroup>
            {registerError && <span className="text-red-400">{registerErrorValue}</span>}
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
    </div>
  )
}

export default Register
