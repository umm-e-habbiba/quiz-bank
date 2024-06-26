import React, { useEffect, useState } from 'react'
import { AppHeader, AppSidebar } from 'src/components/index'
import { Link, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CProgress,
  CRow,
  CCol,
  CButton,
  CSpinner,
} from '@coreui/react'
import { API_URL } from 'src/store'
const LatestExam = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [noQuiz, setNoQuiz] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [percent, setPercent] = useState('')
  const [examId, setExamId] = useState('')
  const [marks, setMarks] = useState('')
  const [total, setTotal] = useState('')
  const [completed, setCompleted] = useState(true)

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUserID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      getLatestExam()
    }, 1000)

    // Clear the timer when the component unmounts or when the dependency changes
    return () => clearTimeout(timerId)
  }, [token, userID])

  const getLatestExam = () => {
    setLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'users-latest-test/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('latest quiz', result)
        setLoading(false)
        if (result.success) {
          if (result.message === 'User has not attempted any quiz') {
            setNoQuiz(true)
          } else {
            setMarks(result.data.obtainedScore)
            setTotal(result.data.totalScore)
            setPercent(percentage(result.data.obtainedScore, result.data.totalScore))
            setExamId(result.data.test?._id)
            setCompleted(result.data.testInfo)
          }
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  const percentage = (partialValue, totalValue) => {
    return Math.round((100 * partialValue) / totalValue)
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="body flex-grow-1">
            <CCard className="mb-4 mx-4">
              <CCardHeader className="flex justify-between items-center">
                <strong>Your Last Exam Performance</strong>
                <CButton
                  color="success"
                  onClick={() => navigate(`/review-exam/${examId}`)}
                  disabled={noQuiz || !completed ? true : false}
                >
                  Review
                </CButton>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  {loading ? (
                    <CCol md={12}>
                      <center>
                        <CSpinner color="success" variant="grow" />
                      </center>
                    </CCol>
                  ) : (
                    <CCol md={12}>
                      {noQuiz ? (
                        <div className="text-center">No exams attempted yet</div>
                      ) : completed ? (
                        <div className="progress-group">
                          <div className="progress-group-header">
                            <span>Your Score</span>
                            <span className="ms-auto fw-semibold">
                              {marks} out of {total}
                              <span className="text-body-secondary small"> ({percent}%)</span>
                            </span>
                          </div>
                          <div className="progress-group-bars">
                            <CProgress color="success" height={20} value={Number(percent)} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          Your Last exam is not completed yet. Kindly complete your exam first.
                        </div>
                      )}
                    </CCol>
                  )}
                </CRow>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LatestExam
