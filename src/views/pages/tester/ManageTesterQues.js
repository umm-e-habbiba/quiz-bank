import { AppHeader } from 'src/components'
import TesterSidebar from 'src/components/tester/TesterSidebar'
import TesterLayout from 'src/layout/TesterLayout'
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
  CFormCheck,
  CProgress,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
//////////
import JoditEditor from 'jodit-react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiEyeLine } from 'react-icons/ri'
import ReactPaginate from 'react-paginate'
/// video player
import '../../../../node_modules/video-react/dist/video-react.css' // import css
import { Player } from 'video-react'
import DropBox from 'src/components/admin/DropBox'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import { FaCheck, FaCheckDouble } from 'react-icons/fa'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { ImCross } from 'react-icons/im'

const ManageTesterQues = () => {
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
  const [allQuestion, setAllQuestion] = useState([])
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [addModal, setAddModal] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [imgLoader, setImgLoader] = useState(false)
  const [img2Loader, setImg2Loader] = useState(false)
  const [questionId, setQuestionId] = useState('')
  const [srNo, setSrNo] = useState('')
  const [image, setImage] = useState('')
  const [image2, setImage2] = useState('')
  const [videoLoader, setVideoLoader] = useState(false)
  const [videoSrc, setVideoSrc] = useState('')
  const [video, setVideo] = useState('')
  const [prevVideo, setPrevVideo] = useState(false)
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [qError, setQError] = useState(false)
  const [expError, setExpError] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [op6, setOp6] = useState('')
  const [op1Exp, setOp1Exp] = useState('')
  const [op2Exp, setOp2Exp] = useState('')
  const [op3Exp, setOp3Exp] = useState('')
  const [op4Exp, setOp4Exp] = useState('')
  const [op5Exp, setOp5Exp] = useState('')
  const [op6Exp, setOp6Exp] = useState('')
  const [deleteIds, setDeleteIds] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [filterUsmle, setFilterUsmle] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showFilteredResult, setShowFilteredResult] = useState(false)
  const [file, setFile] = useState()
  const [fileEnter, setFileEnter] = useState(false)
  const [showCheck, setShowCheck] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(0)
  const [filtercurrentPage, setfilterCurrentPage] = useState(1)
  const [filtertotal, setfilterTotal] = useState(0)
  const [filtertotalPages, setfilterTotalPages] = useState(0)
  const [filterpageSize, setfilterPageSize] = useState(0)
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '')
  const expmodules = {
    toolbar: [['bold', 'italic', 'underline', 'image']],
  }
  const expformats = ['bold', 'italic', 'underline', 'image']
  const modules = {
    toolbar: [['bold', 'italic', 'underline']],
  }
  const formats = ['bold', 'italic', 'underline']
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
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const storedUserId = localStorage.getItem('userId')
      setUserId(storedUserId)
      getAllQuest(currentPage)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    console.log(progress)
  }, [progress])
  useEffect(() => {
    getQuestion()
  }, [questionId])
  useEffect(() => {
    console.log('delete id array is changed')
  }, [deleteIds])

  const getAllQuest = (pageNo) => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(`${API_URL}tester/mcqs/${userId}?page=${pageNo}`, requestOptions)
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
        console.log('respone data:', result)

        setLoader(false)
        if (result.data) {
          setAllQuestion(result.data)
          setCurrentPage(result.pagination?.page)
          setTotal(result.pagination?.total)
          setTotalPages(result.pagination?.totalPages)
          setPageSize(result.pagination?.limit)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  const getQuestion = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'mcq/' + questionId, requestOptions)
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
          if (result.data.video != null) {
            setVideoSrc(result.data.video)
            setVideo(result.data.video)
            setPrevVideo(true)
          } else {
            setPrevVideo(false)
          }
        }
      })
      .catch((error) => console.log('error', error))
  }

  const editQuestion = (data) => {
    setIsLoading(true)
    setErrorr(false)
    setErrorMsg('')

    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    // Create FormData and append fields
    const formdata = new FormData()
    formdata.append('usmleStep', data.usmleStep)
    formdata.append('USMLE', data.usmleCategory)
    formdata.append('question', data.question)
    formdata.append('optionOne', data.op1)
    formdata.append('correctAnswer', data.correct)
    formdata.append('questionExplanation', data.explaination)
    formdata.append('image', image)
    formdata.append('imageTwo', image2)
    formdata.append('video', video)
    formdata.append('optionTwo', data.op2)
    formdata.append('optionThree', data.op3)
    formdata.append('optionFour', data.op4)
    formdata.append('optionFive', data.op5)
    formdata.append('srNo', srNo)
    if (op6) formdata.append('optionSix', op6)
    if (op1Exp) formdata.append('optionOneExplanation', op1Exp)
    if (op2Exp) formdata.append('optionTwoExplanation', op2Exp)
    if (op3Exp) formdata.append('optionThreeExplanation', op3Exp)
    if (op4Exp) formdata.append('optionFourExplanation', op4Exp)
    if (op5Exp) formdata.append('optionFiveExplanation', op5Exp)
    if (op6Exp) formdata.append('optionSixExplanation', op6Exp)
    const testerName = localStorage.getItem('testerName')
    if (userId) formdata.append('correctedBy', userId)
    if (testerName) formdata.append('nameOfTester', testerName)

    const requestOptions = {
      method: 'PUT',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'tester/edit-question/' + questionId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setAddModal(false)
          setIsLoading(false)
          // getAllQuest()
          if (showFilteredResult) {
            const indexToReplace = filteredQuestion.findIndex((ques) => ques._id === questionId)

            if (indexToReplace !== -1) {
              const updatedQuestionSplice = [...filteredQuestion]
              updatedQuestionSplice.splice(indexToReplace, 1, result.data)
              // console.log(updatedQuestionSplice)
              setFilteredQuestion(updatedQuestionSplice)
            }
          } else {
            const indexToReplace = allQuestion.findIndex((ques) => ques._id === questionId)

            if (indexToReplace !== -1) {
              const updatedQuestionSplice = [...allQuestion]
              updatedQuestionSplice.splice(indexToReplace, 1, result.data)
              // console.log(updatedQuestionSplice)
              setAllQuestion(updatedQuestionSplice)
            }
          }
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

  const deleteImage = () => {
    // console.log('delete image', questionId)
    setImgLoader(true)
    setErrorr(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'mcq/' + questionId + '/image', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setImgLoader(false)
          getQuestion()
          setSuccess(true)
          setSuccessMsg('Image deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
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
    setErrorr(false)
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
          getQuestion()
          setSuccess(true)
          setSuccessMsg('Image deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
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
    setErrorr(false)
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
          getQuestion()
          setSuccess(true)
          setSuccessMsg('Video deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
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
  const getFilteredQuestions = (pageNo) => {
    // console.log('step', filterUsmle, 'category', filterCategory)
    if (filterUsmle == '' && filterCategory == '') {
      // do nothing
    } else {
      setLoader(true)
      const myHeaders = new Headers()
      myHeaders.append('Authorization', token)
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        usmleStep: filterUsmle,
        USMLE: filterCategory,
      })
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }
      fetch(`${API_URL}tester/filtered-mcqs/${userId}?page=${pageNo}`, requestOptions)
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
          if (result.success == true) {
            setShowFilteredResult(true)
            setFilteredQuestion(result.data)
            setfilterCurrentPage(result.pagination?.page)
            setfilterTotal(result.pagination?.total)
            setfilterTotalPages(result.pagination?.totalPages)
            setfilterPageSize(result.pagination?.limit)
          }
        })
        .catch((error) => {
          console.error(error)
          setLoader(false)
        })
    }
  }
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      event.target.checked = true
    } else {
      event.target.checked = false
    }
    let newArray = [...deleteIds, event.target.id]
    if (deleteIds.includes(event.target.id)) {
      newArray = newArray.filter((id) => id !== event.target.id)
    }
    setDeleteIds(newArray)
  }
  const handleCheckboxChangeAll = (event) => {
    if (event.target.checked) {
      let checkboxes = document.querySelectorAll('.checkboxes')
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = true
      }, this)
      if (showFilteredResult) {
        let ids = filteredQuestion.map((item) => item._id)
        setDeleteIds(ids)
      } else {
        let ids = allQuestion.map((item) => item._id)
        setDeleteIds(ids)
      }
    } else {
      setDeleteIds([])
      let checkboxes = document.querySelectorAll('.checkboxes')
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false
      }, this)
    }
  }

  const markCorrect = (id) => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const testerName = localStorage.getItem('testerName')
    if (!userId) {
      console.error('User ID is not found in session storage.')
      return
    }
    if (!testerName) {
      console.error('Tester Name is not found in session storage.')
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ userId, testerName }),
      redirect: 'follow',
    }

    fetch(API_URL + 'tester/mark-correct/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('result', result, 'ques array', allQuestion)
        // getAllQuest()
        if (showFilteredResult) {
          setFilteredQuestion(
            filteredQuestion.map((ques) => {
              if (ques._id === id) {
                // Create a *new* object with changes
                return { ...ques, isCorrect: true }
              } else {
                // No changes
                return ques
              }
            }),
          )
        } else {
          setAllQuestion(
            allQuestion.map((ques) => {
              if (ques._id === id) {
                // Create a *new* object with changes
                return { ...ques, isCorrect: true }
              } else {
                // No changes
                return ques
              }
            }),
          )
        }
      })
      .catch((error) => console.log('error', error))
  }
  const unMarkCorrect = (id) => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const testerName = localStorage.getItem('testerName')
    if (!userId) {
      console.error('User ID is not found in session storage.')
      return
    }
    if (!testerName) {
      console.error('Tester Name is not found in session storage.')
      return
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ userId, testerName }),
      redirect: 'follow',
    }

    fetch(API_URL + 'tester/unmark-correct/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('result', result, 'ques array', allQuestion)
        // getAllQuest()
        if (showFilteredResult) {
          setFilteredQuestion(
            filteredQuestion.map((ques) => {
              if (ques._id === id) {
                // Create a *new* object with changes
                return { ...ques, isCorrect: false }
              } else {
                // No changes
                return ques
              }
            }),
          )
        } else {
          setAllQuestion(
            allQuestion.map((ques) => {
              if (ques._id === id) {
                // Create a *new* object with changes
                return { ...ques, isCorrect: false }
              } else {
                // No changes
                return ques
              }
            }),
          )
        }
      })
      .catch((error) => console.log('error', error))
  }

  const [stepsAllowed, setStepsAllowed] = useState('')
  const [subjectsAllowed, setSubjectsAllowed] = useState([])

  useEffect(() => {
    const getUserSteps = async () => {
      if (!userId) {
        console.error('User ID not found in session storage')
        setLoader(false)
        return
      }

      const myHeaders = new Headers()
      myHeaders.append('Authorization', `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      }

      try {
        const response = await fetch(
          `${API_URL}tester-allowed-credentials/${userId}`,
          requestOptions,
        )
        const result = await response.json()

        if (result.success) {
          setStepsAllowed(result.stepsAllowed)
          setSubjectsAllowed(result.subjectsAllowed)
        } else {
          console.error('Error fetching data:', result.message)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      } finally {
        setLoader(false)
      }
    }

    getUserSteps()
  }, [])

  const allowedSteps = stepsAllowed === 'all' ? ['1', '2', '3'] : [stepsAllowed]
  const getAllowedCategories = () => {
    let categories = []
    if (filterUsmle === '1' && allowedSteps.includes('1')) {
      categories = step1Categories.filter((category) => subjectsAllowed.includes(category))
    } else if (filterUsmle === '2' && allowedSteps.includes('2')) {
      categories = step2Categories.filter((category) => subjectsAllowed.includes(category))
    } else if (filterUsmle === '3' && allowedSteps.includes('3')) {
      categories = step3Categories.filter((category) => subjectsAllowed.includes(category))
    }
    return categories
  }

  const showNextButton = currentPage - 1 !== totalPages - 1
  const showPrevButton = currentPage - 1 !== 0

  const showFilterNextButton = filtercurrentPage - 1 !== filtertotalPages - 1
  const showFilterPrevButton = filtercurrentPage - 1 !== 0
  return (
    <div>
      <TesterSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <>
            <CCard className="mb-4 mx-4">
              {/* <div>
                  <div>
                    {loader ? (
                      <p>Loading...</p>
                    ) : (
                      <div>
                        <h3>Steps Allowed</h3>
                        <p>{stepsAllowed}</p>

                        <h3>Subjects Allowed</h3>
                        <ul>
                          {subjectsAllowed.map((subject, index) => (
                            <li key={index}>{subject}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div> */}
              <CCardHeader>
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col">
                      <strong>Manage Questions</strong>
                      {!loader &&
                        allQuestion.length > 0 &&
                        (showFilteredResult ? (
                          <span className="text-sm">Total {filtertotal} questions found</span>
                        ) : (
                          <span className="text-sm">Total {total} questions found</span>
                        ))}
                    </div>
                    <div>
                      {(stepsAllowed === 'all' ||
                        allowedSteps.includes('1') ||
                        allowedSteps.includes('2') ||
                        allowedSteps.includes('3')) && (
                        <div className="flex ml-0 lg:ml-2 justify-center items-center w-full lg:w-[550px] flex-col lg:flex-row mt-2 lg:mt-0">
                          <CFormSelect
                            aria-label="usmle step"
                            id="usmleStep"
                            options={[
                              { label: 'USMLE Step', value: '' },
                              ...(allowedSteps.includes('1')
                                ? [{ label: 'Step 1', value: '1' }]
                                : []),
                              ...(allowedSteps.includes('2')
                                ? [{ label: 'Step 2', value: '2' }]
                                : []),
                              ...(allowedSteps.includes('3')
                                ? [{ label: 'Step 3', value: '3' }]
                                : []),
                            ]}
                            value={filterUsmle}
                            onChange={(e) => {
                              setFilterUsmle(e.target.value)
                              setFilterCategory('')
                            }}
                            className="mr-0 lg:mr-3 mb-2 lg:mb-0 w-full"
                          />
                          <CFormSelect
                            aria-label="usmle category"
                            id="usmleCategory"
                            defaultValue=""
                            className="mr-0 lg:mr-3 mb-2 lg:mb-0 w-full"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                          >
                            <option>USMLE Category</option>
                            {getAllowedCategories().map((category, idx) => (
                              <option key={idx} value={category}>
                                {category}
                              </option>
                            ))}
                          </CFormSelect>
                          <CButton
                            className="text-white bg-[#6261CC] hover:bg-[#4f4ea0] w-full lg:w-auto flex justify-center items-center mb-2 lg:mb-0"
                            onClick={() => {
                              setfilterCurrentPage(1)
                              getFilteredQuestions(1)
                            }}
                          >
                            <CIcon icon={cilFilter} className="mr-0 lg:mr-1" /> Filter
                          </CButton>
                          {(filterUsmle || filterCategory) && (
                            <CButton
                              className="text-white bg-[#6261CC] hover:bg-[#4f4ea0] ml-0 lg:ml-3 mb-2 lg:mb-0 w-full lg:w-auto flex justify-center items-center"
                              onClick={() => {
                                setFilterUsmle('')
                                setFilterCategory('')
                                setShowFilteredResult(false)
                              }}
                            >
                              Clear
                            </CButton>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* {totalPages > 1 && (
                      <CFormSelect
                        aria-label="Select Page"
                        id="page"
                        // className="w-[300px] float-right"
                        className="mb-2 lg:mb-0 w-full lg:w-[200px]"
                        onChange={(e) => {
                          setCurrentPage(e.target.value)
                          getAllQuest(e.target.value)
                        }}
                      >
                        <option disabled selected>
                          Select Page
                        </option>
                        {Array.apply(null, { length: totalPages }).map((e, i) => (
                          <option
                            key={i}
                            disabled={currentPage == i + 1 ? true : false}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        ))}
                      </CFormSelect>
                    )} */}
                </div>
              </CCardHeader>
              <CCardBody>
                {/* {loader ? (
              <div className="text-center"> 
                <CSpinner className="bg-[#6261CC]" variant="grow" />
              </div>
            ) : ( */}
                <CTable striped className="admin-tables text-sm lg:text-base" responsive>
                  <CTableHead className="text-sm lg:text-base">
                    <CTableRow>
                      {showCheck && (
                        <CTableHeaderCell scope="col">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            // id={q._id}
                            // value={q._id}
                            onChange={(e) => handleCheckboxChangeAll(e)}
                          />
                        </CTableHeaderCell>
                      )}
                      <CTableHeaderCell scope="col">Sr No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Question</CTableHeaderCell>
                      <CTableHeaderCell scope="col">USMLE Step</CTableHeaderCell>
                      <CTableHeaderCell scope="col">USMLE Category</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Image</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Correct Answer</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {loader ? (
                      <CTableRow>
                        <CTableDataCell className="text-center" colSpan={6}>
                          <div className="lds-spinner mt-1 mb-4">
                            {[...Array(12)].map((_, index) => (
                              <div key={index}></div>
                            ))}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      <>
                        {allQuestion && allQuestion.length > 0 ? (
                          showFilteredResult ? (
                            filteredQuestion && filteredQuestion.length > 0 ? (
                              filteredQuestion.map((q, idx) => (
                                <CTableRow key={idx}>
                                  {showCheck && (
                                    <CTableDataCell>
                                      <input
                                        type="checkbox"
                                        className="form-check-input checkboxes"
                                        id={q._id}
                                        value={q._id}
                                        onChange={(e) => handleCheckboxChange(e)}
                                        // checked={
                                        //   deleteIds.filter((id) => id == q.id).length > 0 ? true : false
                                        // }
                                      />
                                    </CTableDataCell>
                                  )}
                                  <CTableDataCell>
                                    <div
                                      className={
                                        q.isCorrect ? 'text-green-600 font-bold' : 'font-bold'
                                      }
                                    >
                                      {q.srNo}
                                    </div>
                                  </CTableDataCell>
                                  <CTableHeaderCell className="cursor-pointer">
                                    <span
                                      id={q._id}
                                      onClick={(e) => {
                                        setDetailModal(true)
                                        setQuestionId(e.currentTarget.id)
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          q.question.length > 100
                                            ? q.question.substring(0, 100) + '...'
                                            : q.question,
                                      }}
                                    >
                                      {/* {q.question.length > 100
                                ? q.question.substring(0, 100) + '...'
                                : q.question} */}
                                    </span>
                                  </CTableHeaderCell>
                                  <CTableDataCell>{q.usmleStep}</CTableDataCell>
                                  <CTableDataCell>{q.USMLE}</CTableDataCell>
                                  {/* <CTableDataCell>
                            <img
                              src={`${API_URL}uploads/${q.image}`}
                              alt="mcq img"
                              className="w-6 h-6 rounded-full"
                            />
                          </CTableDataCell> */}
                                  <CTableDataCell>{q.correctAnswer}</CTableDataCell>

                                  <CTableDataCell className="flex justify-start items-center">
                                    <CTooltip
                                      key={q._id}
                                      content={q.isCorrect ? 'Uncheck Question' : 'Check Question'}
                                    >
                                      <CButton
                                        className={
                                          q.isCorrect
                                            ? 'text-white bg-green-800 hover:bg-green-600 mr-3 my-2'
                                            : 'text-white bg-green-600 hover:bg-green-800 mr-3 my-2'
                                        }
                                        id={q._id}
                                        onClick={(e) => {
                                          if (q.isCorrect) {
                                            setQuestionId(e.currentTarget.id)
                                            unMarkCorrect(e.currentTarget.id)
                                          } else {
                                            setQuestionId(e.currentTarget.id)
                                            markCorrect(e.currentTarget.id)
                                          }
                                        }}
                                      >
                                        {q.isCorrect ? (
                                          <ImCross className="my-1" />
                                        ) : (
                                          <FaCheck className="my-1" />
                                        )}
                                        {/* <IoCheckmarkDoneSharp className="my-1" /> */}
                                      </CButton>
                                    </CTooltip>

                                    <CTooltip content="Edit Question">
                                      <CButton
                                        color="info"
                                        className="text-white mr-3 my-2"
                                        id={q._id}
                                        onClick={(e) => {
                                          setAddModal(true)
                                          setQuestionId(e.currentTarget.id)
                                          setSrNo(q.srNo)
                                          setErrorr(false)
                                          setErrorMsg('')
                                        }}
                                      >
                                        <CIcon icon={cilPencil} />
                                      </CButton>
                                    </CTooltip>
                                  </CTableDataCell>
                                </CTableRow>
                              ))
                            ) : (
                              <CTableRow>
                                <CTableDataCell className="text-center" colSpan={6}>
                                  No records found <br />
                                  <CButton
                                    color="link"
                                    onClick={() => setShowFilteredResult(false)}
                                  >
                                    Show All
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            )
                          ) : (
                            allQuestion.map((q, idx) => (
                              <CTableRow key={idx}>
                                {showCheck && (
                                  <CTableDataCell>
                                    <input
                                      type="checkbox"
                                      className="form-check-input checkboxes"
                                      id={q._id}
                                      value={q._id}
                                      onChange={(e) => handleCheckboxChange(e)}
                                      // checked={
                                      //   deleteIds.filter((id) => id == q.id).length > 0 ? true : false
                                      // }
                                    />
                                  </CTableDataCell>
                                )}
                                <CTableDataCell>
                                  <div
                                    className={
                                      q.isCorrect ? 'text-green-600 font-bold' : 'font-bold'
                                    }
                                  >
                                    {q.srNo}
                                  </div>
                                </CTableDataCell>
                                <CTableHeaderCell className="cursor-pointer">
                                  <span
                                    id={q._id}
                                    onClick={(e) => {
                                      setDetailModal(true)
                                      setQuestionId(e.currentTarget.id)
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        q.question.length > 100
                                          ? q.question.substring(0, 100) + '...'
                                          : q.question,
                                    }}
                                  >
                                    {/* {q.question.length > 100
                              ? q.question.substring(0, 100) + '...'
                              : q.question} */}
                                  </span>
                                </CTableHeaderCell>
                                <CTableDataCell>{q.usmleStep}</CTableDataCell>
                                <CTableDataCell>{q.USMLE}</CTableDataCell>
                                {/* <CTableDataCell>
                          <img
                            src={`${API_URL}uploads/${q.image}`}
                            alt="mcq img"
                            className="w-6 h-6 rounded-full"
                          />
                        </CTableDataCell> */}
                                <CTableDataCell>{q.correctAnswer}</CTableDataCell>
                                <CTableDataCell className="flex justify-start items-center">
                                  <CTooltip
                                    key={q._id}
                                    content={q.isCorrect ? 'Uncheck Question' : 'Check Question'}
                                  >
                                    <CButton
                                      className={
                                        q.isCorrect
                                          ? 'text-white bg-green-800 hover:bg-green-600 mr-3 my-2'
                                          : 'text-white bg-green-600 hover:bg-green-800 mr-3 my-2'
                                      }
                                      id={q._id}
                                      onClick={(e) => {
                                        if (q.isCorrect) {
                                          setQuestionId(e.currentTarget.id)
                                          unMarkCorrect(e.currentTarget.id)
                                        } else {
                                          setQuestionId(e.currentTarget.id)
                                          markCorrect(e.currentTarget.id)
                                        }
                                      }}
                                    >
                                      {q.isCorrect ? (
                                        <ImCross className="my-1" />
                                      ) : (
                                        <FaCheck className="my-1" />
                                      )}
                                      {/* <IoCheckmarkDoneSharp className="my-1" /> */}
                                    </CButton>
                                  </CTooltip>

                                  <CTooltip content="Edit Question">
                                    <CButton
                                      color="info"
                                      className="text-white mr-3 my-2"
                                      id={q._id}
                                      onClick={(e) => {
                                        setAddModal(true)
                                        setQuestionId(e.currentTarget.id)
                                        setErrorr(false)
                                        setErrorMsg('')
                                        setSrNo(q.srNo)
                                      }}
                                    >
                                      <CIcon icon={cilPencil} />
                                    </CButton>
                                  </CTooltip>
                                </CTableDataCell>
                              </CTableRow>
                            ))
                          )
                        ) : (
                          <CTableRow>
                            <CTableDataCell className="text-center" colSpan={6}>
                              No Questions Found
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {total > pageSize && !showFilteredResult && (
                          <CTableRow>
                            <CTableDataCell className="text-center" colSpan={6}>
                              <ReactPaginate
                                breakLabel={
                                  <span className="w-9 h-9 border border-solid">
                                    <span className="flex justify-center items-center">...</span>
                                  </span>
                                }
                                marginPagesDisplayed={2}
                                nextLabel={
                                  <span
                                    className={`${showNextButton ? 'page-no cursor-pointer' : 'cursor-disabled opacity-50'} w-9 h-9 flex justify-center items-center border border-solid rounded-r-md`}
                                  >
                                    <RiArrowRightSLine />
                                  </span>
                                }
                                // onPageChange={handlePageClick}
                                onPageChange={(event) => {
                                  setCurrentPage(event.selected + 1)
                                  getAllQuest(event.selected + 1)
                                }}
                                pageRangeDisplayed={3}
                                pageCount={totalPages}
                                previousLabel={
                                  <span
                                    className={`${showPrevButton ? 'page-no cursor-pointer' : 'cursor-disabled opacity-50'} w-9 h-9 flex justify-center items-center border border-solid rounded-l-md`}
                                  >
                                    <RiArrowLeftSLine />
                                  </span>
                                }
                                containerClassName={
                                  'flex justify-center items-center pagination mr-3'
                                }
                                pageClassName={
                                  'block border border-solid page-no border-lightGray hover:bg-lightGray w-9 h-9 flex justify-center items-center '
                                }
                                activeClassName={'active-page-no text-white'}
                                forcePage={currentPage - 1}
                                // initialPage={currentPage}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                        {filtertotal > filterpageSize && showFilteredResult && (
                          <CTableRow>
                            <CTableDataCell className="text-center" colSpan={6}>
                              <ReactPaginate
                                breakLabel={
                                  <span className="w-9 h-9 border border-solid">
                                    <span className="flex justify-center items-center">...</span>
                                  </span>
                                }
                                marginPagesDisplayed={3}
                                nextLabel={
                                  <span
                                    className={`${showFilterNextButton ? 'page-no cursor-pointer' : 'cursor-disabled opacity-50'} w-9 h-9 flex justify-center items-center border border-solid rounded-r-md`}
                                  >
                                    <RiArrowRightSLine />
                                  </span>
                                }
                                // onPageChange={handlePageClick}
                                onPageChange={(event) => {
                                  setfilterCurrentPage(event.selected + 1)
                                  getFilteredQuestions(event.selected + 1)
                                }}
                                pageRangeDisplayed={3}
                                pageCount={filtertotalPages}
                                previousLabel={
                                  <span
                                    className={`${showFilterPrevButton ? 'page-no cursor-pointer' : 'cursor-disabled opacity-50'} w-9 h-9 flex justify-center items-center border border-solid rounded-l-md`}
                                  >
                                    <RiArrowLeftSLine />
                                  </span>
                                }
                                containerClassName={
                                  'flex justify-center items-center pagination mr-3'
                                }
                                pageClassName={
                                  'block border border-solid page-no border-lightGray hover:bg-lightGray w-9 h-9 flex justify-center items-center '
                                }
                                activeClassName={'active-page-no text-white'}
                                forcePage={filtercurrentPage - 1}
                                // initialPage={currentPage}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </>
                    )}
                  </CTableBody>
                </CTable>
                {/* )} */}
              </CCardBody>
            </CCard>
            {/* add / edit modal */}
            <CModal
              alignment="center"
              visible={addModal}
              onClose={() => setAddModal(false)}
              aria-labelledby="VerticallyCenteredExample"
              // scrollable={true}
              size="lg"
              backdrop="static"
            >
              <CModalHeader>
                <CModalTitle id="VerticallyCenteredExample">
                  {questionId ? 'Edit' : 'Add'} Question
                </CModalTitle>
              </CModalHeader>
              <CForm
                onSubmit={questionId ? handleSubmit(editQuestion) : handleSubmit(editQuestion)}
              >
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
                              // options={[
                              //   { label: 'Select USMLE Category', value: '' },
                              //   { label: 'Microbiology', value: 'Microbiology' },
                              //   { label: 'Immunology', value: 'Immunology' },
                              //   { label: 'Histology', value: 'Histology' },
                              //   { label: 'Anatomy', value: 'Anatomy' },
                              //   { label: 'Physiology', value: 'Physiology' },
                              //   { label: 'Embryology', value: 'Embryology' },
                              //   { label: 'Biochemistry', value: 'Biochemistry' },
                              // ]}
                              {...register('usmleCategory', { required: true })}
                              feedback="Please select USMLE Category."
                              invalid={errors.usmleCategory ? true : false}
                              // onChange={(e) => setUsmleCategory(e.target.value)}
                            >
                              <option>Select USMLE Category</option>
                              {step1Categories.map((category, idx) => (
                                <option key={idx} value={category}>
                                  {category}
                                </option>
                              ))}
                            </CFormSelect>
                          ) : (
                            ''
                          )}
                          {getValues('usmleStep') == '2' ? (
                            <CFormSelect
                              label="USMLE Category"
                              aria-label="usmle category"
                              id="usmleCategory"
                              defaultValue={getValues('usmleCategory')}
                              // options={[
                              //   { label: 'Select USMLE Category', value: '' },
                              //   { label: 'Internal Medicine', value: 'Internal Medicine' },
                              //   { label: 'Surgery', value: 'Surgery' },
                              //   { label: 'Pediatrics', value: 'Pediatrics' },
                              //   {
                              //     label: 'Obstetrics and Gynecology',
                              //     value: 'Obstetrics and Gynecology',
                              //   },
                              //   { label: 'Psychiatry', value: 'Psychiatry' },
                              //   { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                              //   { label: 'Family Medicine', value: 'Family Medicine' },
                              // ]}
                              // onChange={(e) => setUsmleCategory(e.target.value)}
                              {...register('usmleCategory', { required: true })}
                              feedback="Please select USMLE Category."
                              invalid={errors.usmleCategory ? true : false}
                            >
                              <option>Select USMLE Category</option>
                              {step2Categories.map((category, idx) => (
                                <option key={idx} value={category}>
                                  {category}
                                </option>
                              ))}
                            </CFormSelect>
                          ) : (
                            ''
                          )}
                          {getValues('usmleStep') == '3' ? (
                            <CFormSelect
                              label="USMLE Category"
                              aria-label="usmle category"
                              id="usmleCategory"
                              defaultValue={getValues('usmleCategory')}
                              // options={[
                              //   { label: 'Select USMLE Category', value: '' },
                              //   { label: 'Internal Medicine', value: 'Internal Medicine' },
                              //   { label: 'Surgery', value: 'Surgery' },
                              //   { label: 'Pediatrics', value: 'Pediatrics' },
                              //   {
                              //     label: 'Obstetrics and Gynecology',
                              //     value: 'Obstetrics and Gynecology',
                              //   },
                              //   { label: 'Psychiatry', value: 'Psychiatry' },
                              //   { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                              //   { label: 'Family Medicine', value: 'Family Medicine' },
                              // ]}
                              // onChange={(e) => setUsmleCategory(e.target.value)}
                              {...register('usmleCategory', { required: true })}
                              feedback="Please select USMLE Category."
                              invalid={errors.usmleCategory ? true : false}
                            >
                              <option>Select USMLE Category</option>
                              {step3Categories.map((category, idx) => (
                                <option key={idx} value={category}>
                                  {category}
                                </option>
                              ))}
                            </CFormSelect>
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
                        {/* <CFormInput
                      label="Question"
                      type="text"
                      id="ques"
                      placeholder="Enter Question"
                      // value={question}
                      // onChange={(e) => setQuestion(e.target.value)}
                      {...register('question', { required: true })}
                      feedback="Question is required"
                      invalid={errors.question ? true : false}
                    /> */}
                        <label className="form-label">Question</label>
                        {/* <ReactQuill
                      theme="snow"
                      name="question"
                      value={getValues('question')}
                      // value={...register('question', { required: true })}
                      // onChange={(e) => console.log('question', e.toString())}
                      placeholder="Enter question here"
                      formats={formats}
                      modules={modules}
                      onChange={(e) => setValue('question', e.toString())}
                    /> */}
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
                        {/* <CFormTextarea
                      label="Explaination"
                      type="text"
                      id="explain"
                      rows={4}
                      placeholder="Explain question"
                      {...register('explaination', { required: true })}
                      feedback="Explaination is required"
                      invalid={errors.explaination ? true : false}
                    /> */}
                        <label className="form-label">Explanation</label>
                        {/* <ReactQuill
                      theme="snow"
                      name="question"
                      value={getValues('explaination')}
                      placeholder="Enter question explanation here"
                      formats={expformats}
                      modules={expmodules}
                      onChange={(e) => setValue('explaination', e.toString())}
                    /> */}
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
                              // {...register('op1Explain', { required: true })}
                              // feedback="Explaination of Option 1 is required"
                              // invalid={errors.op1Explain ? true : false}
                              onChange={(e) => setOp1Exp(e.target.value)}
                              value={op1Exp}
                              disabled={questionId ? (op1Exp ? false : true) : false}
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
                              // {...register('op2Explain', { required: true })}
                              // feedback="Explaination of Option 2 is required"
                              // invalid={errors.op2Explain ? true : false}
                              onChange={(e) => setOp2Exp(e.target.value)}
                              value={op2Exp}
                              disabled={questionId ? (op2Exp ? false : true) : false}
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
                              // {...register('op3Explain', { required: true })}
                              // feedback="Explaination of Option 3 is required"
                              // invalid={errors.op3Explain ? true : false}
                              onChange={(e) => setOp3Exp(e.target.value)}
                              value={op3Exp}
                              disabled={questionId ? (op3Exp ? false : true) : false}
                              className="mb-2"
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol md={6}>
                            <CFormInput
                              placeholder="Forth option"
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
                              placeholder="Forth option explaination"
                              type="text"
                              // {...register('op4Explain', { required: true })}
                              // feedback="Explaination of Option 4 is required"
                              // invalid={errors.op4Explain ? true : false}
                              onChange={(e) => setOp4Exp(e.target.value)}
                              value={op4Exp}
                              disabled={questionId ? (op4Exp ? false : true) : false}
                              className="mb-2"
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol md={6}>
                            <CFormInput
                              placeholder="Fifth option"
                              type="text"
                              // onChange={(e) => setOp1(e.target.value)}
                              // value={op1}
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
                              // {...register('op5Explain', { required: true })}
                              // feedback="Explaination of Option 5 is required"
                              // invalid={errors.op5Explain ? true : false}
                              onChange={(e) => setOp5Exp(e.target.value)}
                              value={op5Exp}
                              disabled={questionId ? (op5Exp ? false : true) : false}
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
                              disabled={questionId ? (op6Exp ? false : true) : false}
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
                          <CButton
                            color="danger"
                            onClick={deleteImage}
                            className="mt-3"
                            disabled={imgLoader ? true : false}
                          >
                            {imgLoader ? <CSpinner color="light" size="sm" /> : 'Delete Image'}
                          </CButton>
                        </CCol>
                        <CCol md={6}>
                          <center>
                            <img
                              src={`${API_URL}uploads/images/${image}`}
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
                          <CButton
                            color="danger"
                            onClick={deleteImage2}
                            className="mt-3"
                            disabled={img2Loader ? true : false}
                          >
                            {img2Loader ? <CSpinner color="light" size="sm" /> : 'Delete Image'}
                          </CButton>
                        </CCol>
                        <CCol md={6}>
                          <center>
                            <img
                              src={`${API_URL}uploads/images/${image2}`}
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
                    {questionId && video ? (
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
                                <source
                                  src={`${API_URL}uploads/videos/${video}`}
                                  type="video/mp4"
                                />
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
                    )}
                    {/* <CRow className="mb-3">
                  <CCol md={12}>
                    <p className="form-label">Video</p>
                    <DropBox
                      file={prevVideo ? `${API_URL}uploads/videos/${video}` : video}
                      // file={questionId && videoSrc ? `${API_URL}uploads/videos/${video}` : video}
                      setFile={setVideo}
                      fileEnter={fileEnter}
                      setFileEnter={setFileEnter}
                      setVideoSrc={setVideoSrc}
                    />
                    <div className="flex justify-center items-center mt-3">
                      {video && (
                        <CButton
                          onClick={() => {
                            setVideo('')
                            setVideoSrc('')
                            setPrevVideo(false)
                          }}
                          color="danger"
                          // className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-red-600 text-white rounded"
                        >
                          Reset
                        </CButton>
                      )}
                      {questionId && video && (
                        <CButton
                          color="danger"
                          onClick={deleteVideo}
                          className="ml-3"
                          disabled={videoLoader ? true : false}
                        >
                          {videoLoader ? <CSpinner color="light" size="sm" /> : 'Delete Video'}
                        </CButton>
                      )}
                    </div>
                  </CCol>
                </CRow> */}
                    {/* <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormInput
                      type="file"
                      id="formFile"
                      label="Upload Video"
                      onChange={(e) => handleVideoChange(e.target.files[0])}
                    />
                  </CCol>
                </CRow>
                {videoSrc && (
                  <center>
                    <Player playsInline src={videoSrc} fluid={false} width={480} height={272} />
                  </center>
                )} */}
                  </CForm>
                  {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setAddModal(false)}>
                    Close
                  </CButton>
                  {questionId ? (
                    <CButton color="primary" type="submit" disabled={loading ? true : false}>
                      {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
                    </CButton>
                  ) : (
                    <CButton color="primary" type="submit" disabled={loading ? true : false}>
                      {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
                    </CButton>
                  )}
                </CModalFooter>
              </CForm>
            </CModal>
            <CModal
              alignment="center"
              visible={detailModal}
              backdrop="static"
              onClose={() => {
                setDetailModal(false)
                reset({})
                setImage('')
                setOp6('')
                setOp6Exp('')
              }}
              aria-labelledby="VerticallyCenteredExample"
              size="lg"
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
                    >
                      {/* {getValues('explaination')} */}
                    </span>
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
                          <span>F. {op6Exp}</span>
                          <br />
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
                  <CRow>
                    <CCol md={2}>
                      <strong>Image</strong>
                    </CCol>
                    <CCol md={10}>
                      <img
                        src={`${API_URL}uploads/images/${image}`}
                        alt="image"
                        className="w-52 h-36 rounded-full"
                      />
                    </CCol>
                  </CRow>
                )}
              </CModalBody>
              <CModalFooter>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setDetailModal(false)
                    reset({})
                    setImage('')
                    setOp6('')
                    setOp6Exp('')
                  }}
                >
                  Close
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
                  {image || videoSrc ? (
                    <CRow className="mb-5">
                      <CCol md={8}>
                        <p dangerouslySetInnerHTML={{ __html: getValues('question') }}></p>
                      </CCol>
                      <CCol md={4}>
                        {image && (
                          <img
                            // src={image}
                            src={`${API_URL}uploads/images/${image}`}
                            alt="question image"
                            className="mb-3"
                          />
                        )}
                        {videoSrc && (
                          <video controls>
                            {videoSrc && (
                              <source
                                src={`${API_URL}uploads/videos/${videoSrc}`}
                                type="video/mp4"
                              />
                            )}
                          </video>
                        )}
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
        </div>
      </div>
    </div>
  )
}

export default ManageTesterQues
