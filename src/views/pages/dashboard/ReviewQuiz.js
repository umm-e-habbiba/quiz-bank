import { CButton, CForm, CFormCheck, CAlert, CRow, CCol, CSpinner } from '@coreui/react'
import React, { useState, useEffect, useRef } from 'react'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { API_URL } from 'src/store'
import ReviewQuizFooter from 'src/components/quiz/ReviewQuizFooter'
// import markIcon from '../../../assets/images/mark-flag.png'
import markIcon from '../../../assets/images/mark-icon.svg'
import { GoChevronRight } from 'react-icons/go'
const ReviewQuiz = () => {
  const navigate = useNavigate()
  let { id } = useParams()
  // let quizId = queryParameters.get('id')
  const [loading, setLoading] = useState(false)
  const [showQues, setShowQues] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizEnd, setQuizEnd] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [markedQuestions, setMarkedQuestions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // console.log('quiz id', id)
    const getToken = localStorage.getItem('token')
    if (getToken) {
      if (id) {
        getQuestWithId(id)
      } else {
        getAllQuest()
      }
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    console.log('all questions array')
  }, [allQuestion])

  useEffect(() => {
    if (quizEnd) {
      navigate('/quiz-performance')
    }
  }, [quizEnd])

  const getAllQuest = () => {
    setLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'latest-quiz/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoading(false)
        if (result.data) {
          setLoading(false)
          setAllQuestion(result.data.questions)
          // console.log(
          //   'all questions ',
          //   result.data.questions,
          //   'current',
          //   allQuestion[currentQuestion],
          // )
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const getQuestWithId = (quizId) => {
    setLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'user-quiz/' + userID + '/' + quizId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoading(false)
        if (result.data) {
          setLoading(false)
          setAllQuestion(result.data.questions)
          // console.log(
          //   'all questions ',
          //   result.data.questions,
          //   'current',
          //   allQuestion[currentQuestion],
          // )
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    handleNextQuestion()
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < allQuestion.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizEnd(true)
    }
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const videoRef = useRef(null)

  useEffect(() => {
    // Whenever the current question changes, update the video source
    if (allQuestion[currentQuestion]?.questionId?.video) {
      const videoSource = `${API_URL}uploads/videos/${allQuestion[currentQuestion].questionId.video}`
      // Update video source
      if (videoRef.current) {
        videoRef.current.src = videoSource
        // You may also want to load the new video after changing the source
        videoRef.current.load()
      }
    }
  }, [currentQuestion, allQuestion])
  return (
    <div>
      <QuizHeader
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        showQues={showQues}
        totalQues={allQuestion.length}
        filteredArray={allQuestion}
        fontSize={fontSize}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        markedQuestions={markedQuestions}
        setMarkedQuestions={setMarkedQuestions}
        setFontSize={setFontSize}
        // isTimer={isTimer}
        // setIsTimer={setIsTimer}
      />
      {/* {showQues && (
        <button
          className="sidebar-toggle-btn absolute z-50 ml-5 text-[25px] px-1 py-1  bg-[#212631] rounded-r-lg shadow-black shadow-lg"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <GoChevronRight className="text-[40px] rotate-180" />
          ) : (
            <GoChevronRight className="text-[40px] " />
          )}
        </button>
      )} */}
      <div className="flex flex-row">
        <div className="relative">
          <div
            className={` ${sidebarOpen ? 'md:w-20 w-12' : 'w-5'} bg-[#212631]  sm:static sidebar-wrapper shadow-xl shadow-black overflow-auto overflow-x-hidden transition-width duration-300 ease-in-out`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #2C313D' }}
          >
            {/* {sidebarOpen && (
            <button
              className={`pb-4 text-[20px] px-4 ml-1 pt-3 text-center ${sidebarOpen ? '' : 'hidden'}`}
              onClick={toggleSidebar}
            >
              <ImCross className="text-white" />
            </button>
          )} */}
            <ul className={`${sidebarOpen ? 'block' : 'hidden'} pt-5 `}>
              {allQuestion && allQuestion.length > 0
                ? allQuestion.map((question, index) => (
                    <li
                      key={index}
                      className={`text-white font-semibold text-center py-2 cursor-pointer border-b border-gray-400 focus:bg-blue-500 hover:bg-[#12151b] transition-all duration-150 ${
                        currentQuestion === index ? 'bg-blue-500' : ''
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
                  ))
                : ''}
            </ul>
            {sidebarOpen && currentQuestion !== null && (
              <div
                className=" top-[10vh] right-0 bg-gray-800 text-white p-2 rounded"
                style={{ transform: 'translateX(100%)' }}
              >
                {currentQuestion + 1}
              </div>
            )}
            {/* {sidebarOpen && (
              <button
                className="absolute -top-5 left-[150%] text-[25px] px-1 py-1 mt-4  mr-4 text-white bg-[#212631] rounded-r-lg shadow-black shadow-lg"
                onClick={toggleSidebar}
              >
                <GoChevronRight className="text-[40px] rotate-180" />
              </button>
            )} */}
          </div>
          {/* {sidebarOpen && (
            <button
              className="static -top-6 left-[98%] text-[25px] px-1 py-1 mt-4 z-50 mr-4 text-white bg-[#212631] rounded-r-lg shadow-black shadow-lg"
              onClick={toggleSidebar}
            >
              <GoChevronRight className="text-[40px] rotate-180" />
            </button>
          )} */}
        </div>
        {showQues && (
          <button
            className="sidebar-toggle-btn h-10 z-50 sm:h-12 text-[25px] -ml-1 px-2  bg-[#212631] rounded-r-lg shadow-black shadow-lg"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <GoChevronRight className="text-[30px] sm:text-[40px] rotate-180 text-white" />
            ) : (
              <GoChevronRight className="text-[30px] sm:text-[40px] text-white" />
            )}
          </button>
        )}

        <div className="wrapper relative p-4 d-flex ml-[-9%] sm:ml-0 flex-column quiz-wrapper overflow-x-hidden overflow-y-auto">
          {loading ? (
            <center>
              <CSpinner color="info" variant="grow" />
            </center>
          ) : (
            <>
              <Link to="/previous-tests" className="fixed right-5 top-20 z-10">
                <CButton color="danger">End Review</CButton>
              </Link>
              {/* Questions */}
              {allQuestion[currentQuestion] && allQuestion[currentQuestion].questionId ? (
                <CRow>
                  <CCol md={6} className="sm:border-r-2 border-b-2 sm:border-b-0 border-solid">
                    <div className="p-4 lg:p-10" style={{ fontSize: `${fontSize}px` }}>
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.image ? (
                        <div className="mb-5">
                          <p className="mb-1 text-2xl font-bold">Question</p>
                          <p
                            className="mb-3 mt-4"
                            dangerouslySetInnerHTML={{
                              __html: allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.question
                                : '',
                            }}
                          >
                            {/* {allQuestion[currentQuestion]
                      ? allQuestion[currentQuestion].questionId.question
                      : ''} */}
                          </p>
                          {allQuestion[currentQuestion].questionId.image && (
                            <div>
                              <img
                                src={`${API_URL}uploads/images/${allQuestion[currentQuestion].questionId.image}`}
                                alt="question image"
                                className=""
                                loading="eager"
                              />
                              {/* <img
                                src={`${API_URL}uploads/images/${allQuestion[currentQuestion].questionId.imageTwo}`}
                                alt="question image"
                                className="mb-3"
                              /> */}
                            </div>
                          )}
                          {/* {allQuestion[currentQuestion].questionId.video && (
                            <video controls>
                              {allQuestion[currentQuestion].questionId.video && (
                                <source
                                  src={`${API_URL}uploads/videos/${allQuestion[currentQuestion].questionId.video}`}
                                  type="video/mp4"
                                />
                              )}
                            </video>
                          )} */}
                        </div>
                      ) : (
                        <p
                          className="mb-5"
                          dangerouslySetInnerHTML={{
                            __html: allQuestion[currentQuestion]
                              ? allQuestion[currentQuestion].questionId.question
                              : '',
                          }}
                        >
                          {/* {allQuestion[currentQuestion]
                    ? allQuestion[currentQuestion].questionId.question
                    : ''} */}
                        </p>
                      )}
                      <CForm className="-mt-8 ms:mt-0" onSubmit={handleFormSubmit}>
                        <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 lg:mb-5 min-w-64 w-fit">
                          <CFormCheck
                            type="radio"
                            id={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionOne
                                : ''
                            }
                            label={
                              allQuestion[currentQuestion]
                                ? 'A. ' + allQuestion[currentQuestion].questionId.optionOne
                                : ''
                            }
                            value={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionOne
                                : ''
                            }
                            name={currentQuestion}
                            disabled={true}
                            checked={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].selectedOption ==
                                  allQuestion[currentQuestion].questionId.optionOne
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <CFormCheck
                            type="radio"
                            id={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionTwo
                                : ''
                            }
                            label={
                              allQuestion[currentQuestion]
                                ? 'B. ' + allQuestion[currentQuestion].questionId.optionTwo
                                : ''
                            }
                            value={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionTwo
                                : ''
                            }
                            name={currentQuestion}
                            disabled={true}
                            checked={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].selectedOption ==
                                  allQuestion[currentQuestion].questionId.optionTwo
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <CFormCheck
                            type="radio"
                            id={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionThree
                                : ''
                            }
                            label={
                              allQuestion[currentQuestion]
                                ? 'C. ' + allQuestion[currentQuestion].questionId.optionThree
                                : ''
                            }
                            value={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionThree
                                : ''
                            }
                            name={currentQuestion}
                            disabled={true}
                            checked={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].selectedOption ==
                                  allQuestion[currentQuestion].questionId.optionThree
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <CFormCheck
                            type="radio"
                            id={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionFour
                                : ''
                            }
                            label={
                              allQuestion[currentQuestion]
                                ? 'D. ' + allQuestion[currentQuestion].questionId.optionFour
                                : ''
                            }
                            value={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionFour
                                : ''
                            }
                            name={currentQuestion}
                            disabled={true}
                            checked={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].selectedOption ==
                                  allQuestion[currentQuestion].questionId.optionFour
                                  ? true
                                  : false
                                : false
                            }
                          />
                          <CFormCheck
                            type="radio"
                            id={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionFive
                                : ''
                            }
                            label={
                              allQuestion[currentQuestion]
                                ? 'E. ' + allQuestion[currentQuestion].questionId.optionFive
                                : ''
                            }
                            value={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].questionId.optionFive
                                : ''
                            }
                            name={currentQuestion}
                            disabled={true}
                            checked={
                              allQuestion[currentQuestion]
                                ? allQuestion[currentQuestion].selectedOption ==
                                  allQuestion[currentQuestion].questionId.optionFive
                                  ? true
                                  : false
                                : false
                            }
                          />
                          {allQuestion[currentQuestion] &&
                          allQuestion[currentQuestion].questionId.optionSix ? (
                            <CFormCheck
                              type="radio"
                              id={
                                allQuestion[currentQuestion]
                                  ? allQuestion[currentQuestion].questionId.optionSix
                                  : ''
                              }
                              label={
                                allQuestion[currentQuestion]
                                  ? 'F. ' + allQuestion[currentQuestion].questionId.optionSix
                                  : ''
                              }
                              value={
                                allQuestion[currentQuestion]
                                  ? allQuestion[currentQuestion].questionId.optionSix
                                  : ''
                              }
                              name={currentQuestion}
                              disabled={true}
                              checked={
                                allQuestion[currentQuestion]
                                  ? allQuestion[currentQuestion].selectedOption ==
                                    allQuestion[currentQuestion].questionId.optionSix
                                    ? true
                                    : false
                                  : false
                              }
                            />
                          ) : (
                            ''
                          )}
                        </div>
                        {allQuestion.length > 0 && allQuestion[currentQuestion] ? (
                          <CRow
                            className={`sm:py-2 px-1 ml-[1px] border-l-4 border-solid ${allQuestion[currentQuestion].questionId.correctAnswer == allQuestion[currentQuestion].selectedOption ? 'border-green-600' : 'border-red-600'}  answer-stat-box bg-gray-200`}
                          >
                            <CCol md={12} className="flex justify-start flex-col ">
                              {allQuestion[currentQuestion].questionId.correctAnswer ==
                              allQuestion[currentQuestion].selectedOption ? (
                                <p className="text-green-600">Correct</p>
                              ) : (
                                <>
                                  <p className="text-red-600">Incorrect</p>
                                  <p className="text-xs text-black">Correct answer</p>
                                  <p className="text-black">
                                    {allQuestion[currentQuestion].questionId.correctAnswer}
                                  </p>
                                </>
                              )}
                            </CCol>
                            {/* <CCol md={4} className="flex justify-start items-center">
                    <CIcon icon={cilBarChart} className="stat-icons mr-2" />
                    <div className="flex flex-col justify-start">
                      <p className="text-black mb-0 text-xs">54%</p>
                      <p className="text-xs">Answered correctly</p>
                    </div>
                  </CCol>
                  <CCol md={3} className="flex justify-start items-center">
                    <CIcon icon={cilClock} className="stat-icons mr-2" />
                    <div className="flex flex-col justify-start">
                      <p className="text-black mb-0 text-xs">05 secs</p>
                      <p className="text-xs">Time Spent</p>
                    </div>
                  </CCol> 
                  <CCol md={3} className="flex justify-start items-center">
                    <CIcon icon={cilCalendar} className="stat-icons mr-2" />
                    <div className="flex flex-col justify-start">
                      <p className="text-black mb-0 text-xs">2020</p>
                      <p className="text-xs">Version</p>
                    </div>
                  </CCol>*/}
                          </CRow>
                        ) : (
                          ''
                        )}
                      </CForm>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="p-4 lg:p-10" style={{ fontSize: `${fontSize}px` }}>
                      <p className="mb-1 text-2xl font-bold">Explanation</p>
                      <p
                        className="mb-3 mt-4"
                        dangerouslySetInnerHTML={{
                          __html: allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.questionExplanation.replace(
                                /\(Choice/g,
                                '<br/><br/>• (Option',
                              )
                            : '',
                        }}
                      >
                        {/* {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.questionExplanation
                  : ''} */}
                      </p>
                      {allQuestion[currentQuestion] &&
                        allQuestion[currentQuestion].questionId.video && (
                          <video controls ref={videoRef} className="my-3"></video>
                        )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.imageTwo ? (
                        <img
                          src={`${API_URL}uploads/images/${allQuestion[currentQuestion].questionId.imageTwo}`}
                          alt="question image"
                          className="mb-3"
                          loading="eager"
                        />
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionOneExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option A)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionOneExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionTwoExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option B)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionTwoExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionThreeExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option C)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionThreeExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionFourExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option D)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionFourExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionFiveExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option E)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionFiveExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      {allQuestion[currentQuestion] &&
                      allQuestion[currentQuestion].questionId.optionSixExplanation ? (
                        <p className="mb-3">
                          <span className="">• (Option F)</span>{' '}
                          {allQuestion[currentQuestion]
                            ? allQuestion[currentQuestion].questionId.optionSixExplanation
                            : ''}
                        </p>
                      ) : (
                        ''
                      )}
                      <hr />
                      {/* <CRow className="mt-3">
                      <CCol md={4} className="d-flex justify-start flex-col">
                        <p className="font-bold">Usmle Step</p>
                        <p className="text-xs">{usmleStep}</p>
                      </CCol>
                      <CCol md={4} className="d-flex justify-start flex-col">
                        <p className="font-bold">Usmle Category</p>
                        <p className="text-xs">{usmleCategory}</p>
                      </CCol>
                    </CRow> */}
                    </div>
                  </CCol>
                </CRow>
              ) : (
                <div className="h-screen flex justify-center items-center text-xl">
                  <CAlert color="danger">Sorry!!! This question has been deleted.</CAlert>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ReviewQuizFooter />
    </div>
  )
}

export default ReviewQuiz
