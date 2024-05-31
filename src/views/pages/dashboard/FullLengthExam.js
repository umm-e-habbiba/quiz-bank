import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
  CRow,
  CCol,
  CForm,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import markIcon from '../../../assets/images/mark-icon.svg'
const FullLengthExam = () => {
  const navigate = useNavigate()
  const [allExam, setAllExam] = useState([])
  const [detailModal, setDetailModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [fontSize, setFontSize] = useState(16)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showExamList, setShowExamList] = useState(true)
  const [showQues, setShowQues] = useState(false)
  const [totalQuest, setTotalQuest] = useState('')
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [highlightStack, setHighlightStack] = useState([])
  const [quizScore, setQuizScore] = useState(0)
  const [saveQuestionArray, setSaveQuestionArray] = useState([])
  const [quizEnd, setQuizEnd] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [opt1Marked, setOpt1Marked] = useState(false)
  const [opt2Marked, setOpt2Marked] = useState(false)
  const [opt3Marked, setOpt3Marked] = useState(false)
  const [opt4Marked, setOpt4Marked] = useState(false)
  const [opt5Marked, setOpt5Marked] = useState(false)
  const [opt6Marked, setOpt6Marked] = useState(false)
  const questionText = useRef()
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
      getAllExams()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    getExam()
  }, [examId])
  useEffect(() => {
    if (quizEnd) {
      navigate('/quiz-performance')
      saveExam()
    }
  }, [quizEnd])

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
  const getExam = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'uploaded-test/' + examId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log('ques detail', result)
        if (result.data) {
          console.log('getExam', result)
          setShowQues(true)
          setShowExamList(false)
          setFilteredQuestion(result.data.questions)
          setTotalQuest(result.data.questions?.length)
          let allFilteredIds = result.data.questions.map(({ _id }) => _id)
          const partialQuestionDetails = allFilteredIds.reduce((res, item) => {
            res.push({ questionId: item, selectedOption: '' })
            return res
          }, [])
          setSaveQuestionArray(partialQuestionDetails)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
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
  const handleNextQuestion = (e) => {
    e.preventDefault()
    if (currentQuestion + 1 < totalQuest) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizEnd(true)
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
    // saveExam(id)
  }

  const checkAnswer = (value) => {
    if (value == filteredQuestion[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }
  const createMarkup = (value) => {
    return { __html: value }
  }
  const saveExam = () => {
    // console.log('user id', userID, 'selected option', selectedOption)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      userId: userID,
      testId: examId,
      totalMarks: totalQuest,
      obtainedMarks: quizScore,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'save-test-attempt', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setSelectedOption('')
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <div className="">
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
        isTimer={true}
        // setIsTimer={setIsTimer}
        undoHighlight={undoHighlight}
        highlightStack={highlightStack}
      />
      <div className="flex flex-row ">
        {showQues && (
          <div className="relative">
            <div
              className={` ${sidebarOpen ? 'w-20' : 'w-5'} bg-[#212631] absolute sm:static sidebar-wrapper shadow-xl shadow-black overflow-auto overflow-x-hidden transition-width duration-300 ease-in-out`}
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
            className="sidebar-toggle-btn  h-12 text-[25px] -ml-1 px-2  bg-[#212631] rounded-r-lg shadow-black shadow-lg"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <GoChevronLeft className="text-[40px] rotate-180 text-white" />
            ) : (
              <GoChevronRight className="text-[40px] text-white" />
            )}
          </button>
        )}
        <div className="flex flex-col quiz-wrapper overflow-y-auto wrapper overflow-x-hidden">
          {loader ? (
            <div className="text-center">
              <CSpinner color="success" variant="grow" />
            </div>
          ) : (
            <>
              {showExamList && (
                <div className={`mx-40 mb-5 flex flex-col justify-center items-center  mt-10`}>
                  {allExam && allExam.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-screen px-10 md:px-20 lg:px-20 xl:px-40  py-20 ">
                      {allExam.map((row, id) => (
                        <CRow
                          key={id}
                          className="dark:bg-gray-700 bg-gray-200 shadow-xl dark:text-white shadow-black rounded-lg mb-5 relative  flex flex-col gap-2 text-black p-3 "
                        >
                          <CCol xs={1} md={3} lg={3} className=" w-full pt-2">
                            <span className="text-4xl font-semibold">{row.testName}</span>
                          </CCol>
                          <CCol xs={1} md={3} lg={3} className="flex flex-row w-full gap-1 text-xl">
                            <span>USMLE Step</span>
                            <span>{row.usmleStep}</span>
                          </CCol>
                          <CCol
                            xs={1}
                            md={3}
                            lg={3}
                            className=" w-full gap-1 text-md whitespace-normal"
                          >
                            <span>{row.testDescription}</span>
                          </CCol>
                          <CCol xs={1} md={3} lg={3} className=" font-medium">
                            <span>{row.questions?.length} Questions </span>
                          </CCol>
                          <CCol xs={1} md={3} lg={3} className="w-full mt-2">
                            <button
                              className={`mx-auto px-5 py-2 w-full rounded-lg text-xl bg-[#6261CC] transition-all text-white hover:bg-[#464592]`}
                              color="secondary"
                              id={row._id}
                              onClick={(e) => {
                                setExamId(e.currentTarget.id)
                              }}
                            >
                              Start Exam
                            </button>
                          </CCol>
                        </CRow>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              )}
              {showQues && (
                <div className="px-16 pt-5" style={{ fontSize: `${fontSize}px` }}>
                  {filteredQuestion[currentQuestion] && filteredQuestion[currentQuestion].image ? (
                    <CRow className="mb-5">
                      <CCol md={8}>
                        <p
                          dangerouslySetInnerHTML={createMarkup(
                            filteredQuestion[currentQuestion]
                              ? filteredQuestion[currentQuestion].question
                              : '',
                          )}
                          ref={questionText}
                          onMouseUp={highlight}
                          onClick={() => console.log('clicked')}
                        ></p>
                      </CCol>
                      <CCol md={4}>
                        {filteredQuestion[currentQuestion]?.image && (
                          <img
                            src={`${API_URL}uploads/testimages/${filteredQuestion[currentQuestion].image}`}
                            alt="question image"
                            className="mb-3"
                            loading="eager"
                          />
                        )}
                      </CCol>
                    </CRow>
                  ) : (
                    <CRow className="mb-5">
                      <CCol md={12}>
                        <p
                          dangerouslySetInnerHTML={createMarkup(
                            filteredQuestion[currentQuestion]
                              ? filteredQuestion[currentQuestion].question
                              : '',
                          )}
                          onMouseUp={highlight}
                          ref={questionText}
                          onClick={() => console.log('clicked')}
                        ></p>
                      </CCol>
                    </CRow>
                  )}
                  <div></div>
                  <CForm onSubmit={(e) => handleNextQuestion(e)}>
                    <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 min-w-64 w-fit">
                      {filteredQuestion[currentQuestion] ? (
                        <>
                          {filteredQuestion[currentQuestion].optionOne && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionOne}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionOne}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt1Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt1Marked((prevCheck) => !prevCheck)}
                              >
                                A. {filteredQuestion[currentQuestion].optionOne}
                              </label>
                            </div>
                          )}
                          {filteredQuestion[currentQuestion].optionTwo && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionTwo}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionTwo}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt2Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt2Marked((prevCheck) => !prevCheck)}
                              >
                                B. {filteredQuestion[currentQuestion].optionTwo}
                              </label>
                            </div>
                          )}
                          {filteredQuestion[currentQuestion].optionThree && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionThree}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionThree}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt3Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt3Marked((prevCheck) => !prevCheck)}
                              >
                                C. {filteredQuestion[currentQuestion].optionThree}
                              </label>
                            </div>
                          )}
                          {filteredQuestion[currentQuestion].optionFour && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionFour}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionFour}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt4Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt4Marked((prevCheck) => !prevCheck)}
                              >
                                D. {filteredQuestion[currentQuestion].optionFour}
                              </label>
                            </div>
                          )}
                          {filteredQuestion[currentQuestion].optionFive && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionFive}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionFive}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt5Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt5Marked((prevCheck) => !prevCheck)}
                              >
                                E. {filteredQuestion[currentQuestion].optionFive}
                              </label>
                            </div>
                          )}
                          {filteredQuestion[currentQuestion].optionSix && (
                            <div className="form-check">
                              <input
                                type="radio"
                                id={filteredQuestion[currentQuestion].optionSix}
                                name={currentQuestion}
                                value={filteredQuestion[currentQuestion].optionSix}
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
                                    : false
                                }
                              />
                              <label
                                className={`form-check-label ml-2 ${
                                  opt6Marked ? 'line-through' : ''
                                }`}
                                onClick={() => setOpt6Marked((prevCheck) => !prevCheck)}
                              >
                                F. {filteredQuestion[currentQuestion].optionSix}
                              </label>
                            </div>
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
          )}
        </div>
      </div>
      <QuizFooter
        showQues={showQues}
        totalQues={totalQuest}
        score={quizScore}
        saveQuestionArray={saveQuestionArray}
        isTimer={true}
      />
    </div>
  )
}
export default FullLengthExam
