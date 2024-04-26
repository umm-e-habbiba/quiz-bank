import { CButton, CForm, CFormCheck, CFormInput, CAlert } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useForm } from 'react-hook-form'
import { useNavigate, NavLink } from 'react-router-dom'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'

const QuizLayout = () => {
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
  const [allQuestion, setAllQuestion] = useState([])
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [quizEnd, setQuizEnd] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [quizScore, setQuizScore] = useState(0)

  const API_URL = 'http://localhost:8000/'
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

    fetch(API_URL + 'mcqs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAllQuestion(result)
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
        {/* tutorial */}
        {intro && (
          <div className="flex flex-col">
            <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mx-auto mt-20 mb-10">
              <h3 className="font-bold text-center text-3xl mb-3">Tutorial</h3>
              <p className="text-center leading-6">
                Welcome to the USMLE Practice Question Bank Tutorial!
                <br />
                This tutorial will guide you through the features and
                <br />
                functionalities of our practice question bank to help you make
                <br />
                the most of your study time.
              </p>
            </div>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full"
              onClick={() => {
                setIntro(false)
                setSteps(true)
              }}
            >
              Next
            </CButton>
          </div>
        )}
        {/* select steps */}
        {steps && (
          <div className="flex flex-col bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mx-auto mt-20 mb-10">
            <h3 className="text-center text-3xl mb-3">Please select your Exam</h3>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                fetchQuestion(1, '')
              }}
            >
              USMLE: <span className="font-bold">Step1</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                fetchQuestion(2, '')
              }}
            >
              USMLE: <span className="font-bold">Step2</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                fetchQuestion(3, '')
              }}
            >
              USMLE: <span className="font-bold">Step3</span>
            </CButton>
          </div>
        )}
        {/* USMLE STEP 1 */}
        {step1 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step1</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {step1Categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer"
                  onClick={() => fetchQuestion(usmleStep, category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* USMLE STEP 2 */}
        {step2 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step2</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {step2Categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer"
                  onClick={() => fetchQuestion(usmleStep, category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* USMLE STEP 3 */}
        {step3 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step3</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {step3Categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer"
                  onClick={() => fetchQuestion(usmleStep, category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Total Questions */}
        {/* select steps */}
        {showTotal && (
          <div className="flex flex-col bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mx-auto mt-20 mb-10">
            <h3 className="text-center text-3xl mb-3">Please enter number of questions</h3>
            <CForm
              onSubmit={handleSubmit(setQues)}
              className="flex justify-center items-center flex-col"
            >
              <CFormInput
                type="number"
                placeholder="Enter number of questions"
                {...register('total', { required: true, min: 1, max: 100 })}
                feedback="Please enter number between 1 and 100"
                invalid={errors.total ? true : false}
              />
              <CButton color="primary" type="submit" className="mx-auto px-5 rounded-full mt-3">
                Next
              </CButton>
            </CForm>
          </div>
        )}
        {/* Questions */}
        {showQues && (
          <div className="p-10">
            <p className="mb-5">{filteredQuestion[currentQuestion].question}</p>
            <CForm onSubmit={handleFormSubmit}>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 w-64">
                {filteredQuestion[currentQuestion].options.map((opt, idx) => (
                  <CFormCheck
                    type="radio"
                    id={opt}
                    name={currentQuestion}
                    label={opt}
                    key={idx}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                  />
                ))}
              </div>
              <CButton color="primary" className="mx-auto px-5 rounded-full" type="submit">
                {currentQuestion + 1 != getValues('total') ? 'Next' : 'Submit'}
              </CButton>
            </CForm>
          </div>
        )}
      </div>
      <QuizFooter
        showQues={showQues}
        totalQues={getValues('total')}
        step={usmleStep}
        category={usmleCategory}
        score={quizScore}
      />
      {/* error alert */}
      {error && (
        <CAlert color="danger" className="success-alert">
          {errorMsg}
        </CAlert>
      )}
    </div>
  )
}

export default QuizLayout
