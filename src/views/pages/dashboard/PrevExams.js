import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
  CFormTextarea,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import { AppHeader, AppSidebar } from 'src/components'
import { step2score } from 'src/Step2ScoreConversion'
import '../../../../src/scss/certificate.css'

const PrevExams = () => {
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [allExams, setAllExams] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [username, setUsername] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [certificateStep, setCertificateStep] = useState('')
  const [certificateMarks, setCertificateMarks] = useState('')
  const [certificateExam, setCertificateExam] = useState('')
  const [certificateDate, setCertificateDate] = useState('')

  useEffect(() => {
    getAllExams()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  const getAllExams = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-tests/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setAllExams(result.tests)
          setUsername(result.firstName + ' ' + result.lastName)
        }
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  const deleteExam = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')

    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'delete-users-test/' + examId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false)
        if (result.success) {
          setDeleteModal(false)
          setExamId('')
          getAllExams()
          setSuccess(true)
          setSuccessMsg('Exam deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => console.log('error', error))
  }

  const percentage = (partialValue, totalValue) => {
    return Math.round((100 * partialValue) / totalValue)
  }

  // Function to sort exams with the "Continue" button on top
  const sortExamsWithContinueButtonOnTop = (exams) => {
    const examsWithContinueButton = []
    const examsWithoutContinueButton = []

    exams.forEach((exam) => {
      if (!exam.testInfo) {
        examsWithContinueButton.push(exam)
      } else {
        examsWithoutContinueButton.push(exam)
      }
    })

    return examsWithContinueButton.concat(examsWithoutContinueButton)
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CCard className="mb-4 mx-4">
            <CCardHeader className="flex justify-between items-center">
              <strong>Previous Exams</strong>
            </CCardHeader>
            <CCardBody>
              {loader ? (
                <div className="text-center">
                  <CSpinner color="success" variant="grow" />
                </div>
              ) : (
                <CTable striped className="admin-tables" responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Exam Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">USMLE Step</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Result</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Score</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allExams && allExams.length > 0 ? (
                      allExams
                        .sort((a, b) => {
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        })
                        .map((q, idx) => (
                          <CTableRow key={idx}>
                            <CTableDataCell>{q.test?.testName}</CTableDataCell>
                            <CTableDataCell>{q.test?.usmleStep}</CTableDataCell>
                            <CTableDataCell>
                              {q.testInfo ? (
                                q.test?.usmleStep == '1' ? (
                                  percentage(q.obtainedScore, q.totalScore) >= 70 ? (
                                    <span className="text-success font-bold">Pass</span>
                                  ) : (
                                    <span className="text-danger font-bold">Fail</span>
                                  )
                                ) : q.test?.usmleStep == '2' ? (
                                  q.obtainedScore <= 191 ? (
                                    <span className="text-danger font-bold">Fail</span>
                                  ) : (
                                    <span className="text-success font-bold">Pass</span>
                                  )
                                ) : (
                                  ''
                                )
                              ) : (
                                'Pending'
                              )}
                              {/* {q.testInfo
                                ? q.test?.usmleStep == '1' &&
                                  (percentage(q.obtainedScore, q.totalScore) >= 70 ? (
                                    <span className="text-success font-bold">Pass</span>
                                  ) : (
                                    <span className="text-danger font-bold">Fail</span>
                                  ))
                                : 'Pending'}
                              {q.testInfo ? (
                                q.test?.usmleStep == '2' && q.obtainedScore <= 191 ? (
                                  <span className="text-danger font-bold">Fail</span>
                                ) : (
                                  <span className="text-success font-bold">Pass</span>
                                )
                              ) : (
                                'Pending'
                              )} */}
                            </CTableDataCell>
                            {/* <CTableDataCell>
                              {q.testInfo ? q.obtainedScore : 'Pending'}
                            </CTableDataCell>
                            <CTableDataCell>
                              {q.testInfo ? q.totalScore - q.obtainedScore : 'Pending'}
                            </CTableDataCell>

                            <CTableDataCell>{q.totalScore}</CTableDataCell> */}
                            <CTableDataCell>
                              {q.testInfo
                                ? q.test?.usmleStep == '1'
                                  ? `${percentage(q.obtainedScore, q.totalScore)}%`
                                  : q.test?.usmleStep == '2'
                                    ? q.obtainedScore
                                    : ''
                                : 'Pending'}
                            </CTableDataCell>

                            <CTableDataCell>
                              {moment(q.createdAt).format('MMMM Do YYYY')}
                            </CTableDataCell>
                            <CTableDataCell className="flex justify-start items-center" scope="row">
                              {q.testInfo ? (
                                <>
                                  <Link to={`/review-exam/${q.test?._id}`}>
                                    <CButton
                                      color="success"
                                      className="text-white"
                                      // id={q._id}
                                    >
                                      Review
                                    </CButton>
                                  </Link>
                                  <Link to={`/full-length-exam/${q.test?._id}`}>
                                    <CButton
                                      color="info"
                                      className="text-white ml-2"
                                      // id={q._id}
                                    >
                                      Retake
                                    </CButton>
                                  </Link>
                                  {q.test?.usmleStep == '1'
                                    ? percentage(q.obtainedScore, q.totalScore) >= 70 && (
                                        <CButton
                                          color="primary"
                                          className="text-white ml-2"
                                          onClick={() => {
                                            setShowCertificate(true)
                                            setCertificateStep(q.test?.usmleStep)
                                            setCertificateMarks(
                                              percentage(q.obtainedScore, q.totalScore),
                                            )
                                            setCertificateExam(q.test?.testName)
                                            setCertificateDate(
                                              moment(q.createdAt).format('MMMM Do YYYY'),
                                            )
                                          }}
                                        >
                                          Certificate
                                        </CButton>
                                      )
                                    : q.test?.usmleStep == '2'
                                      ? q.obtainedScore > 192 && (
                                          <CButton
                                            color="primary"
                                            className="text-white ml-2"
                                            onClick={() => {
                                              setShowCertificate(true)
                                              setCertificateStep(q.test?.usmleStep)
                                              setCertificateMarks(q.obtainedScore)
                                              setCertificateExam(q.test?.testName)
                                              setCertificateDate(
                                                moment(q.createdAt).format('MMMM Do YYYY'),
                                              )
                                            }}
                                          >
                                            Certificate
                                          </CButton>
                                        )
                                      : ''}
                                </>
                              ) : (
                                <Link to={`/full-length-exam/${q.test?._id}`}>
                                  <CButton
                                    color="warning"
                                    className="text-white"
                                    // id={q._id}
                                  >
                                    Continue
                                  </CButton>
                                </Link>
                              )}
                              {/*
                             <CButton
                                color="danger"
                                className="text-white ml-2"
                                id={q._id}
                                onClick={(e) => {
                                  setDeleteModal(true)
                                  setExamId(e.currentTarget.id)
                                }}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                             */}
                            </CTableDataCell>
                          </CTableRow>
                        ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell className="text-center" colSpan={8}>
                          No Exams attempted yet
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
          {/* delete modal */}
          <CModal
            alignment="center"
            visible={deleteModal}
            onClose={() => setDeleteModal(false)}
            aria-labelledby="VerticallyCenteredExample"
          >
            <CModalHeader>
              <CModalTitle id="VerticallyCenteredExample">Delete Exam</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure to delete this exam?
              {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDeleteModal(false)}>
                No
              </CButton>
              <CButton color="primary" onClick={deleteExam} disabled={loading ? true : false}>
                {loading ? <CSpinner color="light" size="sm" /> : 'Yes'}
              </CButton>
            </CModalFooter>
          </CModal>
          {/* certificate modal */}
          <CModal
            alignment="center"
            visible={showCertificate}
            onClose={() => setShowCertificate(false)}
            aria-labelledby="VerticallyCenteredExample"
            size="lg"
          >
            <CModalBody className="p-0">
              <div className="container pm-certificate-container">
                <div className="outer-border"></div>
                <div className="inner-border"></div>

                <div className="pm-certificate-border col-xs-12">
                  <div className="row pm-certificate-header">
                    <div className="pm-certificate-title cursive col-xs-12 text-center">
                      <h2>ZAP-70 AJmonics</h2>
                    </div>
                  </div>

                  <div className="row pm-certificate-body">
                    <div className="pm-certificate-block">
                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-2"></div>
                          <div className="pm-certificate-name margin-0 col-xs-8 text-center">
                            <span className="pm-name-text bold uppercase">{username}</span>
                          </div>
                          <div className="col-xs-2"></div>
                        </div>
                      </div>

                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-2"></div>
                          <div className="pm-earned col-xs-8 text-center">
                            <span className="pm-earned-text padding-0 block cursive">
                              has passed with
                            </span>
                            <span className="pm-credits-text block bold sans">
                              {certificateStep == 1
                                ? `${certificateMarks}%`
                                : `${certificateMarks} Scores`}
                            </span>
                          </div>
                          <div className="col-xs-2"></div>
                          <div className="col-xs-12"></div>
                        </div>
                      </div>

                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-2"></div>
                          <div className="pm-course-title col-xs-8 text-center">
                            <span className="pm-earned-text block cursive">of exam entitled</span>
                          </div>
                          <div className="col-xs-2"></div>
                        </div>
                      </div>

                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-2"></div>
                          <div className="pm-course-title col-xs-8 text-center">
                            <span className="pm-credits-text block bold sans">
                              {certificateExam}
                            </span>
                          </div>
                          <div className="col-xs-2"></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xs-12">
                      <div className="row">
                        <div className="pm-certificate-footer">
                          <div className="col-xs-4"></div>
                          <div className="col-xs-4 pm-certified col-xs-4 text-center">
                            <span className="pm-credits-text block sans">{certificateDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CModalBody>
          </CModal>
          {/* success alert */}
          {success && (
            <CAlert color="success" className="success-alert">
              {successMsg}
            </CAlert>
          )}
        </div>
      </div>
    </div>
  )
}
export default PrevExams
