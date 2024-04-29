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

const ReviewQuiz = () => {
  const navigate = useNavigate()
  const [intro, setIntro] = useState(true)
  const [steps, setSteps] = useState(false)
  const [step1, setStep1] = useState(false)
  const [step2, setStep2] = useState(false)
  const [step3, setStep3] = useState(false)
  const [showQues, setShowQues] = useState(false)
  const [usmleCategory, setUsmleCategory] = useState('')
  const [usmleStep, setUsmleStep] = useState('')
  const [showTotal, setShowTotal] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
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
    if (quizEnd) {
      navigate('/quiz-performance')
      const score = {
        total: getValues('total'),
        obt: quizScore,
      }
      localStorage.setItem('score', JSON.stringify(score))
    }
  }, [quizEnd])

  const getAllQuest = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    fetch(API_URL + 'user-quizzes/' + userID, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        // setAllQuestion(result)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const setQues = (data) => {
    console.log(data)
    setShowQues(true)
    setIntro(false)
    setSteps(false)
    setStep1(false)
    setStep2(false)
    setStep3(false)
    setShowTotal(false)
    console.log(filteredQuestion)
    // fetchQuestion()
  }

  const fetchQuestion = (step, value) => {
    setIntro(false)
    const filterSteps = allQuestion.filter((ques) => ques.usmleStep == step)
    if (filterSteps.length > 0) {
      setUsmleStep(step)
      setSteps(false)
      if (step == '1') {
        setStep1(true)
      }
      if (step == '2') {
        setStep2(true)
      }
      if (step == '3') {
        setStep3(true)
      }
      // if usmle category is selected
      if (value) {
        setUsmleCategory(value)
        const filterUsmle = filterSteps.filter((ques) => ques.USMLE == value)
        if (filterUsmle.length > 0) {
          setFilteredQuestion(filterUsmle)
          setIntro(false)
          setSteps(false)
          setStep1(false)
          setStep2(false)
          setStep3(false)
          setShowTotal(true)
        } else {
          if (step == '1') {
            setStep1(true)
          }
          if (step == '2') {
            setStep2(true)
          }
          if (step == '3') {
            setStep3(true)
          }
          setShowTotal(false)
          setError(true)
          setErrorMsg('No Questions avaialable for this USMLE, Kindly select another')
          setTimeout(() => {
            setError(false)
            setErrorMsg('')
          }, 2000)
        }
      }
    } else {
      // if no questions found for selected step send back to select steps
      setShowTotal(false)
      setSteps(true)
      setError(true)
      setErrorMsg('No Questions avaialable for this Step, Kindly select another')
      setTimeout(() => {
        setError(false)
        setErrorMsg('')
      }, 2000)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    checkAnswer()
    handleNextQuestion()
  }

  const checkAnswer = () => {
    if (selectedOption == filteredQuestion[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < getValues('total')) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption('')
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
        totalQues={getValues('total')}
        filteredArray={filteredQuestion}
      />
      <div className="wrapper d-flex flex-column min-h-[77vh]">
        {/* Questions */}
        <CRow>
          <CCol md={6} className="border-r-2 border-solid">
            <div className="p-10">
              <p className="mb-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industrys standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                with desktop publishing software like Aldus PageMaker including versions of Lorem
                Ipsum.
              </p>
              {/* <p className="mb-5">{allQuestion[currentQuestion].question}</p> */}
              <CForm onSubmit={handleFormSubmit}>
                <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 w-64">
                  <CFormCheck
                    type="radio"
                    id="op1"
                    name={currentQuestion}
                    label="opt1"
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                  />
                  <CFormCheck
                    type="radio"
                    id="op1"
                    name={currentQuestion}
                    label="opt1"
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                  />
                  <CFormCheck
                    type="radio"
                    id="op1"
                    name={currentQuestion}
                    label="opt1"
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                  />
                  {/* {allQuestion[currentQuestion].options.map((opt, idx) => (
                <CFormCheck
                  type="radio"
                  id={opt}
                  name={currentQuestion}
                  label={opt}
                  key={idx}
                  onChange={(e) => setSelectedOption(e.currentTarget.id)}
                />
              ))} */}
                </div>
                <CRow className="py-2 px-1 border-l-4 border-solid border-red-600 answer-stat-box bg-gray-200">
                  <CCol md={2} className="flex justify-start flex-col">
                    <p className="text-red-600">Incorrect</p>
                    <p className="text-xs">Correct answer</p>
                    <p className="text-black">E</p>
                  </CCol>
                  <CCol md={4} className="flex justify-start items-center">
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
                  </CCol>
                </CRow>
              </CForm>
            </div>
          </CCol>
          <CCol md={6}>
            <div className="p-10">
              <h5 className="mb-1">Explaination</h5>
              <p className="mb-1">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industrys standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                with desktop publishing software like Aldus PageMaker including versions of Lorem
                Ipsum.
              </p>
              <p className="mb-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industrys standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
              <p className="mb-2">
                <span className="font-bold">(Choise A)</span> Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
              <p className="mb-2">
                <span className="font-bold">(Choise B)</span> Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
              <p className="mb-2">
                <span className="font-bold">(Choise B)</span> Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
              <p className="mb-3">
                <span className="font-bold">(Choise D)</span> Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
              <hr />
              <CRow className="mt-3">
                <CCol md={4} className="d-flex justify-start flex-col">
                  <p className="text-black font-bold">Immunology</p>
                  <p className="text-gray-800 text-xs">Subject</p>
                </CCol>
                <CCol md={4} className="d-flex justify-start flex-col">
                  <p className="text-black font-bold">Dermatology</p>
                  <p className="text-gray-800 text-xs">System</p>
                </CCol>
                <CCol md={4} className="d-flex justify-start flex-col">
                  <p className="text-black font-bold">Skin Indections</p>
                  <p className="text-gray-800 text-xs">Topics</p>
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>
      </div>
      <QuizFooter
        showQues={showQues}
        totalQues={getValues('total')}
        step={usmleStep}
        category={usmleCategory}
        score={quizScore}
      />
    </div>
  )
}

export default ReviewQuiz
