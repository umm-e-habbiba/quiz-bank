import React, { useEffect, useState, useRef, useMemo } from 'react'
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
import { cilPencil, cilTrash, cilCommentBubble } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import JoditEditor from 'jodit-react'
import { FaRegEye } from 'react-icons/fa'
import { RiDeleteBin5Fill, RiEyeLine } from 'react-icons/ri'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
const ExamComments = () => {
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
      toolbarAdaptive: false,
    }),
    [],
  )
  //////
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [addModal, setAddModal] = useState(false)
  //   const [deleteModal, setDeleteModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [imgLoader, setImgLoader] = useState(false)
  const [img2Loader, setImg2Loader] = useState(false)
  const [questionId, setQuestionId] = useState('')
  const [examId, setExamId] = useState('')
  const [image, setImage] = useState('')
  const [image2, setImage2] = useState('')
  const [videoLoader, setVideoLoader] = useState(false)
  const [videoSrc, setVideoSrc] = useState('')
  const [video, setVideo] = useState('')
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
  const [op6, setOp6] = useState('')
  const [op1Exp, setOp1Exp] = useState('')
  const [op2Exp, setOp2Exp] = useState('')
  const [op3Exp, setOp3Exp] = useState('')
  const [op4Exp, setOp4Exp] = useState('')
  const [op5Exp, setOp5Exp] = useState('')
  const [op6Exp, setOp6Exp] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [comments, setComments] = useState([])
  const role = localStorage.getItem('user') || ''
  const modules = {
    toolbar: [['bold', 'italic', 'underline']],
  }
  const formats = ['bold', 'italic', 'underline']
  const expmodules = {
    toolbar: [['bold', 'italic', 'underline', 'image']],
  }
  const expformats = ['bold', 'italic', 'underline', 'image']
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
      op5: '',
      correct: '',
      explaination: '',
    },
  })

  const stepSelected = watch('usmleStep')
  const option1 = watch('op1')
  const option2 = watch('op2')
  const option3 = watch('op3')
  const option4 = watch('op4')
  const option5 = watch('op5')
  const option6 = op6

  useEffect(() => {
    getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  //   useEffect(() => {
  //     getQuestion()
  //   }, [questionId])

  const getAllQuest = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'test-questions-with-comments', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.data) {
          setAllQuestion(result.data)
        } else {
          setAllQuestion([])
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const getQuestion = (qId, eId) => {
    setQuestionId(qId)
    setExamId(eId)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'get-question/' + eId + '/' + qId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('ques detail', result)
        if (result.data) {
          reset({
            usmleStep: result.data.usmleStep,
            usmleCategory: result.data.USMLE,
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
          setVideoSrc(result.data.video)
          setVideo(result.data.video)
        }
      })
      .catch((error) => console.log('error', error))
  }
  //   const deleteQuestion = () => {
  //     setIsLoading(true)
  //     setError(false)
  //     setErrorMsg('')
  //     // console.log(questionId)
  //     var myHeaders = new Headers()
  //     myHeaders.append('Authorization', token)

  //     var requestOptions = {
  //       method: 'DELETE',
  //       headers: myHeaders,
  //     }

  //     fetch(API_URL + 'delete-mcq/' + questionId, requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         // console.log(result)
  //         setIsLoading(false)
  //         if (result.success) {
  //           setDeleteModal(false)
  //           getAllQuest()
  //           setSuccess(true)
  //           setSuccessMsg('Question deleted successfully')
  //           setTimeout(() => {
  //             setSuccess(false)
  //             setSuccessMsg('')
  //           }, 3000)
  //         } else {
  //           setError(true)
  //           setErrorMsg(result.message)
  //         }
  //       })
  //       .catch((error) => console.log('error', error))
  //   }
  const editQuestion = (data) => {
    // console.log('edit function called', data)
    setIsLoading(true)
    setError(false)
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
    // formdata.append('video', video)
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
          setAddModal(false)
          setIsLoading(false)
          getAllQuest()
          setQuestionId('')
          setExamId('')
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
          setError(true)
          setErrorMsg(result.message)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  const deleteImage = () => {
    // console.log('delete image', questionId)
    setImgLoader(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const formdata = new FormData()
    formdata.append('image', null)
    const requestOptions = {
      method: 'DELETE',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'mcq/' + questionId + '/image', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setImgLoader(false)
          //   getQuestion()
          setSuccess(true)
          setSuccessMsg('Image deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setImgLoader(false)
      })
  }
  const deleteImage2 = () => {
    // console.log('delete image', questionId)
    setImg2Loader(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'mcq/' + questionId + '/imageTwo', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setImg2Loader(false)
          //   getQuestion()
          setSuccess(true)
          setSuccessMsg('Image deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setImg2Loader(false)
      })
  }
  const deleteVideo = () => {
    // console.log('delete video', questionId)
    setVideoLoader(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'mcq/' + questionId + '/video', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setVideoLoader(false)
          //   getQuestion()
          setSuccess(true)
          setSuccessMsg('Video deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setVideoLoader(false)
      })
  }
  const handleVideoChange = (file) => {
    var reader = new FileReader()
    setVideo(file)
    // console.log(file)
    // var url = URL.createObjectURL(file)
    // setVideoSrc(url)
    // console.log('video url', url)
  }
  const deleteComment = (commentId) => {
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'delete-comment/' + questionId + '/' + commentId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setDetailModal(false)
          getAllQuest(questionId, examId)
          setSuccess(true)
          setSuccessMsg('Comment deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setImg2Loader(false)
      })
  }
  return (
    <AdminLayout>
      <>
        <CCard className="mb-4 mx-4">
          <CCardHeader className="flex justify-between items-center">
            <strong>Manage Exam Comments</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped className="admin-tables">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Test Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Question</CTableHeaderCell>
                  {/*<CTableHeaderCell scope="col">USMLE Category</CTableHeaderCell> */}
                  {/* <CTableHeaderCell scope="col">Image</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Correct Answer</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loader ? (
                  <CTableRow>
                    <CTableDataCell className="text-center" colSpan={5}>
                      <div className="text-center">
                        <CSpinner color="success" variant="grow" />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  <>
                    {allQuestion && allQuestion.length > 0 ? (
                      allQuestion.map((q, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{q.testId?.testName}</CTableDataCell>
                          <CTableHeaderCell>
                            <span
                              // id={q._id}
                              // onClick={(e) => {
                              //   setDetailModal(true)
                              //   setComments(q.comments)
                              //   setQuestionId(e.currentTarget.id)
                              // }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  q.question.length > 100
                                    ? q.question.substring(0, 100) + '...'
                                    : q.question,
                              }}
                            ></span>
                          </CTableHeaderCell>
                          {/* <CTableDataCell>{q.usmleStep}</CTableDataCell>
                        <CTableDataCell>{q.USMLE}</CTableDataCell> */}
                          <CTableDataCell>{q.correctAnswer}</CTableDataCell>
                          <CTableDataCell className="flex justify-start items-center">
                            <CButton
                              color="primary"
                              className="text-white my-2 mr-2 py-2"
                              id={q._id}
                              onClick={(e) => {
                                setDetailModal(true)
                                setComments(q.comments)
                                setQuestionId(e.currentTarget.id)
                                getQuestion(q._id, q.testId?._id)
                                // console.log('view called', questionId, 'id', e.currentTarget.id)
                              }}
                            >
                              <RiEyeLine className="text-[20px]" />
                            </CButton>
                            <CButton
                              color="info"
                              className="text-white mr-1 my-2"
                              id={q._id}
                              onClick={(e) => {
                                setAddModal(true)
                                setQuestionId(e.currentTarget.id)
                                setError(false)
                                setErrorMsg('')
                                getQuestion(q._id, q.testId?._id)
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
                              setError(false)
                              setErrorMsg('')
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton> */}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell className="text-center" colSpan={5}>
                          No Questions with Comments Found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        {/* add / edit modal */}
        <CModal
          alignment="center"
          visible={addModal}
          onClose={() => setAddModal(false)}
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
                      ref={editor}
                      value={getValues('question')}
                      config={config}
                      tabIndex={1}
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
                      value={getValues('explaination')?.replace(/\(Choice/g, '<br/>• (Option')}
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
                          disabled={op1Exp ? false : true}
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
                          disabled={op2Exp ? false : true}
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
                          disabled={op3Exp ? false : true}
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
                          disabled={op4Exp ? false : true}
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
                          disabled={op5Exp ? false : true}
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
                          disabled={op6Exp ? false : true}
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
                              { label: getValues('op1'), value: option1 },
                              { label: getValues('op2'), value: option2 },
                              { label: getValues('op3'), value: option3 },
                              { label: getValues('op4'), value: option4 },
                              { label: getValues('op5'), value: option5 },
                              { label: op6, value: op6 },
                            ]
                          : [
                              { label: 'Select Correct Option', value: '' },
                              { label: getValues('op1'), value: option1 },
                              { label: getValues('op2'), value: option2 },
                              { label: getValues('op3'), value: option3 },
                              { label: getValues('op4'), value: option4 },
                              { label: getValues('op5'), value: option5 },
                            ]
                      }
                      {...register('correct', { required: true })}
                      feedback="Please select correct option"
                      invalid={errors.correct ? true : false}
                    />
                  </CCol>
                </CRow>
                {image ? (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Change Image"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      {/* <CButton
                        color="danger"
                        onClick={deleteImage}
                        className="mt-3"
                        disabled={imgLoader ? true : false}
                      >
                        {imgLoader ? <CSpinner color="light" size="sm" /> : 'Delete Image'}
                      </CButton> */}
                    </CCol>
                    <CCol md={6}>
                      <center>
                        <img
                          src={`${API_URL}uploads/testimages/${image}`}
                          alt="image"
                          className="w-52 h-36 rounded-full"
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
                {image2 ? (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Change Explanation Image"
                        onChange={(e) => setImage2(e.target.files[0])}
                      />
                      {/* <CButton
                        color="danger"
                        onClick={deleteImage2}
                        className="mt-3"
                        disabled={img2Loader ? true : false}
                      >
                        {img2Loader ? <CSpinner color="light" size="sm" /> : 'Delete Image'}
                      </CButton> */}
                    </CCol>
                    <CCol md={6}>
                      <center>
                        <img
                          src={`${API_URL}uploads/testimages/${image2}`}
                          alt="image"
                          className="w-52 h-36 rounded-full"
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
                {/* {video ? (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Change Video"
                        onChange={(e) => handleVideoChange(e.target.files[0])}
                      />
                      <CButton
                        color="danger"
                        onClick={deleteVideo}
                        className="mt-3"
                        disabled={videoLoader ? true : false}
                      >
                        {videoLoader ? <CSpinner color="light" size="sm" /> : 'Delete Video'}
                      </CButton>
                    </CCol>
                    <CCol md={6}>
                      <center>
                        <video controls>
                          {video && (
                            <source src={`${API_URL}uploads/videos/${video}`} type="video/mp4" />
                          )}
                        </video>
                      </center>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CFormInput
                        type="file"
                        id="formFile"
                        label="Video"
                        onChange={(e) => handleVideoChange(e.target.files[0])}
                      />
                    </CCol>
                  </CRow>
                )} */}
              </CForm>
              {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setAddModal(false)}>
                Close
              </CButton>
              <CButton color="primary" type="submit" disabled={loading ? true : false}>
                {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
        {/* delete modal */}
        {/* <CModal
          alignment="center"
          visible={deleteModal}
          backdrop="static"
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
        </CModal> */}
        {/* quiz detail modal */}
        <CModal
          alignment="center"
          visible={detailModal}
          backdrop="static"
          onClose={() => {
            setDetailModal(false)
            // reset({})
            // setImage('')
            // setOp6('')
            // setOp6Exp('')
            // setComments([])
          }}
          aria-labelledby="VerticallyCenteredExample"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Question Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Question</strong>
              </CCol>
              <CCol md={10}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getValues('question'),
                  }}
                >
                  {/* {getValues('question')} */}
                </span>
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Options</strong>
              </CCol>
              <CCol md={10}>
                <span>A. {getValues('op1')}</span>
                <br />
                <span>B. {getValues('op2')}</span>
                <br />
                <span>C. {getValues('op3')}</span>
                <br />
                <span>D. {getValues('op4')}</span>
                <br />
                <span>E. {getValues('op5')}</span>
                {op6 && (
                  <>
                    <br />
                    <span>F. {op6}</span>
                  </>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Step</strong>
              </CCol>
              <CCol md={10}>
                <span>{getValues('usmleStep')}</span>
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Category</strong>
              </CCol>
              <CCol md={10}>
                <span>{getValues('usmleCategory')}</span>
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Explanation</strong>
              </CCol>
              <CCol md={10}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getValues('explaination')?.replace(/\(Choice/g, '<br/>• (Option'),
                  }}
                ></span>
              </CCol>
            </CRow>
            {op1Exp || op2Exp || op3Exp || op4Exp || op5Exp || op6Exp ? (
              <CRow className="mb-2">
                <CCol md={2}>
                  <strong>Explained Options</strong>
                </CCol>
                <CCol md={10}>
                  {op1Exp && (
                    <>
                      <span>A. {op1Exp}</span>
                      <br />
                    </>
                  )}
                  {op2Exp && (
                    <>
                      <span>B. {op2Exp}</span>
                      <br />
                    </>
                  )}
                  {op3Exp && (
                    <>
                      <span>C. {op3Exp}</span>
                      <br />
                    </>
                  )}
                  {op4Exp && (
                    <>
                      <span>D. {op4Exp}</span>
                      <br />
                    </>
                  )}
                  {op5Exp && (
                    <>
                      <span>E. {op5Exp}</span>
                      <br />
                    </>
                  )}
                  {op6Exp && (
                    <>
                      <br />
                      <span>F. {op6Exp}</span>
                    </>
                  )}
                </CCol>
              </CRow>
            ) : (
              ''
            )}
            <CRow className="mb-2">
              <CCol md={2}>
                <strong>Answer</strong>
              </CCol>
              <CCol md={10}>
                <span>{getValues('correct')}</span>
              </CCol>
            </CRow>
            {image && (
              <CRow className="mb-3">
                <CCol md={2}>
                  <strong>Image</strong>
                </CCol>
                <CCol md={10}>
                  <img
                    src={`${API_URL}uploads/testimages/${image}`}
                    alt="image"
                    className="w-52 h-36"
                  />
                </CCol>
              </CRow>
            )}
            {image2 && (
              <CRow className="mb-3">
                <CCol md={2}>
                  <strong>Explanation Image</strong>
                </CCol>
                <CCol md={10}>
                  <img
                    src={`${API_URL}uploads/testimages/${image2}`}
                    alt="image"
                    className="w-52 h-36"
                  />
                </CCol>
              </CRow>
            )}

            <CRow>
              <CCol md={2} className="flex justify-start items-center">
                <strong>Comments</strong>
              </CCol>
              <CCol md={10}>
                {comments && comments.length > 0
                  ? comments.map((com, idx) => (
                      <>
                        <div className="flex justify-between items-center bg-red-300 p-2 rounded-md mb-2">
                          <span key={idx}>{com.commentText}</span>
                          <CButton color="light" onClick={() => deleteComment(com._id)}>
                            Delete this Comment
                          </CButton>
                        </div>
                      </>
                    ))
                  : 'No comments received for this question'}
              </CCol>
            </CRow>
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setDetailModal(false)
              }}
            >
              Close
            </CButton>
          </CModalFooter>
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
export default ExamComments
