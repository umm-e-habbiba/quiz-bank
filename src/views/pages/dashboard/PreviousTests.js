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
const PreviousTests = () => {
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [allQuiz, setAllQuiz] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [quizId, setQuizId] = useState('')
  const [image, setImage] = useState('')
  // const [usmleStep, setUsmleStep] = useState('')
  // const [usmleCategory, setUsmleCategory] = useState('')
  // const [question, setQuestion] = useState('')
  // const [op1, setOp1] = useState('')
  // const [op2, setOp2] = useState('')
  // const [op3, setOp3] = useState('')
  // const [op4, setOp4] = useState('')
  // const [correct, setCorrect] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      usmleStep: '',
      usmleCategory: '',
      question: '',
      op1: '',
      op2: '',
      op3: '',
      op4: '',
      correct: '',
      explaination: '',
      op1Explain: '',
      op2Explain: '',
      op3Explain: '',
      op4Explain: '',
    },
  })

  const stepSelected = watch('usmleStep')
  const option1 = watch('op1')
  const option2 = watch('op2')
  const option3 = watch('op3')
  const option4 = watch('op4')

  useEffect(() => {
    getAllQuiz()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  const getAllQuiz = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-quizzes/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.data) {
          setAllQuiz(result.data)
        }
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  const deleteQuiz = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    // console.log(quizId)
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'delete-quiz/' + userID + '/' + quizId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setIsLoading(false)
        if (result.success) {
          setDeleteModal(false)
          setQuizId('')
          getAllQuiz()
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
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CCard className="mb-4 mx-4">
            <CCardHeader className="flex justify-between items-center">
              <strong>Previous Exams</strong>
              {/* <CButton
              color="success"
              className="text-white"
              onClick={() => {
                setAddModal(true)
                setIsLoading(false)
                reset({})
              }}
            >
              Add Question
            </CButton> */}
            </CCardHeader>
            <CCardBody>
              {loader ? (
                <div className="text-center">
                  <CSpinner color="success" variant="grow" />
                </div>
              ) : (
                <CTable striped className="admin-tables">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Correct Answers</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Incorrect Answers</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total Questions</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Correct Answer</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allQuiz && allQuiz.length > 0 ? (
                      allQuiz.map((q, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{q.obtainedScore}</CTableDataCell>
                          <CTableDataCell>{q.totalScore - q.obtainedScore}</CTableDataCell>
                          <CTableDataCell>{q.totalScore}</CTableDataCell>
                          <CTableDataCell>
                            {moment(q.createdAt).format('MMMM Do YYYY')}
                          </CTableDataCell>
                          <CTableDataCell className="flex justify-start items-center" scope="row">
                            <Link to={`/review-quiz/${q._id}`}>
                              <CButton
                                color="success"
                                className="text-white"
                                // id={q._id}
                              >
                                Review
                              </CButton>
                            </Link>
                            <CButton
                              color="danger"
                              className="text-white ml-2"
                              id={q._id}
                              onClick={(e) => {
                                setDeleteModal(true)
                                setQuizId(e.currentTarget.id)
                              }}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell className="text-center" colSpan={6}>
                          No quiz attempted yet
                        </CTableDataCell>
                      </CTableRow>
                    )}
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
              <CButton color="primary" onClick={deleteQuiz} disabled={loading ? true : false}>
                {loading ? <CSpinner color="light" size="sm" /> : 'Yes'}
              </CButton>
            </CModalFooter>
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
export default PreviousTests
