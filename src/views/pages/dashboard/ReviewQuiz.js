import { CButton, CForm, CFormCheck, CFormInput, CAlert, CRow, CCol } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useForm } from 'react-hook-form'
import { useNavigate, NavLink } from 'react-router-dom'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import CIcon from '@coreui/icons-react'
import { cilBarChart, cilCalendar, cilClock } from '@coreui/icons'
import { API_URL } from 'src/store'
import ReviewQuizFooter from 'src/components/quiz/ReviewQuizFooter'

const ReviewQuiz = () => {
  const navigate = useNavigate()
  const [intro, setIntro] = useState(true)
  const [steps, setSteps] = useState(false)
  const [step1, setStep1] = useState(false)
  const [step2, setStep2] = useState(false)
  const [step3, setStep3] = useState(false)
  const [showQues, setShowQues] = useState(true)
  const [usmleCategory, setUsmleCategory] = useState('')
  const [usmleStep, setUsmleStep] = useState('')
  const [showTotal, setShowTotal] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizEnd, setQuizEnd] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [quizScore, setQuizScore] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      total: 1,
    },
  })

  useEffect(() => {
    getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    console.log('all questions array', allQuestion)
  }, [allQuestion])

  useEffect(() => {
    if (quizEnd) {
      navigate('/quiz-performance')
    }
  }, [quizEnd])

  const getAllQuest = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(API_URL + 'latest-quiz/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAllQuestion(result.questions)
        setUsmleStep(result.usmleSteps)
        setUsmleCategory(result.USMLE)
        console.log('all questions ', result.questions, 'current', allQuestion[currentQuestion])
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
  return (
    <div>
      <QuizHeader
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        showQues={showQues}
        totalQues={allQuestion.length}
        filteredArray={allQuestion}
      />
      <div className="wrapper d-flex flex-column min-h-[77vh]">
        {/* Questions */}
        <CRow className="overflow-x-hidden">
          <CCol md={6} className="border-r-2 border-solid">
            <div className="p-10">
              {allQuestion[currentQuestion] && allQuestion[currentQuestion].questionId.image ? (
                <div className="mb-5">
                  <p className="mb-1">
                    {allQuestion[currentQuestion]
                      ? allQuestion[currentQuestion].questionId.question
                      : ''}
                  </p>
                  <img
                    src={`${API_URL}uploads/${allQuestion[currentQuestion].questionId.image}`}
                    alt="question image"
                    className="w-96 h-64"
                  />
                </div>
              ) : (
                <p className="mb-5">
                  {allQuestion[currentQuestion]
                    ? allQuestion[currentQuestion].questionId.question
                    : ''}
                </p>
              )}
              <CForm onSubmit={handleFormSubmit}>
                <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 min-w-64 w-fit">
                  <CFormCheck
                    type="radio"
                    id={
                      allQuestion[currentQuestion]
                        ? allQuestion[currentQuestion].questionId.optionOne
                        : ''
                    }
                    label={
                      allQuestion[currentQuestion]
                        ? allQuestion[currentQuestion].questionId.optionOne
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
                        ? allQuestion[currentQuestion].questionId.optionTwo
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
                        ? allQuestion[currentQuestion].questionId.optionThree
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
                        ? allQuestion[currentQuestion].questionId.optionFour
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
                </div>
                {allQuestion.length > 0 && allQuestion[currentQuestion] ? (
                  <CRow
                    className={`py-2 px-1 border-l-4 border-solid ${allQuestion[currentQuestion].questionId.correctAnswer == allQuestion[currentQuestion].selectedOption ? 'border-green-600' : 'border-red-600'}  answer-stat-box bg-gray-200`}
                  >
                    <CCol md={12} className="flex justify-start flex-col">
                      {allQuestion[currentQuestion].questionId.correctAnswer ==
                      allQuestion[currentQuestion].selectedOption ? (
                        <p className="text-green-600">Correct</p>
                      ) : (
                        <>
                          <p className="text-red-600">Incorrect</p>
                          <p className="text-xs">Correct answer</p>
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
            <div className="p-10">
              <h5 className="mb-1">Explaination</h5>
              <p className="mb-1">
                {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.questionExplanation
                  : ''}
              </p>
              {allQuestion[currentQuestion] && allQuestion[currentQuestion].questionId.image ? (
                <img
                  src={`${API_URL}uploads/${allQuestion[currentQuestion].questionId.image}`}
                  alt="question image"
                  className="w-96 h-64"
                />
              ) : (
                ''
              )}
              <p className="mb-2">
                <span className="font-bold">(Choise A)</span>
                {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.optionOneExplanation
                  : ''}
              </p>
              <p className="mb-2">
                <span className="font-bold">(Choise B)</span>{' '}
                {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.optionTwoExplanation
                  : ''}
              </p>
              <p className="mb-2">
                <span className="font-bold">(Choise B)</span>{' '}
                {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.optionThreeExplanation
                  : ''}
              </p>
              <p className="mb-3">
                <span className="font-bold">(Choise D)</span>{' '}
                {allQuestion[currentQuestion]
                  ? allQuestion[currentQuestion].questionId.optionFourExplanation
                  : ''}
              </p>
              <hr />
              <CRow className="mt-3">
                <CCol md={4} className="d-flex justify-start flex-col">
                  <p className="text-black font-bold">Usmle Step</p>
                  <p className="text-gray-800 text-xs">{usmleStep}</p>
                </CCol>
                <CCol md={4} className="d-flex justify-start flex-col">
                  <p className="text-black font-bold">Usmle Category</p>
                  <p className="text-gray-800 text-xs">{usmleCategory}</p>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>
      </div>
      <ReviewQuizFooter totalQues={allQuestion.length} step={usmleStep} category={usmleCategory} />
    </div>
  )
}

export default ReviewQuiz
