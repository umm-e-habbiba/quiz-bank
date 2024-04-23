import React, { useState } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [rpassword, setRPassword] = useState('')
  const [passwordRError, setPasswordRError] = useState(false)
  const [registerError, setRegisterError] = useState(false)
  const [registerErrorValue, setRegisterErrorValue] = useState('')

  const register = () => {
    setNameError(false)
    setEmailError(false)
    setPasswordError(false)
    setPasswordRError(false)
    setRegisterError(false)
    setRegisterErrorValue('')

    if (name === '') {
      setNameError(true)
    }
    if (email === '') {
      setEmailError(true)
    }
    if (password === '') {
      setPasswordError(true)
    }
    if (rpassword === '') {
      setPasswordRError(true)
    }
    console.log(name, email, password, rpassword)

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      username: name,
      email: email,
      password: password,
      repeatPassword: rpassword,
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
        if (result == 'User created successfully') {
          navigate('/login')
        } else {
          setRegisterError(true)
          setRegisterErrorValue(result)
        }
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-1">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </CInputGroup>
                  {nameError && <span className="text-red-400 mb-3">Please enter username</span>}
                  <CInputGroup className="mb-1">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  {emailError && (
                    <span className="text-red-400 mb-3">Please enter valid email</span>
                  )}
                  <CInputGroup className="mb-1">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {passwordError && (
                    <span className="text-red-400 mb-3">Please enter valid password</span>
                  )}
                  <CInputGroup className="mb-1">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={rpassword}
                      onChange={(e) => setRPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {passwordRError && (
                    <span className="text-red-400 mb-3">Please enter valid password</span>
                  )}
                  <div className="d-grid">
                    <CButton color="success" onClick={register}>
                      Create Account
                    </CButton>
                  </div>
                  {registerError && <span className="text-red-400 mb-3">{registerErrorValue}</span>}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
