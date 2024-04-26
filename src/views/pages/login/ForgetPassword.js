import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CButton, CForm, CFormInput, CInputGroup, CSpinner, CAlert } from '@coreui/react'
import '../auth.css'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilEnvelopeOpen, cilCheckCircle, cilLockUnlocked } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import img1 from '../../../assets/images/image-1.png'
import img2 from '../../../assets/images/image-2.png'
const ForgetPassword = () => {
  const navigate = useNavigate()
  let getParams = useParams()
  let token = getParams.token
  let userId = getParams.id
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorValue, setErrorValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [usertoken, setUserToken] = useState(localStorage.getItem('token') || '')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  })

  const forgetPassword = () => {
    setError(false)
    setErrorValue('')
    setIsLoading(true)
    if (email == '') {
      setError(true)
      setErrorValue('Kindly enter your valid email.')
      setIsLoading(false)
    } else {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        email: email,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch('http://localhost:8000/forgot-password', requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          setIsLoading(false)
          if (result.Status == 'Email Sent Check Mails !!!') {
            setEmailSent(true)
          } else {
            setError(true)
            setErrorValue(result.Status)
          }
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)
          setError(true)
          setErrorValue('Something went wrong!')
        })
    }
  }

  const resetPassword = (data) => {
    console.log(data, token)
    setError(false)
    setErrorValue('')
    setIsLoading(true)

    if (data.password == data.repeatPassword) {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        password: data.password,
        repeatPassword: data.repeatPassword,
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch('http://localhost:8000/reset-password/' + userId + '/' + token, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          setIsLoading(false)
          if (result.Status == 'Success password reseted') {
            setSuccess(true)
            setTimeout(() => {
              setSuccess(false)
              navigate('/login')
            }, 2000)
          } else {
            setError(true)
            setErrorValue(result.Status)
          }
        })
        .catch((error) => {
          console.error(error)
          setIsLoading(false)
          setError(true)
          setErrorValue('Something went wrong!')
        })
    } else {
      setError(true)
      setErrorValue('Password not matched.')
      setIsLoading(false)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <div className="auth-wrapper">
        <div className="inner">
          <img src={img1} alt="" className="image-1" />
          <CForm onSubmit={handleSubmit(resetPassword)} className="form">
            <h3>Reset your password</h3>
            {token ? (
              <>
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
                    placeholder="Repeat Password"
                    autoComplete="new-password"
                    className="form-input"
                    {...register('repeatPassword', { required: true, minLength: 8 })}
                    feedback="Please enter valid password and passowrd must contain atleast 8 characters."
                    invalid={errors.repeatPassword ? true : false}
                  />
                </CInputGroup>

                {error && <span className="text-red-400 mt-3">{errorValue}</span>}
                <div className="d-grid">
                  <CButton type="submit" className="button">
                    <span>
                      {isLoading ? <CSpinner color="light" size="sm" /> : 'Reset Password'}
                    </span>
                  </CButton>
                </div>
              </>
            ) : (
              <>
                <p className="text-center my-2 text-base">
                  If the account exist, we will email you instructions to reset the password.
                </p>
                {emailSent ? (
                  <CAlert color="success" className="d-flex align-items-center">
                    <CIcon
                      icon={cilCheckCircle}
                      className="flex-shrink-0 me-2"
                      width={24}
                      height={24}
                    />
                    <div>We’ve sent you an email with instructions.</div>
                  </CAlert>
                ) : (
                  <CInputGroup className="mb-3 form-holder">
                    <span className="lnr">
                      <CIcon icon={cilEnvelopeOpen} />
                    </span>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      className="form-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                )}
                {error && <span className="text-red-400 mt-3">{errorValue}</span>}
                <div className="d-grid">
                  <CButton className="button" onClick={forgetPassword}>
                    <span>
                      {isLoading ? <CSpinner color="light" size="sm" /> : 'Reset Password'}
                    </span>
                  </CButton>
                </div>
              </>
            )}
            <p className="mt-2 text-center text-xs">
              Return to{' '}
              <Link to="/login" className="font-bold">
                Login
              </Link>
            </p>
          </CForm>
          <img src={img2} alt="" className="image-2" />
        </div>
      </div>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          <div>Password Reset successfully!</div>
        </CAlert>
      )}
    </div>
  )
}

export default ForgetPassword
