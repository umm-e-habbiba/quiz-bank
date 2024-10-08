import {
  CButton,
  CForm,
  CFormInput,
  CAlert,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormSelect,
  CFormSwitch,
  CProgress,
  CSpinner,
} from '@coreui/react'
import React, { useState, useEffect, useRef } from 'react'
import { GoChevronRight } from 'react-icons/go'

import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import { API_URL } from 'src/store'

import Highlighter from 'react-highlight-words'
import image from '../assets/images/angular.jpg'
import CIcon from '@coreui/icons-react'
import { cilChevronDoubleLeft, cilChevronLeft } from '@coreui/icons'
import { RiCloseLine, RiEyeLine } from 'react-icons/ri'
// import markIcon from '../assets/images/mark-flag.png'
import markIcon from '../assets/images/mark-icon.svg'
// import { FaBars } from 'react-icons/fa'
// import { ImCross } from 'react-icons/im'
// import { CiUndo } from 'react-icons/ci'
// import { HiOutlineX } from 'react-icons/hi'
import '../scss/loader.scss'
const QuizLayout = () => {
  const navigate = useNavigate()
  const [detailModal, setDetailModal] = useState(false)
  const [loader, setLoader] = useState(true)
  const [examLoader, setExamLoader] = useState(false)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showSelectors, setShowSelectors] = useState(true)
  const [showQues, setShowQues] = useState(false)
  const [isTimer, setIsTimer] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [allAttemptedQuestion, setAllAttemptedQuestion] = useState([])
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [filteredQuestionBackup, setFilteredQuestionBackup] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [quizEnd, setQuizEnd] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [disableExam, setDisableExam] = useState(true)
  const [quizScore, setQuizScore] = useState(0)
  const [highlightedText, setHighlightedText] = useState([])
  const [fontSize, setFontSize] = useState(16)
  const [saveQuestionArray, setSaveQuestionArray] = useState([])
  const [opt1Marked, setOpt1Marked] = useState(false)
  const [opt2Marked, setOpt2Marked] = useState(false)
  const [opt3Marked, setOpt3Marked] = useState(false)
  const [opt4Marked, setOpt4Marked] = useState(false)
  const [opt5Marked, setOpt5Marked] = useState(false)
  const [opt6Marked, setOpt6Marked] = useState(false)
  const [totalQuest, setTotalQuest] = useState('')
  const [step1Questions, setStep1Questions] = useState('')
  const [step2Questions, setStep2Questions] = useState('')
  const [step3Questions, setStep3Questions] = useState('')
  const [step1QuestionsCate, setStep1QuestionsCate] = useState([])
  const [step2QuestionsCate, setStep2QuestionsCate] = useState([])
  const [step3QuestionsCate, setStep3QuestionsCate] = useState([])
  const [timeLeft, setTimeLeft] = useState('00:00')
  const [totalRows, setTotalRows] = useState([
    {
      step: '',
      category: '',
      number: '',
      preventAll: false,
      preventIncorrect: false,
      preventCorrect: false,
    },
  ])
  const questionText = useRef()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      total: '',
    },
  })
  const videoRef = useRef(null)
  useEffect(() => {
    if (videoRef.current && filteredQuestion[currentQuestion]?.video) {
      videoRef.current.load()
    }
  }, [filteredQuestion, currentQuestion])
  //new branch test
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
      // getAllQuest()
      getAllQuestCount(true)
      getAllAttemptedQuest()
      const interval = setInterval(() => {
        getAllQuestCount(false)
      }, 300000)

      return () => clearInterval(interval)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    console.log('rows')
    // console.log('rows', totalRows)
  }, [totalRows])

  useEffect(() => {
    console.log('saveQuestionArray')
  }, [saveQuestionArray])

  useEffect(() => {
    if (quizEnd) {
      navigate('/quiz-performance')
      saveQuiz()
    }
  }, [quizEnd])

  useEffect(() => {
    if (progress >= 100) {
      setLoader(false)
    }
    // console.log(progress)
  }, [progress])

  // useEffect(() => {
  //   const fetchQuestions = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 4000))
  //     setLoading(false)
  //   }

  //   fetchQuestions()

  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => {
  //       const newProgress = prevProgress + 1
  //       return Math.min(newProgress, 100)
  //     })
  //   }, 40)

  //   return () => clearInterval(timer)
  // }, [])

  const getAllQuest = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'mcqs', requestOptions)
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
        if (result.data) {
          setAllQuestion(result.data)
          const filterStep1Questions = result.data.filter((ques) => ques.usmleStep == 1)
          setStep1Questions(filterStep1Questions.length)
          const filterStep2Questions = result.data.filter((ques) => ques.usmleStep == 2)
          setStep2Questions(filterStep2Questions.length)
          const filterStep3Questions = result.data.filter((ques) => ques.usmleStep == 3)
          setStep3Questions(filterStep3Questions.length)
          // setLoader(false)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const getAllQuestCount = (loader) => {
    if (loader) {
      setLoader(true)
    }
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'get-count-of-questions', requestOptions)
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
        if (result.success) {
          // setAllQuestion(result.data)
          // const filterStep1Questions = result.data.filter((ques) => ques.usmleStep == 1)
          // setStep1Questions(filterStep1Questions.length)
          // const filterStep2Questions = result.data.filter((ques) => ques.usmleStep == 2)
          // setStep2Questions(filterStep2Questions.length)
          // const filterStep3Questions = result.data.filter((ques) => ques.usmleStep == 3)
          // setStep3Questions(filterStep3Questions.length)
          // setLoader(false)
          setStep1Questions(result.USMLEStepCounts?.USMLEStepOne?.total)
          setStep2Questions(result.USMLEStepCounts?.USMLEStepTwo?.total)
          setStep3Questions(result.USMLEStepCounts?.USMLEStepThree?.total)
          setStep1QuestionsCate(result.USMLEStepCounts?.USMLEStepOne?.categories)
          setStep2QuestionsCate(result.USMLEStepCounts?.USMLEStepTwo?.categories)
          setStep3QuestionsCate(result.USMLEStepCounts?.USMLEStepThree?.categories)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const getAllAttemptedQuest = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-attempted-questions/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('getAllAttemptedQuest', result)
        if (result.data) {
          setAllAttemptedQuestion(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const calculateSum = (array, property) => {
    const total = array.reduce((accumulator, object) => {
      return accumulator + Number(object[property])
    }, 0)

    return total
  }
  const setQues = (value, index) => {
    const list = [...totalRows]
    list[index].number = value //set number value
    setTotalRows(list)
    setTotalQuest(calculateSum(totalRows, 'number')) // calculate total number of questions from all rows
  }

  const fetchQuestion = (step, value, index) => {
    const filterSteps = allQuestion.filter((ques) => ques.usmleStep == step)
    if (filterSteps.length > 0) {
      setTotalRows(totalRows.map((item, idx) => (idx === index ? { ...item, step: step } : item)))
      // if usmle category is selected
      if (value) {
        setTotalRows(
          totalRows.map((item, idx) => (idx === index ? { ...item, category: value } : item)),
        )
        const filterUsmle = filterSteps.filter((ques) => ques.USMLE == value)
        if (filterUsmle.length > 0) {
          // console.log('filteredQuestion array', filteredQuestion, 'new array', filterUsmle)
          if (filteredQuestion.length > 0) {
            setFilteredQuestion((ques) => [...ques, ...filterUsmle])
            setFilteredQuestionBackup((ques) => [...ques, ...filterUsmle])
          } else {
            setFilteredQuestion(filterUsmle)
            setFilteredQuestionBackup(filterUsmle)
          }
        } else {
          setError(true)
          setErrorMsg('No Questions available for this USMLE, Kindly select another')
          setTimeout(() => {
            setError(false)
            setErrorMsg('')
          }, 1000)
        }
      }
    } else {
      // if no questions found for selected step send back to select steps
      setError(true)
      setErrorMsg('No Questions available for this Step, Kindly select another')
      setTimeout(() => {
        setError(false)
        setErrorMsg('')
      }, 1000)
    }
  }

  const handleFormSubmit = (e, id, value) => {
    // e.preventDefault()
    setOpt1Marked(false)
    setOpt2Marked(false)
    setOpt3Marked(false)
    setOpt4Marked(false)
    setOpt5Marked(false)
    setOpt6Marked(false)

    const already = saveQuestionArray.filter((q) => q.questionId == id)
    // console.log('already', already)
    if (already.length > 0) {
      checkAnswer(value)
      const valueIndex = saveQuestionArray.findIndex((obj) => obj.questionId == id)
      saveQuestionArray[valueIndex].selectedOption = value
      // console.log('already present', valueIndex)
      setSaveQuestionArray((prevQues) => [...prevQues])
    } else {
      // console.log('not present')
      checkAnswer(value)
      // handleNextQuestion()
      const questionObj = {
        questionId: id,
        selectedOption: value,
      }
      setSaveQuestionArray((prevQues) => [...prevQues, questionObj])
    }
    // console.log('selected option', selectedOption)
    // saveQuiz(id)
  }

  const checkAnswer = (value) => {
    if (value == filteredQuestion[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }

  const handleNextQuestion = (e) => {
    e.preventDefault()
    if (currentQuestion + 1 < totalQuest) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizEnd(true)
    }
  }

  const saveQuiz = () => {
    // console.log('user id', userID, 'selected option', selectedOption)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      userId: userID,
      attemptedQuizzes: [
        {
          questions: saveQuestionArray,
          totalScore: totalQuest, // need to add other rows question as well
          obtainedScore: quizScore,
          usmleSteps: null,
          USMLE: null,
        },
      ],
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'save-quizzes', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setSelectedOption('')
      })
      .catch((error) => {
        console.error(error)
      })
  }
  // const highlight = () => {
  //   const text = window.getSelection().toString()
  //   var innerHTML = questionText.current.innerHTML
  //   var index = innerHTML.indexOf(text)
  //   if (index >= 0) {
  //     innerHTML =
  //       innerHTML.substring(0, index) +
  //       "<span class='bg-yellow-300 text-yellow-700'>" +
  //       innerHTML.substring(index, index + text.length) +
  //       '</span>' +
  //       innerHTML.substring(index + text.length)
  //     questionText.current.innerHTML = innerHTML
  //   }
  // }

  const [highlightStack, setHighlightStack] = useState([])
  const highlight = () => {
    const text = window.getSelection().toString()
    const innerHTML = questionText.current.innerHTML
    const index = innerHTML.indexOf(text)
    if (index >= 0) {
      const spanTag = innerHTML.substring(index - 45, index)
      const isSpan = innerHTML.substring(index - 45, index).includes('<span')
      if (!isSpan) {
        const highlightedText = innerHTML.substring(index, index + text.length)
        questionText.current.innerHTML = innerHTML
          .toString()
          .replace(text, `<span class='bg-yellow-300 text-yellow-700'>${highlightedText}</span>`)
        setHighlightStack([...highlightStack, highlightedText])
      }
    }
  }

  const undoHighlight = () => {
    const questionElement = questionText.current
    const spans = questionElement.querySelectorAll('span.bg-yellow-300.text-yellow-700')
    spans.forEach((span) => {
      const text = span.textContent
      const startIndex = span.parentNode.textContent.indexOf(text)
      const endIndex = startIndex + text.length
      const originalText = span.parentNode.textContent.substring(startIndex, endIndex)
      span.outerHTML = originalText
    })
    setHighlightStack([])
  }

  const createMarkup = (value) => {
    return { __html: value }
  }

  const addRows = () => {
    // setTotalRows((prevList) => prevList.push(id + 1))

    setTotalRows([
      ...totalRows,
      {
        step: '',
        category: '',
        number: '',
        preventAll: false,
        preventIncorrect: false,
        preventCorrect: false,
      },
    ])
  }

  const removeRow = (index) => {
    // const rows = [...totalRows]
    // rows.splice(index, 1)
    // setTotalRows(rows)
    // totalRows.splice(index, 1)
    // setTotalRows(totalRows.splice(index, 1))
    // console.log(index)
    const list = [...totalRows]
    list.splice(index, 1)
    setTotalRows(list)
  }

  const startexam = async () => {
    setExamLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify(totalRows)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'create-quiz/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setExamLoader(false)
        // setSelectedOption('')
        let start = true
        if (result.success) {
          let quesArray = result.QuizQuestions
          let allFilteredIds = quesArray.map(({ _id }) => _id)
          const partialQuestionDetails = allFilteredIds.reduce((res, item) => {
            res.push({ questionId: item, selectedOption: '' })
            return res
          }, [])
          setSaveQuestionArray(partialQuestionDetails)
          setFilteredQuestion(quesArray)
          setTotalQuest(quesArray.length)
        } else {
          start = false
          setError(true)
          setErrorMsg(result.message)
          setTimeout(() => {
            setError(false)
            setErrorMsg('')
          }, 3000)
        }
        if (start == true) {
          setShowQues(true)
          setShowSelectors(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setExamLoader(false)
      })

    // console.log('total Questions', totalQuest)
    // let start = true
    // if (totalQuest < 1) {
    //   start = false
    //   setError(true)
    //   setErrorMsg('Please enter number between 1 and 100')
    //   setTimeout(() => {
    //     setError(false)
    //     setErrorMsg('')
    //   }, 3000)
    //   // setDisableExam(true)
    // } else if (totalQuest > 100) {
    //   start = false
    //   setError(true)
    //   setErrorMsg('Quiz should be of maximum 100 questions.')
    //   setTimeout(() => {
    //     setError(false)
    //     setErrorMsg('')
    //   }, 3000)
    // } else if (totalQuest > filteredQuestionBackup.length) {
    //   start = false
    //   setError(true)
    //   setErrorMsg(
    //     `${totalQuest} questions are not available. Kindly enter less number of questions`,
    //   )
    //   setTimeout(() => {
    //     setError(false)
    //     setErrorMsg('')
    //   }, 3000)
    //   // setDisableExam(true)
    // } else {
    //   // const totals = calculateSum(totalRows, 'number')
    //   // setTotalQuest(totals)
    //   var newArray = []
    //   await totalRows.map((row, index) => {
    //     if (
    //       row.number >
    //       filteredQuestionBackup.filter(
    //         (ques) => ques.usmleStep == row.step && ques.USMLE == row.category,
    //       ).length
    //     ) {
    //       start = false
    //       setError(true)
    //       setErrorMsg(
    //         `Only ${
    //           filteredQuestionBackup.filter(
    //             (ques) => ques.usmleStep == row.step && ques.USMLE == row.category,
    //           ).length
    //         } questions are available for ${row.category}.`,
    //       )
    //       // setErrorMsg(
    //       //   `${row.number} questions are not available for ${row.category}. Kindly enter less number of questions`,
    //       // )
    //       setTimeout(() => {
    //         setError(false)
    //         setErrorMsg('')
    //       }, 3000)
    //     } else {
    //       if (row.preventAll || row.preventCorrect || row.preventIncorrect) {
    //         if (row.preventAll) {
    //           let filteredAttemptedQuestions = getDifference(
    //             filteredQuestionBackup.filter(
    //               (ques) => ques.usmleStep == row.step && ques.USMLE == row.category,
    //             ),
    //             allAttemptedQuestion,
    //           )
    //           if (
    //             filteredAttemptedQuestions.length > 0 &&
    //             filteredAttemptedQuestions.length >= row.number
    //           ) {
    //             // /////////////////////////
    //             // newArray.push(
    //             //   filteredAttemptedQuestions
    //             //     .filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //             //     .slice(0, row.number),
    //             // )
    //             newArray.push(filteredAttemptedQuestions.slice(0, row.number))
    //           } else {
    //             setError(true)
    //             setErrorMsg(
    //               `Sorry!! Insufficient questions matching your filters. Please refine your criteria and try again`,
    //             )
    //             // setErrorMsg(`sorry!! ${totalRows[index].number} questions not found`)
    //             setTimeout(() => {
    //               setError(false)
    //               setErrorMsg('')
    //             }, 1000)
    //             start = false
    //           }
    //         }
    //         if (row.preventCorrect) {
    //           const allCorrected = allAttemptedQuestion.filter((obj1) => obj1.isCorrect == true)

    //           let filteredAttemptedQuestions = getDifference(
    //             filteredQuestionBackup.filter(
    //               (ques) => ques.usmleStep == row.step && ques.USMLE == row.category,
    //             ),
    //             allCorrected,
    //           )

    //           // console.log(
    //           //   'all attempted array',

    //           //   allAttemptedQuestion,
    //           //   'all corrected',
    //           //   allCorrected,
    //           //   'all corrected filtered',
    //           //   filteredAttemptedQuestions,
    //           // )
    //           if (
    //             filteredAttemptedQuestions.length > 0 &&
    //             filteredAttemptedQuestions.length >= row.number
    //           ) {
    //             // /////////////////////////
    //             newArray.push(filteredAttemptedQuestions.slice(0, row.number))
    //             // newArray.push(
    //             //   filteredAttemptedQuestions
    //             //     .filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //             //     .slice(0, row.number),
    //             // )
    //           } else {
    //             setError(true)
    //             setErrorMsg(
    //               `Sorry!! Insufficient questions matching your filters. Please refine your criteria and try again`,
    //             )
    //             // setErrorMsg(`sorry!! ${totalRows[index].number} questions not found`)
    //             setTimeout(() => {
    //               setError(false)
    //               setErrorMsg('')
    //             }, 1000)
    //             start = false
    //           }
    //         }
    //         if (row.preventIncorrect) {
    //           const allIncorrected = allAttemptedQuestion.filter((obj1) => obj1.isCorrect == false)
    //           let filteredAttemptedQuestions = getDifference(
    //             filteredQuestionBackup.filter(
    //               (ques) => ques.usmleStep == row.step && ques.USMLE == row.category,
    //             ),
    //             allIncorrected,
    //           )
    //           if (
    //             filteredAttemptedQuestions.length > 0 &&
    //             filteredAttemptedQuestions.length >= row.number
    //           ) {
    //             // /////////////////////////
    //             // newArray.push(
    //             //   filteredAttemptedQuestions
    //             //     .filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //             //     .slice(0, row.number),
    //             // )
    //             newArray.push(filteredAttemptedQuestions.slice(0, row.number))
    //           } else {
    //             setError(true)
    //             setErrorMsg(
    //               `Sorry!! Insufficient questions matching your filters. Please refine your criteria and try again`,
    //             )
    //             // setErrorMsg(`sorry!! ${totalRows[index].number} questions not found`)
    //             setTimeout(() => {
    //               setError(false)
    //               setErrorMsg('')
    //             }, 1000)
    //             start = false
    //           }
    //         }
    //       } else {
    //         newArray.push(
    //           filteredQuestionBackup
    //             .filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //             .slice(0, row.number),
    //         )
    //       }
    //     }
    //   })
    //   let finalArray = []
    //   await newArray.map(async (arr, idx) => {
    //     await arr.map((a, idx) => {
    //       if (!finalArray.find((o) => o._id == a._id)) finalArray.push(a)
    //     })
    //   })

    //   // add all questions in saveQuestionArray
    //   // so that all questions will save on quiz end
    //   // either user attempted those questions or not
    //   if (finalArray.length > 0) {
    //     // finalArray.length = totalQuest
    //     let quizArray = []
    //     await totalRows.map((row) => {
    //       if (
    //         finalArray.filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //           .length > row.number
    //       ) {
    //         quizArray.push(
    //           finalArray
    //             .filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category)
    //             .slice(0, row.number),
    //         )
    //       } else {
    //         quizArray.push(
    //           finalArray.filter((ques) => ques.usmleStep == row.step && ques.USMLE == row.category),
    //         )
    //       }
    //     })
    //     let quesArray = []
    //     await quizArray.map(async (arr, idx) => {
    //       await arr.map((a, idx) => {
    //         if (!quesArray.find((o) => o._id == a._id)) quesArray.push(a)
    //       })
    //     })

    //     let allFilteredIds = quesArray.map(({ _id }) => _id)
    //     const partialQuestionDetails = allFilteredIds.reduce((res, item) => {
    //       res.push({ questionId: item, selectedOption: '' })
    //       return res
    //     }, [])
    //     setSaveQuestionArray(partialQuestionDetails)
    //     setFilteredQuestion(quesArray)
    //     setTotalQuest(quesArray.length)
    //     // console.log('final array', finalArray, 'new Array', quesArray)
    //   } else {
    //     start = false
    //   }
    //   // setDisableExam(false)
    //   if (start == true) {
    //     setShowQues(true)
    //     setShowSelectors(false)
    //   }
    // }
  }

  // remove all attempted questions
  const getDifference = (array1, array2) => {
    const diffFromA1toA2 = array1.filter(
      // (obj1) => !array2.some((obj2) => obj1._id === obj2.question._id),
      (obj1) =>
        !array2.some(
          (obj2) => obj1 && obj1._id && obj2 && obj2.question && obj2.question._id === obj1._id,
        ),
    )

    return diffFromA1toA2
  }

  const filterAttemptedQuestions = (toFilter, index) => {
    if (toFilter == 'preventAll') {
      totalRows[index].preventAll = !totalRows[index].preventAll
    }
    if (toFilter == 'preventIncorrect') {
      totalRows[index].preventIncorrect = !totalRows[index].preventIncorrect
    }
    if (toFilter == 'preventCorrect') {
      totalRows[index].preventCorrect = !totalRows[index].preventCorrect
    }
  }

  // const setQues = (value, index) => {
  //   const list = [...totalRows]
  //   list[index].number = value //set number value
  //   setTotalRows(list)
  //   setTotalQuest(calculateSum(totalRows, 'number')) // calculate total number of questions from all rows
  // }
  const handlePreventAll = (index) => {
    const list = [...totalRows]
    list[index].preventAll = !list[index].preventAll
    setTotalRows(list)
  }
  const handlePreventCorrect = (index) => {
    const list = [...totalRows]
    list[index].preventCorrect = !list[index].preventCorrect
    setTotalRows(list)
  }
  const handlePreventIncorrect = (index) => {
    const list = [...totalRows]
    list[index].preventIncorrect = !list[index].preventIncorrect
    setTotalRows(list)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div>
      <QuizHeader
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        showQues={showQues}
        totalQues={totalQuest}
        filteredArray={filteredQuestion}
        fontSize={fontSize}
        setFontSize={setFontSize}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        markedQuestions={markedQuestions}
        setMarkedQuestions={setMarkedQuestions}
        isTimer={isTimer}
        setIsTimer={setIsTimer}
        undoHighlight={undoHighlight}
        highlightStack={highlightStack}
      />
      {/* {showQues && (
        <button
          className="sidebar-toggle-btn absolute z-50 ml-5 text-[25px] px-1 py-1  bg-[#212631] rounded-r-lg shadow-black shadow-lg"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? '' : <GoChevronRight className="text-[40px] text-white" />}
        </button>
      )} */}
      <div className="flex flex-row ">
        {/* {/ Side Bar /} */}

        {showQues && (
          <div className="relative">
            <div
              className={` ${sidebarOpen ? 'md:w-20 w-12' : 'w-5'} bg-[#212631]  sm:static sidebar-wrapper shadow-xl shadow-black overflow-auto overflow-x-hidden transition-width duration-300 ease-in-out`}
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #2C313D' }}
            >
              {/* {sidebarOpen && (
                <button
                  className={`pb-4 text-[20px] px-3 ml-8 bg- text-center ${sidebarOpen ? '' : 'hidden'}`}
                  onClick={toggleSidebar}
                >
                  <GoChevronRight className="text-[40px] rotate-180" />
                </button>
              )} */}
              <ul className={`${sidebarOpen ? 'block' : 'hidden'} pt-5`}>
                {saveQuestionArray.map((question, index) => (
                  <li
                    key={index}
                    className={`text-white font-semibold text-center py-2 cursor-pointer border-b border-gray-400 focus:bg-[#6261CC] hover:bg-[#12151b] transition-all duration-150 ${
                      currentQuestion === index ? 'bg-[#6261CC]' : ''
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    <div className="flex items-center justify-center relative">
                      <span>{index + 1}</span>
                      {markedQuestions.includes(index) && (
                        <img src={markIcon} alt="mark icon" className="w-6 h-6" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {sidebarOpen && currentQuestion !== null && (
                <div
                  className="fixed top-[10vh]  right-0 bg-gray-800 text-white p-2 rounded"
                  style={{ transform: 'translateX(100%)' }}
                >
                  {currentQuestion + 1}
                </div>
              )}
            </div>
            {/* {/ Close button outside sidebar /} */}
            {/* {sidebarOpen && (
              <button
                className="absolute -top-5 left-[100%] text-[25px] px-1 py-1 mt-4  mr-4 text-white bg-[#212631] rounded-r-lg shadow-black shadow-lg"
                onClick={toggleSidebar}
              >
                <GoChevronRight className="text-[40px] rotate-180 text-white" />
              </button>
            )} */}
          </div>
        )}
        {showQues && (
          <button
            className="sidebar-toggle-btn z-50 h-10 sm:h-12 text-[25px] -ml-1 px-2  bg-[#212631] rounded-r-lg shadow-black shadow-lg"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <GoChevronRight className="text-[30px] sm:text-[40px] rotate-180 text-white" />
            ) : (
              <GoChevronRight className="text-[30px] sm:text-[40px] text-white" />
            )}
          </button>
        )}

        <div className="flex flex-col  quiz-wrapper  wrapper">
          {/* new layout */}
          {loader ? (
            <div>
              <div className="flex flex-col gap-10 items-center mt-[35vh] mx-[25%]">
                <div className="lds-spinner -ml-8">
                  {[...Array(12)].map((_, index) => (
                    <div key={index}></div>
                  ))}
                </div>
                {/* <div className="text-sm font-medium text-gray-500 mt-2">
                  <span className="text-[#6261CC]">{progress}%</span> Completed, Please wait while
                  it get`s completed...
                </div>
                <CProgress color="primary" value={progress} className="my-3 w-full"></CProgress> */}
              </div>
            </div>
          ) : (
            <>
              {/* {allQuestion && allQuestion.length > 0 ? ( */}
              <>
                {showSelectors ? (
                  <div className="mt-10">
                    {/* <CForm
              onSubmit={handleSubmit(setQues)}
              className="flex justify-center items-center flex-col"
            > */}
                    <p className="text-4xl font-bold text-center mb-10">
                      Create Your Own Quiz with Zap70
                    </p>

                    <div className="selector-margin-1 flex flex-col justify-center items-start">
                      {totalRows.map((row, id) => (
                        <div
                          className={`selector-margin-2 mb-3 ${id === totalRows.length - 1 ? 'w-[95%] lg:w-[87.1%]' : 'w-[95%] lg:w-[85%]'} flex justify-center items-center`}
                          key={id}
                        >
                          <CRow
                            key={id}
                            className="bg-gray-200 rounded-lg relative border-3 w-full flex justify-center items-center border-solid border-gray-400 text-black p-4 mr-0 lg:mr-10"
                          >
                            <CCol xs={12} md={3} lg={3} className="mb-3 lg:mb-0">
                              <CFormSelect
                                aria-label="Select Exam"
                                className="w-full"
                                name="step"
                                options={[
                                  'Select your Exam',
                                  {
                                    label: `USMLE: Step1 (${step1Questions} questions available)`,
                                    value: '1',
                                    disabled: step1Questions > 0 ? false : true,
                                  },
                                  {
                                    label: `USMLE: Step2 (${step2Questions} questions available)`,
                                    value: '2',
                                    disabled: step2Questions > 0 ? false : true,
                                  },
                                  {
                                    label: `USMLE: Step3 (${step3Questions} questions available)`,
                                    value: '3',
                                    disabled: step3Questions > 0 ? false : true,
                                  },
                                ]}
                                // onChange={(e) => {
                                //   fetchQuestion(e.target.value, '', id)
                                // }}
                                onChange={(e) => {
                                  setTotalRows(
                                    totalRows.map((item, idx) =>
                                      idx === id ? { ...item, step: e.target.value } : item,
                                    ),
                                  )
                                }}
                                defaultValue={row.step}
                                value={row.step}
                              />
                            </CCol>
                            <CCol xs={12} md={3} lg={3} className="mb-3 lg:mb-0">
                              <CFormSelect
                                aria-label="Select Category"
                                className="w-full"
                                name="category"
                                // onChange={(e) => setCategory(e.target.value, id)}
                                defaultValue={row.category}
                                value={row.category}
                                onChange={(e) => {
                                  setTotalRows(
                                    totalRows.map((item, idx) =>
                                      idx === id ? { ...item, category: e.target.value } : item,
                                    ),
                                  )
                                }}
                                // onChange={(e) => fetchQuestion(row.step, e.target.value, id)}
                              >
                                <option>Select your Category</option>
                                {totalRows[id].step == '1' ? (
                                  step1Categories.map((category, idx) => (
                                    <option
                                      key={idx}
                                      value={category}
                                      disabled={
                                        step1QuestionsCate.filter((cate) => cate.name == category)
                                          .length > 0
                                          ? false
                                          : true
                                      }
                                    >
                                      {category} (
                                      {step1QuestionsCate.filter((cate) => cate.name == category)
                                        .length > 0
                                        ? step1QuestionsCate.filter(
                                            (cate) => cate.name == category,
                                          )[0].count
                                        : 0}{' '}
                                      Questions available)
                                    </option>
                                  ))
                                ) : totalRows[id].step == '2' ? (
                                  step2Categories.map((category, idx) => (
                                    <option
                                      key={idx}
                                      value={category}
                                      disabled={
                                        step2QuestionsCate.filter((cate) => cate.name == category)
                                          .length > 0
                                          ? false
                                          : true
                                      }
                                    >
                                      {category} (
                                      {step2QuestionsCate.filter((cate) => cate.name == category)
                                        .length > 0
                                        ? step2QuestionsCate.filter(
                                            (cate) => cate.name == category,
                                          )[0].count
                                        : 0}{' '}
                                      Questions available)
                                    </option>
                                  ))
                                ) : totalRows[id].step == '3' ? (
                                  step3Categories.map((category, idx) => (
                                    <option
                                      key={idx}
                                      value={category}
                                      disabled={
                                        step3QuestionsCate.filter((cate) => cate.name == category)
                                          .length > 0
                                          ? false
                                          : true
                                      }
                                    >
                                      {category} (
                                      {step3QuestionsCate.filter((cate) => cate.name == category)
                                        .length > 0
                                        ? step3QuestionsCate.filter(
                                            (cate) => cate.name == category,
                                          )[0].count
                                        : 0}{' '}
                                      Questions available)
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>Select Your exam first</option>
                                )}
                              </CFormSelect>
                            </CCol>
                            <CCol xs={12} md={3} lg={3} className="mb-3 lg:mb-0">
                              <CFormInput
                                type="number"
                                name="number"
                                placeholder="Number of questions"
                                // {...register('total', { required: true, min: 1, max: 100 })}
                                // feedback="Please enter number between 1 and 100"
                                // invalid={errors.total ? true : false}
                                className="w-full placeholder:text-[#252b36]"
                                value={row.number}
                                // onChange={(e) => handleNumberChange(e, id)}
                                // onChange={(e)=>row.number = e.target.value}
                                // value={totalQuest}
                                onChange={(e) => setQues(e.target.value, id)}
                              />
                            </CCol>
                            <CCol xs={12} md={3} lg={3} className="flex flex-col mb-3 lg:mb-0">
                              <CFormSwitch
                                size="xl"
                                label="Correct Attempted Questions"
                                id="preventAttemptedCorrect"
                                className="text-sm"
                                // onChange={() => handlePreventCorrect(id)}
                                // defaultChecked={row.preventCorrect ? true : false}
                                // value={row.preventCorrect}
                                // checked={row.preventCorrect ? true : false}
                              />
                              <CFormSwitch
                                size="xl"
                                label="Incorrect Attempted Questions"
                                id="preventAttemptedIncorrect"
                                className="text-sm"
                                // onChange={() => handlePreventIncorrect(id)}
                                // defaultChecked={row.preventIncorrect ? true : false}
                                // value={row.preventIncorrect}
                                // checked={row.preventIncorrect ? true : false}
                              />
                              <CFormSwitch
                                size="xl"
                                label="All Attempted Questions"
                                id="preventAttemptedAll"
                                className="text-sm"
                                // onChange={() => (row.preventAll = !row.preventAll)}
                                // onChange={() => filterAttemptedQuestions('preventAll', id)}
                                onChange={() => handlePreventAll(id)}
                                defaultChecked={row.preventAll ? true : false}
                                value={row.preventAll}
                                checked={row.preventAll ? true : false}
                              />
                            </CCol>
                            {totalRows.length > 1 && (
                              <button
                                className="w-9 h-9 text-xl flex justify-center items-center absolute right-0 top-0 z-10"
                                onClick={() => removeRow(id)}
                              >
                                <span>
                                  <RiCloseLine />
                                </span>
                              </button>
                              // <CButton
                              //   className="w-9 h-9 p-3 text-white text-xl flex justify-center items-center mr-2 absolute right-0 top-0 z-10 rounded-full"
                              //   // className="w-9 h-9 p-3 text-white text-xl flex justify-center items-center mr-2 absolute -right-5 -top-5 z-10 rounded-full"
                              //   onClick={() => removeRow(id)}
                              //   color="secondary"
                              // >
                              //   <span>
                              //     <RiCloseLine />
                              //   </span>
                              // </CButton>
                            )}
                          </CRow>
                          {/* {totalRows.length > 1 && (
                              <CButton
                                className="w-9 h-9 p-3 text-2xl flex justify-center items-center mr-2"
                                onClick={() => removeRow(id)}
                                color="secondary"
                              >
                                <span className="-mt-1">-</span>
                              </CButton>
                            )} */}
                          {totalRows.length - 1 === id ? (
                            <div className="justify-center items-center hidden lg:flex">
                              <CButton
                                className="w-9 h-9 p-3 text-white  bg-[#6261CC] hover:bg-[#474694] text-2xl flex justify-center items-center"
                                onClick={addRows}
                              >
                                <span className="-mt-1">+</span>
                              </CButton>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center mt-5 mb-20 lg:mb-0">
                      {/* <CButton
                        className="w-10 h-10 mr-3 text-white  bg-[#6261CC] hover:bg-[#474694] text-2xl flex lg:hidden justify-center items-center "
                        onClick={addRows}
                      >
                        <span className="-mt-1">+</span>
                      </CButton> */}
                      <button
                        className={`mr-[10px] mb-0 lg:mb-3 lg:hidden px-3 lg:px-5 py-2 rounded-lg text-xl bg-[#6261CC] transition-all text-white hover:bg-[#464592]`}
                        // type="submit"
                        color="secondary"
                        onClick={addRows}
                        // disabled={disableExam ? true : false}
                      >
                        Add Row
                      </button>
                      <button
                        className={`mx-0 mb-0 lg:mx-auto px-3 lg:px-5 py-2 rounded-lg text-xl bg-[#6261CC] transition-all text-white hover:bg-[#464592]`}
                        // type="submit"
                        color="secondary"
                        onClick={startexam}
                        disabled={examLoader ? true : false}
                      >
                        {examLoader ? <CSpinner color="light" size="sm" /> : 'Start Exam'}
                      </button>
                    </div>
                    {/* </CForm> */}
                  </div>
                ) : (
                  ''
                )}
                {/* Questions */}
                {showQues && (
                  <div
                    className="sm:px-16 px-3 pt-5 ml-[-9%] sm:ml-0"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {filteredQuestion[currentQuestion] &&
                    filteredQuestion[currentQuestion].image ? (
                      <CRow className="mb-7">
                        <CCol md={8}>
                          <p
                            dangerouslySetInnerHTML={createMarkup(
                              filteredQuestion[currentQuestion]
                                ? filteredQuestion[currentQuestion].question
                                : '',
                            )}
                            // dangerouslySetInnerHTML={{
                            //   __html: filteredQuestion[currentQuestion]
                            //     ? filteredQuestion[currentQuestion].question
                            //     : '',
                            // }}
                            ref={questionText}
                            onMouseUp={highlight}
                            onClick={() => console.log('clicked')}
                          ></p>
                        </CCol>

                        <CCol md={4}>
                          {filteredQuestion[currentQuestion]?.image && (
                            <img
                              // src={image}
                              // src={`${API_URL}uploads/${filteredQuestion[currentQuestion].image}`}
                              src={`${API_URL}uploads/images/${filteredQuestion[currentQuestion].image}`}
                              alt="question image"
                              className=" mt-3"
                              loading="eager"
                            />
                          )}
                          {/* {filteredQuestion[currentQuestion]?.video && (
                          <video controls ref={videoRef}>
                            {filteredQuestion[currentQuestion]?.video && (
                              <source
                                src={`${API_URL}uploads/videos/${filteredQuestion[currentQuestion].video}`}
                                type="video/mp4"
                              />
                            )}
                          </video>
                        )} */}
                        </CCol>
                      </CRow>
                    ) : (
                      <CRow className="">
                        <CCol md={12}>
                          <p
                            dangerouslySetInnerHTML={createMarkup(
                              filteredQuestion[currentQuestion]
                                ? filteredQuestion[currentQuestion].question
                                : '',
                            )}
                            // dangerouslySetInnerHTML={{
                            //   __html: filteredQuestion[currentQuestion]
                            //     ? filteredQuestion[currentQuestion].question
                            //     : '',
                            // }}
                            onMouseUp={highlight}
                            ref={questionText}
                            onClick={() => console.log('clicked')}
                          ></p>
                        </CCol>
                      </CRow>
                    )}
                    <CForm onSubmit={(e) => handleNextQuestion(e)}>
                      {/* <CForm onSubmit={(e) => handleFormSubmit(e, filteredQuestion[currentQuestion]._id)}> */}
                      <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 min-w-64 w-fit">
                        {filteredQuestion[currentQuestion] ? (
                          <>
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionOne}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionOne}
                                // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                onChange={(e) => {
                                  handleFormSubmit(
                                    e,
                                    filteredQuestion[currentQuestion]._id,
                                    filteredQuestion[currentQuestion].optionOne,
                                  )
                                  setSelectedOption(e.currentTarget.id)
                                }}
                                className="form-check-input"
                                checked={
                                  saveQuestionArray.filter(
                                    (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                  ).length > 0
                                    ? filteredQuestion[currentQuestion].optionOne ==
                                      saveQuestionArray.filter(
                                        (q) =>
                                          q.questionId == filteredQuestion[currentQuestion]._id,
                                      )[0].selectedOption
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${opt1Marked ? 'line-through' : ''}`}
                                onClick={() => setOpt1Marked((prevCheck) => !prevCheck)}
                              >
                                A. {filteredQuestion[currentQuestion].optionOne}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionTwo}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionTwo}
                                // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                onChange={(e) => {
                                  handleFormSubmit(
                                    e,
                                    filteredQuestion[currentQuestion]._id,
                                    filteredQuestion[currentQuestion].optionTwo,
                                  )
                                  setSelectedOption(e.currentTarget.id)
                                }}
                                className="form-check-input"
                                checked={
                                  saveQuestionArray.filter(
                                    (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                  ).length > 0
                                    ? filteredQuestion[currentQuestion].optionTwo ==
                                      saveQuestionArray.filter(
                                        (q) =>
                                          q.questionId == filteredQuestion[currentQuestion]._id,
                                      )[0].selectedOption
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${opt2Marked ? 'line-through' : ''}`}
                                onClick={() => setOpt2Marked((prevCheck) => !prevCheck)}
                              >
                                B. {filteredQuestion[currentQuestion].optionTwo}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionThree}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionThree}
                                // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                onChange={(e) => {
                                  handleFormSubmit(
                                    e,
                                    filteredQuestion[currentQuestion]._id,
                                    filteredQuestion[currentQuestion].optionThree,
                                  )
                                  setSelectedOption(e.currentTarget.id)
                                }}
                                className="form-check-input"
                                checked={
                                  saveQuestionArray.filter(
                                    (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                  ).length > 0
                                    ? filteredQuestion[currentQuestion].optionThree ==
                                      saveQuestionArray.filter(
                                        (q) =>
                                          q.questionId == filteredQuestion[currentQuestion]._id,
                                      )[0].selectedOption
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${opt3Marked ? 'line-through' : ''}`}
                                onClick={() => setOpt3Marked((prevCheck) => !prevCheck)}
                              >
                                C. {filteredQuestion[currentQuestion].optionThree}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionFour}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionFour}
                                // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                onChange={(e) => {
                                  handleFormSubmit(
                                    e,
                                    filteredQuestion[currentQuestion]._id,
                                    filteredQuestion[currentQuestion].optionFour,
                                  )
                                  setSelectedOption(e.currentTarget.id)
                                }}
                                className="form-check-input"
                                checked={
                                  saveQuestionArray.filter(
                                    (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                  ).length > 0
                                    ? filteredQuestion[currentQuestion].optionFour ==
                                      saveQuestionArray.filter(
                                        (q) =>
                                          q.questionId == filteredQuestion[currentQuestion]._id,
                                      )[0].selectedOption
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${opt4Marked ? 'line-through' : ''}`}
                                onClick={() => setOpt4Marked((prevCheck) => !prevCheck)}
                              >
                                D. {filteredQuestion[currentQuestion].optionFour}
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionFive}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionFive}
                                // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                onChange={(e) => {
                                  handleFormSubmit(
                                    e,
                                    filteredQuestion[currentQuestion]._id,
                                    filteredQuestion[currentQuestion].optionFive,
                                  )
                                  setSelectedOption(e.currentTarget.id)
                                }}
                                className="form-check-input"
                                checked={
                                  saveQuestionArray.filter(
                                    (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                  ).length > 0
                                    ? filteredQuestion[currentQuestion].optionFive ==
                                      saveQuestionArray.filter(
                                        (q) =>
                                          q.questionId == filteredQuestion[currentQuestion]._id,
                                      )[0].selectedOption
                                      ? true
                                      : false
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${opt5Marked ? 'line-through' : ''}`}
                                onClick={() => setOpt5Marked((prevCheck) => !prevCheck)}
                              >
                                E. {filteredQuestion[currentQuestion].optionFive}
                              </label>
                            </div>
                            {filteredQuestion[currentQuestion].optionSix ? (
                              <div className="form-check">
                                <input
                                  type="radio"
                                  id={filteredQuestion[currentQuestion].optionSix}
                                  name={currentQuestion}
                                  value={filteredQuestion[currentQuestion].optionSix}
                                  // onChange={(e) => setSelectedOption(e.currentTarget.id)}
                                  onChange={(e) => {
                                    handleFormSubmit(
                                      e,
                                      filteredQuestion[currentQuestion]._id,
                                      filteredQuestion[currentQuestion].optionSix,
                                    )
                                    setSelectedOption(e.currentTarget.id)
                                  }}
                                  className="form-check-input"
                                  checked={
                                    saveQuestionArray.filter(
                                      (q) => q.questionId == filteredQuestion[currentQuestion]._id,
                                    ).length > 0
                                      ? filteredQuestion[currentQuestion].optionSix ==
                                        saveQuestionArray.filter(
                                          (q) =>
                                            q.questionId == filteredQuestion[currentQuestion]._id,
                                        )[0].selectedOption
                                        ? true
                                        : false
                                      : false
                                  }
                                />
                                <label
                                  className={`form-check-label ml-2 ${opt6Marked ? 'line-through' : ''}`}
                                  onClick={() => setOpt6Marked((prevCheck) => !prevCheck)}
                                >
                                  F. {filteredQuestion[currentQuestion].optionSix}
                                </label>
                              </div>
                            ) : (
                              ''
                            )}
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                      <CButton color="primary" className="mx-auto px-5 rounded-full" type="submit">
                        {currentQuestion + 1 != totalQuest ? 'Next' : 'Submit'}
                      </CButton>
                    </CForm>
                  </div>
                )}
              </>
              {/* ) : (
                <CAlert color="danger" className="middle-alert">
                  No questions added yet
                </CAlert>
              )} */}
            </>
          )}
        </div>
      </div>
      {/* {showQues && (
          <div className="fixed bottom-20 right-6 z-20">
            <CButton
              color="primary"
              className="flex justify-center items-center text-white font-bold py-2 px-4 rounded-full shadow-lg"
              onClick={() => setDetailModal(true)}
            >
              <RiEyeLine className="mr-2" />
              View
            </CButton>
          </div>
        )} */}
      <QuizFooter
        showQues={showQues}
        totalQues={totalQuest}
        score={quizScore}
        saveQuestionArray={saveQuestionArray}
        isTimer={isTimer}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        timeInSeconds={0}
      />
      {/* error alert */}
      {error && (
        <CAlert color="danger" className="middle-alert">
          {errorMsg}
        </CAlert>
      )}
      {/* quiz detail modal */}
      <CModal
        alignment="center"
        visible={detailModal}
        backdrop="static"
        onClose={() => {
          setDetailModal(false)
        }}
        aria-labelledby="VerticallyCenteredExample"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Question Details</CModalTitle>
        </CModalHeader>
        {filteredQuestion[currentQuestion] && (
          <CModalBody>
            <CRow className="mb-2 flex flex-col">
              <strong className="mb-2">Question</strong>
              <span
                dangerouslySetInnerHTML={createMarkup(filteredQuestion[currentQuestion].question)}
                onClick={() => console.log('clicked')}
                // dangerouslySetInnerHTML={{
                //   __html: filteredQuestion[currentQuestion].question,
                // }}
              />
              {/* <span>{filteredQuestion[currentQuestion].question}</span> */}
            </CRow>
            <CRow className="mb-2 flex flex-col">
              <strong className="mb-2">Question explanation</strong>
              <span
                dangerouslySetInnerHTML={createMarkup(
                  filteredQuestion[currentQuestion].questionExplanation,
                )}
                onClick={() => console.log('clicked')}
                // dangerouslySetInnerHTML={{
                //   __html: filteredQuestion[currentQuestion].questionExplanation,
                // }}
              />
              {/* <span>{filteredQuestion[currentQuestion].questionExplanation}</span> */}
            </CRow>
            <CRow className="mb-2 flex flex-col">
              <strong className="mb-2">Options</strong>
              <span className="mb-2">
                <span className="font-bold">A</span> {filteredQuestion[currentQuestion].optionOne}
                <span className="italic">
                  &nbsp;({filteredQuestion[currentQuestion].optionOneExplanation})
                </span>
              </span>
              <span className="mb-2">
                <span className="font-bold">B</span> {filteredQuestion[currentQuestion].optionTwo}
                <span className="italic">
                  &nbsp;({filteredQuestion[currentQuestion].optionTwoExplanation})
                </span>
              </span>
              <span className="mb-2">
                <span className="font-bold">C</span> {filteredQuestion[currentQuestion].optionThree}
                <span className="italic">
                  &nbsp;({filteredQuestion[currentQuestion].optionThreeExplanation})
                </span>
              </span>
              <span className="mb-2">
                <span className="font-bold">D</span> {filteredQuestion[currentQuestion].optionFour}
                <span className="italic">
                  &nbsp;({filteredQuestion[currentQuestion].optionFourExplanation})
                </span>
              </span>
              <span className="mb-2">
                <span className="font-bold">E</span> {filteredQuestion[currentQuestion].optionFive}
                <span className="italic">
                  &nbsp;({filteredQuestion[currentQuestion].optionFiveExplanation})
                </span>
              </span>
              {filteredQuestion[currentQuestion].optionSix && (
                <span className="mb-2">
                  <span className="font-bold">F</span> {filteredQuestion[currentQuestion].optionSix}
                  {filteredQuestion[currentQuestion].optionSixExplanation && (
                    <span className="italic">
                      &nbsp;({filteredQuestion[currentQuestion].optionSixExplanation})
                    </span>
                  )}
                </span>
              )}
            </CRow>
            {filteredQuestion[currentQuestion].image && (
              <CRow>
                <CCol md={2}>
                  <strong>Image</strong>
                </CCol>
                <CCol md={10}>
                  <img
                    src={`${API_URL}uploads/${filteredQuestion[currentQuestion].image}`}
                    alt="image"
                    className="w-52 h-36 rounded-full"
                    loading="eager"
                  />
                </CCol>
              </CRow>
            )}
          </CModalBody>
        )}
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
    </div>
  )
}

export default QuizLayout
