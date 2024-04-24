import React, { useEffect, useState } from 'react'
import { AppHeader } from 'src/components'
import AdminSidebar from 'src/components/admin/AdminSidebar'
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
  CModalContent,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilPencil, cilTrash } from '@coreui/icons'
const ManageQuiz = () => {
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [editModal, seteditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [usmleStep, setUsmleStep] = useState('')
  const [usmleCategory, setUsmleCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [op1, setOp1] = useState('')
  const [op2, setOp2] = useState('')
  const [op3, setOp3] = useState('')
  const [op4, setOp4] = useState('')
  const [correct, setCorrect] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const API_URL = 'http://localhost:8000/'

  useEffect(() => {
    getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    getQuestion()
  }, [questionId])

  const getAllQuest = () => {
    setLoader(true)
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(API_URL + 'mcqs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAllQuestion(result)
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const addQuestion = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    console.log(usmleStep, usmleCategory, question, correct, op1)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      usmleStep: usmleStep,
      USMLE: usmleCategory,
      question: question,
      options: [op1, op2, op3, op4],
      correctAnswer: correct,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-mcqs', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setAddModal(false)
        setIsLoading(false)
        getAllQuest()
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
        setQuestion(result.question)
        setUsmleStep(result.usmleStep)
        setUsmleCategory(result.USMLE)
        setCorrect(result.correctAnswer)
        setOp1(result.options[0])
        setOp2(result.options[1])
        setOp3(result.options[2])
        setOp4(result.options[3])
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
          getAllQuest()
        } else {
          setError(true)
          setErrorMsg(result)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const editQuestion = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      usmleStep: usmleStep,
      USMLE: usmleCategory,
      question: question,
      options: [op1, op2, op3, op4],
      correctAnswer: correct,
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
        getAllQuest()
        setQuestionId('')
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <div>
      <AdminSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CCard className="mb-4 mx-4">
            <CCardHeader className="flex justify-between items-center">
              <strong>Manage Questions</strong>
              <CButton
                color="success"
                className="text-white"
                onClick={() => {
                  setAddModal(true)
                  setIsLoading(false)
                }}
              >
                Add Question
              </CButton>
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
                      <CTableHeaderCell scope="col">Question</CTableHeaderCell>
                      <CTableHeaderCell scope="col">USMLE Step</CTableHeaderCell>
                      <CTableHeaderCell scope="col">USMLE Category</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Correct Answer</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allQuestion && allQuestion.length > 0 ? (
                      allQuestion.map((q, idx) => (
                        <CTableRow key={idx}>
                          <CTableHeaderCell scope="row">{q.question}</CTableHeaderCell>
                          <CTableDataCell>{q.usmleStep}</CTableDataCell>
                          <CTableDataCell>{q.USMLE}</CTableDataCell>
                          <CTableDataCell>{q.correctAnswer}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              className="text-white mr-3"
                              id={q._id}
                              onClick={(e) => {
                                setAddModal(true)
                                setQuestionId(e.currentTarget.id)
                              }}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
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
                          No Questions Found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </div>
      </div>
      {/* add / edit modal */}
      <CModal
        alignment="center"
        visible={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        scrollable={true}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">
            {questionId ? 'Edit' : 'Add'} Question
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormSelect
                  label="USMLE Step"
                  aria-label="usmle step"
                  id="usmleStep"
                  defaultValue={usmleStep}
                  options={[
                    'Select USMLE Step',
                    { label: 'Step 1', value: '1' },
                    { label: 'Step 2', value: '2' },
                    { label: 'Step 3', value: '3' },
                  ]}
                  onChange={(e) => setUsmleStep(e.target.value)}
                />
              </CCol>
            </CRow>
            {usmleStep ? (
              <CRow className="mb-3">
                <CCol md={12}>
                  {usmleStep == '1' ? (
                    <CFormSelect
                      label="USMLE Category"
                      aria-label="usmle category"
                      id="usmleCategory"
                      defaultValue={usmleCategory}
                      options={[
                        'Select USMLE Category',
                        { label: 'Microbiology', value: 'Microbiology' },
                        { label: 'Immunology', value: 'Immunology' },
                        { label: 'Histology', value: 'Histology' },
                        { label: 'Anatomy', value: 'Anatomy' },
                        { label: 'Physiology', value: 'Physiology' },
                        { label: 'Embryology', value: 'Embryology' },
                        { label: 'Biochemistry', value: 'Biochemistry' },
                      ]}
                      onChange={(e) => setUsmleCategory(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                  {usmleStep == '2' ? (
                    <CFormSelect
                      label="USMLE Category"
                      aria-label="usmle category"
                      id="usmleCategory"
                      defaultValue={usmleCategory}
                      options={[
                        'Select USMLE Category',
                        { label: 'Internal Medicine', value: 'Internal Medicine' },
                        { label: 'Surgery', value: 'Surgery' },
                        { label: 'Pediatrics', value: 'Pediatrics' },
                        { label: 'Obstetrics and Gynecology', value: 'Obstetrics and Gynecology' },
                        { label: 'Psychiatry', value: 'Psychiatry' },
                        { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                        { label: 'Family Medicine', value: 'Family Medicine' },
                      ]}
                      onChange={(e) => setUsmleCategory(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                  {usmleStep == '3' ? (
                    <CFormSelect
                      label="USMLE Category"
                      aria-label="usmle category"
                      id="usmleCategory"
                      defaultValue={usmleCategory}
                      options={[
                        'Select USMLE Category',
                        { label: 'Internal Medicine', value: 'Internal Medicine' },
                        { label: 'Surgery', value: 'Surgery' },
                        { label: 'Pediatrics', value: 'Pediatrics' },
                        { label: 'Obstetrics and Gynecology', value: 'Obstetrics and Gynecology' },
                        { label: 'Psychiatry', value: 'Psychiatry' },
                        { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                        { label: 'Family Medicine', value: 'Family Medicine' },
                      ]}
                      onChange={(e) => setUsmleCategory(e.target.value)}
                    />
                  ) : (
                    ''
                  )}
                </CCol>
              </CRow>
            ) : (
              ''
            )}
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Question"
                  type="text"
                  id="ques"
                  value={question}
                  placeholder="Enter Question"
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="options">Options</CFormLabel>
                <CFormInput
                  type="text"
                  value={op1}
                  onChange={(e) => setOp1(e.target.value)}
                  className="mb-2"
                />
                <CFormInput
                  type="text"
                  value={op2}
                  onChange={(e) => setOp2(e.target.value)}
                  className="mb-2"
                />
                <CFormInput
                  type="text"
                  value={op3}
                  onChange={(e) => setOp3(e.target.value)}
                  className="mb-2"
                />
                <CFormInput
                  type="text"
                  value={op4}
                  onChange={(e) => setOp4(e.target.value)}
                  className="mb-2"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormSelect
                  label="Correct Option"
                  aria-label="correct option"
                  id="correctOpt"
                  defaultValue={correct}
                  options={[
                    'Select Correct Option',
                    { label: op1, value: op1 },
                    { label: op2, value: op2 },
                    { label: op3, value: op3 },
                    { label: op4, value: op4 },
                  ]}
                  onChange={(e) => setCorrect(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddModal(false)}>
            Close
          </CButton>
          {questionId ? (
            <CButton color="primary" onClick={editQuestion} disabled={loading ? true : false}>
              {loading ? <CSpinner color="light" size="sm" /> : 'Edit'}
            </CButton>
          ) : (
            <CButton color="primary" onClick={addQuestion} disabled={loading ? true : false}>
              {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
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
            Close
          </CButton>
          <CButton color="primary" onClick={deleteQuestion} disabled={loading ? true : false}>
            {loading ? <CSpinner color="light" size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
export default ManageQuiz
