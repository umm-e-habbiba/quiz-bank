import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CForm,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
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
  CSpinner,
  CAlert,
  CProgress,
  CFormSelect,
  CFormInput,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
import { RiDeleteBin5Line, RiEyeLine } from 'react-icons/ri'
import ReviewExamAccordion from '../dashboard/ReviewExamAccordion'
import { useForm } from 'react-hook-form'
import JoditEditor from 'jodit-react'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
const ManageExams = () => {
  const editor = useRef(null)
  const options = ['bold', 'italic', 'underline', 'image', 'table']
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
      defaultActionOnPaste: 'insert_as_text',
      defaultLineHeight: 1.5,
      enter: 'div',
      // options that we defined in above step.
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: true,
    }),
    [],
  )
  //////
  const navigate = useNavigate()
  const [allExam, setAllExam] = useState([])

  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [detailLoader, setDetailLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [examDetail, setExamDetail] = useState(false)
  const [showAllExams, setShowAllExams] = useState(true)
  const [allQuestions, setAllQuestions] = useState([])
  const [allSections, setAllSections] = useState([])
  const [usmleStep, setUsmleStep] = useState([])
  const [op6, setOp6] = useState('')
  const [op1Exp, setOp1Exp] = useState('')
  const [op2Exp, setOp2Exp] = useState('')
  const [op3Exp, setOp3Exp] = useState('')
  const [op4Exp, setOp4Exp] = useState('')
  const [op5Exp, setOp5Exp] = useState('')
  const [op6Exp, setOp6Exp] = useState('')
  const [imgLoader, setImgLoader] = useState(false)
  const [img2Loader, setImg2Loader] = useState(false)
  const [image, setImage] = useState('')
  const [image2, setImage2] = useState('')
  const [videoLoader, setVideoLoader] = useState(false)
  const [videoSrc, setVideoSrc] = useState('')
  const [video, setVideo] = useState('')
  const [activeIndex, setActiveIndex] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [progress, setProgress] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: '',
      op1: '',
      op2: '',
      op3: '',
      op4: '',
      op5: '',
      correct: '',
      explaination: '',
    },
  })

  const option1 = watch('op1')
  const option2 = watch('op2')
  const option3 = watch('op3')
  const option4 = watch('op4')
  const option5 = watch('op5')
  const option6 = op6

  useEffect(() => {
    getAllExams()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    console.log(progress)
  }, [progress])
  // useEffect(() => {
  //   getQuestion()
  // }, [questionId])

  const getAllExams = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'uploaded-tests', requestOptions)
      .then((response) => {
        const contentLength = response.headers.get('content-length')
        let loaded = 0
        return new Response(
          new ReadableStream({
            start(controller) {
              const reader = response.body.getReader()
              read()
              function read() {
                reader.read().then((progressEvent) => {
                  if (progressEvent.done) {
                    controller.close()
                    return
                  }
                  loaded += progressEvent.value.byteLength

                  const percentageComplete = Math.round((loaded / contentLength) * 100)
                  setProgress(percentageComplete)

                  controller.enqueue(progressEvent.value)
                  read()
                })
              }
            },
          }),
        )
      })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.data) {
          setAllExam(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const deleteExam = () => {
    setIsLoading(true)
    setErrorr(false)
    setErrorMsg('')
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'delete-test/' + examId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.success) {
          setDeleteModal(false)
          getAllExams()
          setSuccess(true)
          setSuccessMsg('Exam deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const getExam = (id) => {
    setDetailLoader(true)
    setExamId(id)
    console.log('exam id', id)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'manage-test/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('ques detail', result)
        if (result.data) {
          console.log('getExam', result)
          setAllQuestions(result.data?.questions)
          // setAllSections(result.data.sections)
          setUsmleStep(result.data?.usmleStep)
          // setTestName(result.data.testName)
          // setTotalExamQuest(result.data.totalQuestions)
          setDetailLoader(false)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const getQuestion = (qId) => {
    setQuestionId(qId)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'get-question/' + examId + '/' + qId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('ques detail', result)
        if (result.data) {
          reset({
            question: result.data.question,
            explaination: result.data.questionExplanation,
            op1: result.data.optionOne,
            op2: result.data.optionTwo,
            op3: result.data.optionThree,
            op4: result.data.optionFour,
            op5: result.data.optionFive,
            correct: result.data.correctAnswer,
          })
          setOp6(result.data.optionSix)
          setOp1Exp(result.data.optionOneExplanation)
          setOp2Exp(result.data.optionTwoExplanation)
          setOp3Exp(result.data.optionThreeExplanation)
          setOp4Exp(result.data.optionFourExplanation)
          setOp5Exp(result.data.optionFiveExplanation)
          setOp6Exp(result.data.optionSixExplanation)
          setImage(result.data.image)
          setImage2(result.data.imageTwo)
          if (result.data.video != null) {
            setVideoSrc(result.data.video)
            setVideo(result.data.video)
          }
        }
      })
      .catch((error) => console.log('error', error))
  }
  const editQuestion = (data) => {
    // console.log('edit function called', data)
    setIsLoading(true)
    setErrorr(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const formdata = new FormData()
    formdata.append('question', data.question)
    formdata.append('optionOne', data.op1)
    formdata.append('correctAnswer', data.correct)
    formdata.append('questionExplanation', data.explaination)
    if (image) {
      formdata.append('image', image)
    }
    if (image2) {
      formdata.append('imageTwo', image2)
    }
    formdata.append('video', video)
    formdata.append('optionTwo', data.op2)
    formdata.append('optionThree', data.op3)
    formdata.append('optionFour', data.op4)
    formdata.append('optionFive', data.op5)
    if (op6) {
      formdata.append('optionSix', op6)
    }
    if (op1Exp) {
      formdata.append('optionOneExplanation', op1Exp)
    }
    if (op2Exp) {
      formdata.append('optionTwoExplanation', op2Exp)
    }
    if (op3Exp) {
      formdata.append('optionThreeExplanation', op3Exp)
    }
    if (op4Exp) {
      formdata.append('optionFourExplanation', op4Exp)
    }
    if (op5Exp) {
      formdata.append('optionFiveExplanation', op5Exp)
    }
    if (op6Exp) {
      formdata.append('optionSixExplanation', op6Exp)
    }
    const requestOptions = {
      method: 'PUT',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'edit-question/' + questionId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.data) {
          setEditModal(false)
          setIsLoading(false)
          // getAllExams()
          // setShowAllExams(true)
          // setExamDetail(false)
          getExam(examId)
          setQuestionId('')
          setImage('')
          setImage2('')
          setVideo('')
          setVideoSrc('')
          setOp6('')
          setOp6Exp('')
          reset({})
          setSuccess(true)
          setSuccessMsg('Question updated successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
          setErrorMsg(result.message)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <AdminLayout>
      <>
        {loader ? (
          <div>
            <div className="flex flex-col gap-10 items-center mt-[25vh] mx-[15%]">
              <div className="lds-spinner -ml-8">
                {[...Array(12)].map((_, index) => (
                  <div key={index}></div>
                ))}
              </div>
              {/* <div className="text-sm font-medium text-gray-500 mt-2">
                <span className="text-[#6261CC]">{progress}%</span> Completed, Please wait while it
                get`s completed...
              </div>
              <CProgress color="primary" value={progress} className="my-3 w-full"></CProgress> */}
            </div>
          </div>
        ) : (
          <>
            {showAllExams && (
              <CCard className="mb-4 mx-4">
                <CCardHeader className="flex justify-between items-center">
                  <div className="flex">
                    <div className="flex flex-col">
                      <strong>Manage Exams</strong>
                      {!loader && allExam.length > 0 && (
                        <span className="text-sm">Total {allExam.length} exams added</span>
                      )}
                    </div>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CTable striped className="admin-tables">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Exam Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Usmle Step</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Total Questions</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {allExam && allExam.length > 0 ? (
                        allExam.map((exam, idx) => (
                          <CTableRow key={idx}>
                            <CTableHeaderCell className="cursor-pointer">
                              {exam.testName}
                            </CTableHeaderCell>
                            <CTableDataCell>{exam.usmleStep}</CTableDataCell>
                            <CTableDataCell>{exam.questions?.length}</CTableDataCell>
                            <CTableDataCell>
                              {moment(exam.TestCreatedAt).format('DD MMMM YYYY, h:mm a')}
                            </CTableDataCell>
                            <CTableDataCell className="flex justify-start items-center">
                              <CButton
                                color="success"
                                className="text-white py-1 mr-2"
                                id={exam._id}
                                onClick={(e) => {
                                  setShowAllExams(false)
                                  setExamDetail(true)
                                  setExamId(e.currentTarget.id)
                                  setErrorr(false)
                                  setErrorMsg('')
                                  getExam(e.currentTarget.id)
                                }}
                              >
                                {/* <RiEyeLine /> */}
                                Edit
                              </CButton>
                              <CButton
                                color="danger"
                                className="text-white py-2 my-2"
                                id={exam._id}
                                onClick={(e) => {
                                  setDeleteModal(true)
                                  setExamId(e.currentTarget.id)
                                  setErrorr(false)
                                  setErrorMsg('')
                                }}
                              >
                                {/* <CIcon icon={cilTrash} /> */}
                                <RiDeleteBin5Line />
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell className="text-center" colSpan={6}>
                            No Exams Found
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                  {/* )} */}
                </CCardBody>
              </CCard>
            )}
            {examDetail && (
              <CCard className="mb-4 mx-4">
                <CCardHeader className="flex justify-between items-center">
                  <div className="flex">
                    <div className="flex flex-col">
                      <strong>Exam Detail</strong>
                    </div>
                  </div>
                  <CButton
                    className="text-white bg-[#6261CC]  hover:bg-[#4f4ea0]"
                    onClick={() => {
                      setExamDetail(false)
                      setShowAllExams(true)
                    }}
                  >
                    Back to Exams
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  {detailLoader ? (
                    <center>
                      <CSpinner color="primary" variant="grow" />
                    </center>
                  ) : (
                    <>
                      {/* {allSections &&
                        allSections.length > 0 &&
                        allSections.map((section, index) => (
                          <div key={index}>
                            <p className="text-xl font-semibold">{section.section}</p> */}
                      <CTable striped className="admin-tables" responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col">No</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Question</CTableHeaderCell>
                            <CTableHeaderCell scope="col">USMLE Step</CTableHeaderCell>
                            {/* <CTableHeaderCell scope="col">Image</CTableHeaderCell> */}
                            {/* <CTableHeaderCell scope="col">Section</CTableHeaderCell> */}
                            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {allQuestions && allQuestions.length > 0 ? (
                            allQuestions.map((q, idx) => (
                              <>
                                {idx + 1 == 1 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 1
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 41 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 2
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 81 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 3
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 121 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 4
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 161 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 5
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 201 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 6
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 241 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 7
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                {idx + 1 == 281 && (
                                  <CTableRow>
                                    <CTableDataCell className="text-center section-bg" colSpan={4}>
                                      Section 8
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                                <CTableRow key={idx}>
                                  <CTableDataCell>{idx + 1}</CTableDataCell>
                                  <CTableHeaderCell className="cursor-pointer">
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          q.question?.length > 100
                                            ? q.question?.substring(0, 100) + '...'
                                            : q.question,
                                      }}
                                    >
                                      {/* {q.question.length > 100
                              ? q.question.substring(0, 100) + '...'
                              : q.question} */}
                                    </span>
                                  </CTableHeaderCell>
                                  <CTableDataCell>{usmleStep}</CTableDataCell>
                                  <CTableDataCell className="flex justify-start items-center">
                                    <CButton
                                      className="text-white bg-[#6261CC] hover:bg-[#4f4ea0] mr-3 my-2"
                                      id={q._id}
                                      onClick={(e) => {
                                        setViewModal(true)
                                        // setQuestionId(e.target.id)
                                        getQuestion(q._id)
                                      }}
                                      title="View"
                                    >
                                      <RiEyeLine className="my-1" />
                                    </CButton>
                                    <CButton
                                      color="info"
                                      className="text-white mr-3 my-2"
                                      id={q._id}
                                      onClick={(e) => {
                                        setEditModal(true)
                                        // setQuestionId(e.target.id)
                                        getQuestion(q._id)
                                        setErrorr(false)
                                        setErrorMsg('')
                                      }}
                                    >
                                      <CIcon icon={cilPencil} />
                                    </CButton>
                                    {/* <CButton
                                        color="danger"
                                        className="text-white my-2"
                                        id={q._id}
                                        onClick={(e) => {
                                          setDeleteModal(true)
                                          setQuestionId(e.currentTarget.id)
                                          setErrorr(false)
                                          setErrorMsg('')
                                        }}
                                      >
                                        <CIcon icon={cilTrash} />
                                      </CButton> */}
                                  </CTableDataCell>
                                </CTableRow>
                              </>
                            ))
                          ) : (
                            <CTableRow>
                              <CTableDataCell className="text-center" colSpan={4}>
                                No Questions Found
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </CTableBody>
                      </CTable>
                      {/* {section.questions?.map((q, index) => (
                            <ReviewExamAccordion
                              key={index}
                              id={q}
                              question={q.question}
                              answer={q.correctAnswer}
                              op1={q.optionOne}
                              op2={q.optionTwo}
                              op3={q.optionThree}
                              op4={q.optionFour}
                              op5={q.optionFive}
                              op6={q.optionSix ? q.optionSix : ''}
                              isOpen={activeIndex === index}
                              onClick={() => handleItemClick(index)}
                              explanation={q.questionExplanation}
                              op1Exp={q.optionOneExplanation ? q.optionOneExplanation : ''}
                              op2Exp={q.optionTwoExplanation ? q.optionTwoExplanation : ''}
                              op3Exp={q.optionThreeExplanation ? q.optionThreeExplanation : ''}
                              op4Exp={q.optionFourExplanation ? q.optionFourExplanation : ''}
                              op5Exp={q.optionFiveExplanation ? q.optionFiveExplanation : ''}
                              op6Exp={q.optionSixExplanation ? q.optionSixExplanation : ''}
                              image={q.image ? q.image : ''}
                              imageTwo={q.imageTwo ? q.imageTwo : ''}
                              video={q.video ? q.video : ''}
                              isapproved={false}
                            />
                          ))} */}
                      {/* </div>
                        ))} */}
                    </>
                  )}
                </CCardBody>
              </CCard>
            )}
          </>
        )}
        {/* edit modal */}
        <CModal
          alignment="center"
          visible={editModal}
          onClose={() => setEditModal(false)}
          aria-labelledby="VerticallyCenteredExample"
          size="lg"
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Edit Question</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit(editQuestion)}>
            <CModalBody>
              <CForm>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <label className="form-label">Question</label>
                    <JoditEditor
                      value={getValues('question')}
                      config={config}
                      onChange={(e) => setValue('question', e.toString())}
                    />
                    {errors.question && (
                      <span className="text-red-500 text-sm">Question is required</span>
                    )}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <label className="form-label">Explanation</label>
                    <JoditEditor
                      ref={editor}
                      value={getValues('explaination')}
                      config={config}
                      tabIndex={1}
                      onChange={(e) => setValue('explaination', e.toString())}
                    />
                    {errors.explaination && (
                      <span className="text-red-500 text-sm">Explanation is required</span>
                    )}
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
                          onChange={(e) => setOp1Exp(e.target.value)}
                          value={op1Exp}
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
                          onChange={(e) => setOp2Exp(e.target.value)}
                          value={op2Exp}
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
                          onChange={(e) => setOp3Exp(e.target.value)}
                          value={op3Exp}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Forth option"
                          type="text"
                          {...register('op4', { required: true })}
                          feedback="Option 4 is required"
                          invalid={errors.op4 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Forth option explaination"
                          type="text"
                          onChange={(e) => setOp4Exp(e.target.value)}
                          value={op4Exp}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Fifth option"
                          type="text"
                          {...register('op5', { required: true })}
                          feedback="Option 5 is required"
                          invalid={errors.op5 ? true : false}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Fifth option explaination"
                          type="text"
                          onChange={(e) => setOp5Exp(e.target.value)}
                          value={op5Exp}
                          className="mb-2"
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Sixth option"
                          type="text"
                          onChange={(e) => setOp6(e.target.value)}
                          value={op6}
                          className="mb-2"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          placeholder="Sixth option explaination"
                          type="text"
                          onChange={(e) => setOp6Exp(e.target.value)}
                          value={op6Exp}
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
                      options={
                        op6
                          ? [
                              { label: 'Select Correct Option', value: '' },
                              { label: getValues('op1'), value: getValues('op1') },
                              { label: getValues('op2'), value: getValues('op2') },
                              { label: getValues('op3'), value: getValues('op3') },
                              { label: getValues('op4'), value: getValues('op4') },
                              { label: getValues('op5'), value: getValues('op5') },
                              { label: op6, value: op6 },
                            ]
                          : [
                              { label: 'Select Correct Option', value: '' },
                              { label: getValues('op1'), value: getValues('op1') },
                              { label: getValues('op2'), value: getValues('op2') },
                              { label: getValues('op3'), value: getValues('op3') },
                              { label: getValues('op4'), value: getValues('op4') },
                              { label: getValues('op5'), value: getValues('op5') },
                            ]
                      }
                      {...register('correct', { required: true })}
                      feedback="Please select correct option"
                      invalid={errors.correct ? true : false}
                    />
                  </CCol>
                </CRow>
                {questionId && image ? (
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
                          src={`${API_URL}uploads/testimages/${image}`}
                          alt="image"
                          className="w-52 h-36 rounded-lg"
                        />
                      </center>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Image"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </CCol>
                  </CRow>
                )}
                {questionId && image2 ? (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Change Explanation Image"
                        onChange={(e) => setImage2(e.target.files[0])}
                      />
                    </CCol>
                    <CCol md={6}>
                      <center>
                        <img
                          src={`${API_URL}uploads/testimages/${image2}`}
                          alt="image"
                          className="w-52 h-36 rounded-lg"
                        />
                      </center>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Explanation Image"
                        onChange={(e) => setImage2(e.target.files[0])}
                      />
                    </CCol>
                  </CRow>
                )}
              </CForm>
              {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setEditModal(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading ? true : false}>
                {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
        {/* delete modal */}
        <CModal
          alignment="center"
          visible={deleteModal}
          onClose={() => setDeleteModal(false)}
          aria-labelledby="VerticallyCenteredExample"
          backdrop="static"
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
        {/* view quiz modal */}
        <CModal
          alignment="center"
          fullscreen
          visible={viewModal}
          backdrop="static"
          onClose={() => {
            setViewModal(false)
          }}
          aria-labelledby="VerticallyCenteredExample"
          size="lg"
        >
          <CModalHeader></CModalHeader>
          <CModalBody>
            <div className="p-10">
              {/* <p className="text-2xl">Questions</p> */}
              {image ? (
                <CRow className="mb-5">
                  <CCol md={8}>
                    <p dangerouslySetInnerHTML={{ __html: getValues('question') }}></p>
                  </CCol>
                  <CCol md={4}>
                    {image && (
                      <img
                        // src={image}
                        src={`${API_URL}uploads/testimages/${image}`}
                        alt="question image"
                        className="mb-3"
                      />
                    )}
                    {/* {videoSrc && (
                      <video controls>
                        {videoSrc && (
                          <source src={`${API_URL}uploads/videos/${videoSrc}`} type="video/mp4" />
                        )}
                      </video>
                    )} */}
                  </CCol>
                </CRow>
              ) : (
                <CRow className="mb-5">
                  <CCol md={12}>
                    <p dangerouslySetInnerHTML={{ __html: getValues('question') }}></p>
                  </CCol>
                </CRow>
              )}
              <div></div>
              <CForm>
                <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 min-w-64 w-fit">
                  <>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={getValues('op1')}
                        name={getValues('correct')}
                        value={getValues('op1')}
                        className="form-check-input"
                      />
                      <label className={`form-check-label ml-2`}>A. {getValues('op1')}</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={getValues('op2')}
                        name={getValues('correct')}
                        value={getValues('op2')}
                        className="form-check-input"
                      />
                      <label className={`form-check-label ml-2`}>B. {getValues('op2')}</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={getValues('op3')}
                        name={getValues('correct')}
                        value={getValues('op3')}
                        className="form-check-input"
                      />
                      <label className={`form-check-label ml-2`}>C. {getValues('op3')}</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={getValues('op4')}
                        name={getValues('correct')}
                        value={getValues('op4')}
                        className="form-check-input"
                      />
                      <label className={`form-check-label ml-2`}>D. {getValues('op4')}</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id={getValues('op5')}
                        name={getValues('correct')}
                        value={getValues('op5')}
                        className="form-check-input"
                      />
                      <label className={`form-check-label ml-2`}>E. {getValues('op5')}</label>
                    </div>
                    {op6 ? (
                      <div className="form-check">
                        <input
                          type="radio"
                          id={op6}
                          name={getValues('correct')}
                          value={op6}
                          className="form-check-input"
                        />
                        <label className={`form-check-label ml-2`}>F. {op6}</label>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                </div>
                <CButton color="primary" className="mx-auto px-5 rounded-full">
                  Next
                </CButton>
              </CForm>
              {/* <p className='text-2xl'>Explanation</p>
              {image2 ? (
                <CRow className="mb-5">
                  <CCol md={8}>
                    <p dangerouslySetInnerHTML={{ __html: getValues('explaination') }}></p>
                  </CCol>
                  <CCol md={4}>
                    {image2 && (
                      <img
                        // src={image}
                        src={`${API_URL}uploads/testimages/${image2}`}
                        alt="question image"
                        className="mb-3"
                      />
                    )}
                  </CCol>
                </CRow>
              ) : (
                <CRow className="mb-5">
                  <CCol md={12}>
                    <p dangerouslySetInnerHTML={{ __html: getValues('explaination') }}></p>
                  </CCol>
                </CRow>
              )} */}
            </div>
          </CModalBody>
        </CModal>
        {/* success alert */}
        {success && (
          <CAlert color="success" className="success-alert">
            {successMsg}
          </CAlert>
        )}
      </>
    </AdminLayout>
  )
}
export default ManageExams
