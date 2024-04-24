import { CButton, CForm, CFormCheck, CFormInput } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
  const [totalQues, setTotalQues] = useState('')
  const [showTotal, setShowTotal] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [quizEnd, setQuizEnd] = useState(false)
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
    fetchQuestion()
  }

  const setTopic = (value) => {
    setUsmleCategory(value)
    // setShowQues(true)
    setIntro(false)
    setSteps(false)
    setStep1(false)
    setStep2(false)
    setStep3(false)
    setShowTotal(true)
    console.log(usmleCategory)
  }

  const fetchQuestion = () => {
    const filterSteps = allQuestion.filter((ques) => ques.usmleStep == usmleStep)
    const filterUsmle = filterSteps.filter((ques) => ques.USMLE == usmleCategory)
    setFilteredQuestion(filterUsmle)
    console.log('filtered steps array', filterSteps, filterUsmle)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    checkAnswer()
    handleNextQuestion()
  }

  const checkAnswer = () => {
    if (selectedOption === filteredQuestion[currentQuestion].correct) {
      // this.setState((prevState) => ({ score: prevState.score + 1 }));
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < filteredQuestion.length) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption('')
    } else {
      setQuizEnd(true)
    }
  }

  return (
    <div>
      <QuizHeader showQues={showQues} totalQues={getValues('total')} />
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
                setIntro(false)
                setSteps(false)
                setStep1(true)
                setStep2(false)
                setStep3(false)
                setUsmleStep('1')
              }}
            >
              USMLE: <span className="font-bold">Step1</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                setIntro(false)
                setSteps(false)
                setStep1(false)
                setStep2(true)
                setStep3(false)
                setUsmleStep('2')
              }}
            >
              USMLE: <span className="font-bold">Step2</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                setIntro(false)
                setSteps(false)
                setStep1(false)
                setStep2(false)
                setStep3(true)
                setUsmleStep('3')
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
                  onClick={() => setTopic(category)}
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
                  onClick={() => setTopic(category)}
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
                  onClick={() => setTopic(category)}
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
                {...register('total', { required: true, min: 0 })}
                feedback="Please enter valid number of questions."
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
                Submit
              </CButton>
            </CForm>
          </div>
        )}
      </div>
      <QuizFooter />
    </div>
  )
}

export default QuizLayout
