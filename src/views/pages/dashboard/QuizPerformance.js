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
const QuizPerformance = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [percent, setPercent] = useState('')
  const [marks, setMarks] = useState('')
  const [total, setTotal] = useState('')

  useEffect(() => {
    getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  const getAllQuest = () => {
    setLoading(true)
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(API_URL + 'latest-quiz/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('latest quiz', result)
        setMarks(result.obtainedScore)
        setTotal(result.totalScore)
        setPercent(percentage(result.obtainedScore, result.totalScore))
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
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
                <strong>Your Performance</strong>
                <CButton color="success" onClick={() => navigate('/review-quiz')}>
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
                    <CCol md={6}>
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

export default QuizPerformance
