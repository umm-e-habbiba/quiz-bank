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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCommentBubble } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
const Comments = () => {
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [editModal, setEditModal] = useState(false)
  const [commentModal, setCommentModal] = useState(false)
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
  const [comments, setComments] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
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
    getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
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

    fetch(API_URL + 'mcqs-with-comments', requestOptions)
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
        setValue('op1', result.optionOne)
        setValue('op2', result.optionTwo)
        setValue('op3', result.optionThree)
        setValue('op4', result.optionFour)
        setValue('correct', result.correctAnswer)
        setValue('op1Explain', result.optionOneExplanation)
        setValue('op2Explain', result.optionTwoExplanation)
        setValue('op3Explain', result.optionThreeExplanation)
        setValue('op4Explain', result.optionFourExplanation)
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
          getAllQuest()
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
        setEditModal(false)
        setIsLoading(false)
        getAllQuest()
        setQuestionId('')
        reset({})
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <AdminLayout>
      <>
        <CCard className="mb-4 mx-4">
          <CCardHeader className="flex justify-between items-center">
            <strong>Comments</strong>
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
                        <CTableHeaderCell scope="row">
                          {q.question.length > 100
                            ? q.question.substring(0, 100) + '...'
                            : q.question}
                        </CTableHeaderCell>
                        <CTableDataCell>{q.usmleStep}</CTableDataCell>
                        <CTableDataCell>{q.USMLE}</CTableDataCell>
                        <CTableDataCell>{q.correctAnswer}</CTableDataCell>
                        <CTableDataCell className="flex">
                          <CButton
                            color="success"
                            className="text-white mr-1 my-2"
                            id={q._id}
                            onClick={(e) => {
                              setCommentModal(true)
                              setComments(q.comments)
                            }}
                            title="View Comments"
                          >
                            <CIcon icon={cilCommentBubble} />
                          </CButton>
                          <CButton
                            color="info"
                            className="text-white mr-1 my-2"
                            id={q._id}
                            onClick={(e) => {
                              setEditModal(true)
                              setQuestionId(e.currentTarget.id)
                            }}
                            title="Edit Question"
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            className="text-white my-2"
                            id={q._id}
                            onClick={(e) => {
                              setDeleteModal(true)
                              setQuestionId(e.currentTarget.id)
                            }}
                            title="Delete Question"
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
        {/* add / edit modal */}
        <CModal
          alignment="center"
          visible={editModal}
          onClose={() => setEditModal(false)}
          aria-labelledby="VerticallyCenteredExample"
          // scrollable={true}
          size="lg"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Edit Question</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit(editQuestion)}>
            <CModalBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormSelect
                      label="USMLE Step"
                      aria-label="usmle step"
                      id="usmleStep"
                      options={[
                        { label: 'Select USMLE Step', value: '' },
                        { label: 'Step 1', value: '1' },
                        { label: 'Step 2', value: '2' },
                        { label: 'Step 3', value: '3' },
                      ]}
                      {...register('usmleStep', { required: true })}
                      feedback="Please select USMLE Step"
                      invalid={errors.usmleStep ? true : false}
                      defaultValue={getValues('usmleStep')}
                      // onChange={(e) => setUsmleStep(e.target.value)}
                    />
                  </CCol>
                </CRow>
                {Number(getValues('usmleStep')) > 0 ? (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      {getValues('usmleStep') == '1' ? (
                        <CFormSelect
                          label="USMLE Category"
                          aria-label="usmle category"
                          id="usmleCategory"
                          defaultValue={getValues('usmleCategory')}
                          options={[
                            { label: 'Select USMLE Category', value: '' },
                            { label: 'Microbiology', value: 'Microbiology' },
                            { label: 'Immunology', value: 'Immunology' },
                            { label: 'Histology', value: 'Histology' },
                            { label: 'Anatomy', value: 'Anatomy' },
                            { label: 'Physiology', value: 'Physiology' },
                            { label: 'Embryology', value: 'Embryology' },
                            { label: 'Biochemistry', value: 'Biochemistry' },
                          ]}
                          {...register('usmleCategory', { required: true })}
                          feedback="Please select USMLE Category."
                          invalid={errors.usmleCategory ? true : false}
                          // onChange={(e) => setUsmleCategory(e.target.value)}
                        />
                      ) : (
                        ''
                      )}
                      {getValues('usmleStep') == '2' ? (
                        <CFormSelect
                          label="USMLE Category"
                          aria-label="usmle category"
                          id="usmleCategory"
                          defaultValue={getValues('usmleCategory')}
                          options={[
                            { label: 'Select USMLE Category', value: '' },
                            { label: 'Internal Medicine', value: 'Internal Medicine' },
                            { label: 'Surgery', value: 'Surgery' },
                            { label: 'Pediatrics', value: 'Pediatrics' },
                            {
                              label: 'Obstetrics and Gynecology',
                              value: 'Obstetrics and Gynecology',
                            },
                            { label: 'Psychiatry', value: 'Psychiatry' },
                            { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                            { label: 'Family Medicine', value: 'Family Medicine' },
                          ]}
                          // onChange={(e) => setUsmleCategory(e.target.value)}
                          {...register('usmleCategory', { required: true })}
                          feedback="Please select USMLE Category."
                          invalid={errors.usmleCategory ? true : false}
                        />
                      ) : (
                        ''
                      )}
                      {getValues('usmleStep') == '3' ? (
                        <CFormSelect
                          label="USMLE Category"
                          aria-label="usmle category"
                          id="usmleCategory"
                          defaultValue={getValues('usmleCategory')}
                          options={[
                            { label: 'Select USMLE Category', value: '' },
                            { label: 'Internal Medicine', value: 'Internal Medicine' },
                            { label: 'Surgery', value: 'Surgery' },
                            { label: 'Pediatrics', value: 'Pediatrics' },
                            {
                              label: 'Obstetrics and Gynecology',
                              value: 'Obstetrics and Gynecology',
                            },
                            { label: 'Psychiatry', value: 'Psychiatry' },
                            { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                            { label: 'Family Medicine', value: 'Family Medicine' },
                          ]}
                          // onChange={(e) => setUsmleCategory(e.target.value)}
                          {...register('usmleCategory', { required: true })}
                          feedback="Please select USMLE Category."
                          invalid={errors.usmleCategory ? true : false}
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
                      placeholder="Enter Question"
                      // value={question}
                      // onChange={(e) => setQuestion(e.target.value)}
                      {...register('question', { required: true })}
                      feedback="Question is required"
                      invalid={errors.question ? true : false}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormTextarea
                      label="Explaination"
                      type="text"
                      id="explain"
                      rows={4}
                      placeholder="Explain question"
                      {...register('explaination', { required: true })}
                      feedback="Explaination is required"
                      invalid={errors.explaination ? true : false}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="options">Options</CFormLabel>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="First option"
                          type="text"
                          // onChange={(e) => setOp1(e.target.value)}
                          // value={op1}
                          {...register('op1', { required: true })}
                          feedback="Option 1 is required"
                          invalid={errors.op1 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="First option explaination"
                          type="text"
                          {...register('op1Explain', { required: true })}
                          feedback="Explaination of Option 1 is required"
                          invalid={errors.op1Explain ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Second option"
                          type="text"
                          {...register('op2', { required: true })}
                          feedback="Option 2 is required"
                          invalid={errors.op2 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Second option explaination"
                          type="text"
                          {...register('op2Explain', { required: true })}
                          feedback="Explaination of Option 2 is required"
                          invalid={errors.op2Explain ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Third option"
                          type="text"
                          {...register('op3', { required: true })}
                          feedback="Option 3 is required"
                          invalid={errors.op3 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Third option explaination"
                          type="text"
                          {...register('op3Explain', { required: true })}
                          feedback="Explaination of Option 3 is required"
                          invalid={errors.op3Explain ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="First option"
                          type="text"
                          // onChange={(e) => setOp1(e.target.value)}
                          // value={op1}
                          {...register('op4', { required: true })}
                          feedback="Option 4 is required"
                          invalid={errors.op4 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="First option explaination"
                          type="text"
                          {...register('op4Explain', { required: true })}
                          feedback="Explaination of Option 4 is required"
                          invalid={errors.op4Explain ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormSelect
                      label="Correct Option"
                      aria-label="correct option"
                      id="correct"
                      defaultValue={getValues('correct')}
                      options={[
                        { label: 'Select Correct Option', value: '' },
                        { label: getValues('op1'), value: option1 },
                        { label: getValues('op2'), value: option2 },
                        { label: getValues('op3'), value: option3 },
                        { label: getValues('op4'), value: option4 },
                      ]}
                      // onChange={(e) => setCorrect(e.target.value)}
                      {...register('correct', { required: true })}
                      feedback="Please select correct option"
                      invalid={errors.correct ? true : false}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormInput
                      type="file"
                      id="formFile"
                      label="Change Image"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </CCol>
                  <CCol md={6}>
                    <center>
                      <img
                        src={`${API_URL}uploads/${image}`}
                        alt="image"
                        className="w-52 h-36 rounded-full"
                      />
                    </center>
                  </CCol>
                </CRow>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setEditModal(false)}>
                Close
              </CButton>
              {questionId ? (
                <CButton color="primary" type="submit" disabled={loading ? true : false}>
                  {loading ? <CSpinner color="light" size="sm" /> : 'Edit'}
                </CButton>
              ) : (
                <CButton color="primary" type="submit" disabled={loading ? true : false}>
                  {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
                </CButton>
              )}
            </CModalFooter>
          </CForm>
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
              No
            </CButton>
            <CButton color="primary" onClick={deleteQuestion} disabled={loading ? true : false}>
              {loading ? <CSpinner color="light" size="sm" /> : 'Yes'}
            </CButton>
          </CModalFooter>
        </CModal>
        {/* comment Modal */}
        <CModal
          alignment="center"
          visible={commentModal}
          onClose={() => {
            setCommentModal(false)
            setComments([])
          }}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Comments</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Comments received for this question
            <ul className="mt-2">
              {comments && comments.length > 0
                ? comments.map((c, i) => (
                    <>
                      <li className="flex justify-between items-center py-2" key={i}>
                        <span>{c.commentText}</span>
                        <strong>{moment(c.createdAt).format('MMMM Do YYYY')}</strong>
                      </li>
                      <hr />
                    </>
                  ))
                : ''}
            </ul>
          </CModalBody>
          {/* <CModalFooter>
            <CButton color="secondary" onClick={() => setCommentModal(false)}>
              Close
            </CButton>
          </CModalFooter> */}
        </CModal>
      </>
    </AdminLayout>
  )
}
export default Comments
