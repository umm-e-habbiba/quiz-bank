import { CButton, CForm, CFormCheck, CFormInput, CAlert, CRow, CCol } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'
import { useForm } from 'react-hook-form'
import { useNavigate, NavLink } from 'react-router-dom'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import { API_URL } from 'src/store'
import Highlighter from 'react-highlight-words'
import image from '../assets/images/angular.jpg'
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
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuestion, setAllQuestion] = useState([])
  const [filteredQuestion, setFilteredQuestion] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [quizEnd, setQuizEnd] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
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
    console.log(saveQuestionArray)
  }, [saveQuestionArray])

  useEffect(() => {
    if (quizEnd) {
      navigate('/quiz-performance')
      saveQuiz()
    }
  }, [quizEnd])

  const getAllQuest = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'mcqs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.data) {
          setAllQuestion(result.data)
        }
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

  const handleFormSubmit = (e, id) => {
    e.preventDefault()
    setOpt1Marked(false)
    setOpt2Marked(false)
    setOpt3Marked(false)
    setOpt4Marked(false)
    setOpt5Marked(false)
    setOpt6Marked(false)
    checkAnswer()
    handleNextQuestion()
    const questionObj = {
      questionId: id,
      selectedOption: selectedOption,
    }
    setSaveQuestionArray((prevQues) => [...prevQues, questionObj])
    setSelectedOption('')
    console.log('save question array', saveQuestionArray)
    // saveQuiz(id)
  }

  const checkAnswer = () => {
    if (selectedOption == filteredQuestion[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < getValues('total')) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizEnd(true)
    }
  }

  const handleHighlight = () => {
    const selectedText = window.getSelection().toString()
    setHighlightedText((prevText) => [...prevText, selectedText])
    console.log(selectedText, '   ', highlightedText)
  }

  const saveQuiz = () => {
    console.log('user id', userID, 'selected option', selectedOption)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      userId: userID,
      attemptedQuizzes: [
        {
          questions: saveQuestionArray,
          totalScore: getValues('total'),
          obtainedScore: quizScore,
          usmleSteps: usmleStep,
          USMLE: usmleCategory,
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
        console.log(result)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  return (
    <div>
      <QuizHeader
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        showQues={showQues}
        totalQues={getValues('total')}
        filteredArray={filteredQuestion}
        fontSize={fontSize}
        setFontSize={setFontSize}
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
          <div className="p-10" style={{ fontSize: `${fontSize}px` }}>
            {filteredQuestion[currentQuestion].image ? (
              <CRow className="mb-5">
                <CCol md={8}>
                  <Highlighter
                    highlightClassName="bg-yellow-300 text-yellow-700" //custom highlight class
                    searchWords={highlightedText.length > 0 ? highlightedText : []}
                    autoEscape={true}
                    textToHighlight={filteredQuestion[currentQuestion].question}
                    onMouseUp={handleHighlight}
                  />
                </CCol>
                <CCol md={4}>
                  <img
                    // src={image}
                    src={`${API_URL}uploads/${filteredQuestion[currentQuestion].image}`}
                    alt="question image"
                    className="w-96 h-64"
                  />
                </CCol>
              </CRow>
            ) : (
              <CRow className="mb-5">
                <CCol md={12}>
                  <Highlighter
                    highlightClassName="bg-yellow-300 text-yellow-700" //custom highlight class
                    searchWords={highlightedText.length > 0 ? highlightedText : []}
                    autoEscape={true}
                    textToHighlight={filteredQuestion[currentQuestion].question}
                    onMouseUp={handleHighlight}
                  />
                </CCol>
              </CRow>
            )}
            <div></div>
            <CForm onSubmit={(e) => handleFormSubmit(e, filteredQuestion[currentQuestion]._id)}>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 min-w-64 w-fit">
                <div className="form-check">
                  <input
                    type="radio"
                    id={filteredQuestion[currentQuestion].optionOne}
                    name={currentQuestion}
                    value={filteredQuestion[currentQuestion].optionOne}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                    className="form-check-input"
                  />
                  <label
                    className={`form-check-label ml-2 ${opt1Marked ? 'line-through' : ''}`}
                    onClick={() => setOpt1Marked((prevCheck) => !prevCheck)}
                  >
                    A: {filteredQuestion[currentQuestion].optionOne}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id={filteredQuestion[currentQuestion].optionTwo}
                    name={currentQuestion}
                    value={filteredQuestion[currentQuestion].optionTwo}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                    className="form-check-input"
                  />
                  <label
                    className={`form-check-label ml-2 ${opt2Marked ? 'line-through' : ''}`}
                    onClick={() => setOpt2Marked((prevCheck) => !prevCheck)}
                  >
                    B: {filteredQuestion[currentQuestion].optionTwo}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id={filteredQuestion[currentQuestion].optionThree}
                    name={currentQuestion}
                    value={filteredQuestion[currentQuestion].optionThree}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                    className="form-check-input"
                  />
                  <label
                    className={`form-check-label ml-2 ${opt3Marked ? 'line-through' : ''}`}
                    onClick={() => setOpt3Marked((prevCheck) => !prevCheck)}
                  >
                    C: {filteredQuestion[currentQuestion].optionThree}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id={filteredQuestion[currentQuestion].optionFour}
                    name={currentQuestion}
                    value={filteredQuestion[currentQuestion].optionFour}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                    className="form-check-input"
                  />
                  <label
                    className={`form-check-label ml-2 ${opt4Marked ? 'line-through' : ''}`}
                    onClick={() => setOpt4Marked((prevCheck) => !prevCheck)}
                  >
                    D: {filteredQuestion[currentQuestion].optionFour}
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    id={filteredQuestion[currentQuestion].optionFive}
                    name={currentQuestion}
                    value={filteredQuestion[currentQuestion].optionFive}
                    onChange={(e) => setSelectedOption(e.currentTarget.id)}
                    className="form-check-input"
                  />
                  <label
                    className={`form-check-label ml-2 ${opt5Marked ? 'line-through' : ''}`}
                    onClick={() => setOpt5Marked((prevCheck) => !prevCheck)}
                  >
                    E: {filteredQuestion[currentQuestion].optionFive}
                  </label>
                </div>
                {filteredQuestion[currentQuestion].optionSix ? (
                  <div className="form-check">
                    <input
                      type="radio"
                      id={filteredQuestion[currentQuestion].optionSix}
                      name={currentQuestion}
                      value={filteredQuestion[currentQuestion].optionSix}
                      onChange={(e) => setSelectedOption(e.currentTarget.id)}
                      className="form-check-input"
                    />
                    <label
                      className={`form-check-label ml-2 ${opt6Marked ? 'line-through' : ''}`}
                      onClick={() => setOpt6Marked((prevCheck) => !prevCheck)}
                    >
                      F: {filteredQuestion[currentQuestion].optionSix}
                    </label>
                  </div>
                ) : (
                  ''
                )}
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
        saveQuestionArray={saveQuestionArray}
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
