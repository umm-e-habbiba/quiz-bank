import React, { useEffect, useState } from 'react'
import { AppHeader, AppSidebar } from 'src/components/index'
import { Link, useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CProgress, CRow, CCol, CButton } from '@coreui/react'
const QuizPerformance = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [percent, setPercent] = useState('')
  const [marks, setMarks] = useState('')

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getScore = localStorage.getItem('score')
      const score = JSON.parse(getScore)
      setMarks(score.obt)
      setPercent(percentage(score.obt, score.total))
    } else {
      navigate('/login')
    }
  }, [])

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
                  <CCol mg={6}>
                    <div className="progress-group">
                      <div className="progress-group-header">
                        <span>Your Score</span>
                        <span className="ms-auto fw-semibold">
                          {marks}
                          <span className="text-body-secondary small">({percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={Number(percent)} />
                      </div>
                    </div>
                  </CCol>
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
