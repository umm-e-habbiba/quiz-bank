import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [questionId, setQuestionId] = useState('')
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
  //   useEffect(() => {
  //     getQuestion()
  //   }, [questionId])

  const getAllQuiz = () => {
    setLoader(true)
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(API_URL + 'user-quizzes/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAllQuiz(result)
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const addQuestion = (data) => {
    console.log('add function called', data, '...', stepSelected)
    setIsLoading(true)
    setError(false)
    setErrorMsg('')

    // const raw = JSON.stringify({
    //   usmleStep: data.usmleStep,
    //   USMLE: data.usmleCategory,
    //   question: data.question,
    //   options: [data.op1, data.op2, data.op3, data.op4],
    //   correctAnswer: data.correct,
    //   explaination: [
    //     {
    //       questionExplanation: data.explaination,
    //       optionExplainations: [data.op1Explain, data.op2Explain, data.op3Explain, data.op4Explain],
    //     },
    //   ],
    // })
    const optionsArray = [data.op1, data.op2, data.op3, data.op4]
    const explainedOptions = [data.op1Explain, data.op2Explain, data.op3Explain, data.op4Explain]

    const formdata = new FormData()
    formdata.append('usmleStep', data.usmleStep)
    formdata.append('USMLE', data.usmleCategory)
    formdata.append('question', data.question)
    formdata.append('options', [data.op1, data.op2, data.op3, data.op4])
    formdata.append('correctAnswer', data.correct)
    formdata.append('questionExplanation', data.explaination)
    formdata.append('image', image)
    formdata.append('optionExplanations', [
      data.op1Explain,
      data.op2Explain,
      data.op3Explain,
      data.op4Explain,
    ])
    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-mcqs', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setAddModal(false)
        setIsLoading(false)
        getAllQuiz()
        reset({})
        setSuccess(true)
        setSuccessMsg('Question added successfully')
        setTimeout(() => {
          setSuccess(false)
          setSuccessMsg('')
        }, 3000)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  const getQuestion = () => {
    var requestOptions = {
      method: 'GET',
    }

    fetch(API_URL + 'mcq/' + questionId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('ques detail', result)
        setValue('usmleStep', result.usmleStep)
        setValue('usmleCategory', result.USMLE)
        setValue('question', result.question)
        setValue('explaination', result.questionExplanation)
        setValue('op1', result.options[0])
        setValue('op2', result.options[1])
        setValue('op3', result.options[2])
        setValue('op4', result.options[3])
        setValue('correct', result.correctAnswer)
        setValue('op1Explain', result.optionExplanations[0])
        setValue('op2Explain', result.optionExplanations[1])
        setValue('op3Explain', result.optionExplanations[2])
        setValue('op4Explain', result.optionExplanations[3])
        setImage(result.image)
      })
      .catch((error) => console.log('error', error))
  }

  const deleteQuestion = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    console.log(questionId)
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'DELETE',
      // headers: myHeaders,
    }

    fetch(API_URL + 'delete-mcq/' + questionId, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result === 'MCQ deleted successfully') {
          setDeleteModal(false)
          getAllQuiz()
          setSuccess(true)
          setSuccessMsg('Question deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const editQuestion = (data) => {
    console.log('edit function called', data)
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      usmleStep: data.usmleStep,
      USMLE: data.usmleCategory,
      question: data.question,
      options: [data.op1, data.op2, data.op3, data.op4],
      correctAnswer: data.correct,
    })

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'edit-mcq/' + questionId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAddModal(false)
        setIsLoading(false)
        getAllQuiz()
        setQuestionId('')
        reset({})
        setSuccess(true)
        setSuccessMsg('Question updated successfully')
        setTimeout(() => {
          setSuccess(false)
          setSuccessMsg('')
        }, 3000)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CCard className="mb-4 mx-4">
            <CCardHeader className="flex justify-between items-center">
              <strong>Previous Tests</strong>
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
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Obt Score</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Total Score</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Correct Answer</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allQuiz && allQuiz.length > 0 ? (
                      allQuiz.map((q, idx) => (
                        <CTableRow key={idx}>
                          <CTableHeaderCell scope="row">{10}</CTableHeaderCell>
                          <CTableDataCell>{100}</CTableDataCell>
                          <CTableDataCell>{q.createdAt}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              className="text-white"
                              id={q._id}
                              onClick={(e) => {
                                setDeleteModal(true)
                                setQuestionId(e.currentTarget.id)
                              }}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell className="text-center" colSpan={5}>
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
              <CModalTitle id="VerticallyCenteredExample">Delete Question</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure to delete this question?
              {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDeleteModal(false)}>
                No
              </CButton>
              <CButton color="primary" onClick={deleteQuestion} disabled={loading ? true : false}>
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
