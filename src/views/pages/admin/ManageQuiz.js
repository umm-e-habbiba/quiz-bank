import React, { useEffect, useState } from 'react'
import { AppHeader } from 'src/components'
import AdminSidebar from 'src/components/admin/AdminSidebar'
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
const ManageQuiz = () => {
  const [allQuestion, setAllQuestion] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [usmleStep, setUsmleStep] = useState('')
  const [usmleCategory, setUsmleCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [op1, setOp1] = useState('')
  const [op2, setOp2] = useState('')
  const [op3, setOp3] = useState('')
  const [op4, setOp4] = useState('')
  const [correct, setCorrect] = useState('')

  useEffect(() => {
    getAllQuest()
  }, [])

  const getAllQuest = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch('http://localhost:8000/mcqs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAllQuestion(result)
      })
      .catch((error) => console.error(error))
  }
  const addQuestion = () => {
    setIsLoading(true)
    console.log(usmleStep, usmleCategory, question, correct, op1)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      usmleteps: usmleStep,
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

    fetch('http://localhost:8000/add-mcqs', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setAddModal(false)
        setIsLoading(false)
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
                  {allQuestion && allQuestion.length > 0
                    ? allQuestion.map((q, idx) => (
                        <CTableRow key={idx}>
                          <CTableHeaderCell scope="row">{q.question}</CTableHeaderCell>
                          <CTableDataCell>{q.USMLE}</CTableDataCell>
                          <CTableDataCell>{q.USMLE}</CTableDataCell>
                          <CTableDataCell>{q.correctAnswer}</CTableDataCell>
                          <CTableDataCell>edit delete</CTableDataCell>
                        </CTableRow>
                      ))
                    : ''}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </div>
      </div>
      {/* add modal */}
      <CModal
        alignment="center"
        visible={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        scrollable={true}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add Question</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormSelect
                  label="USMLE Step"
                  aria-label="usmle step"
                  id="usmleStep"
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
          <CButton color="primary" onClick={addQuestion} disabled={loading ? true : false}>
            {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
export default ManageQuiz
