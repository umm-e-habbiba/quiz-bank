import React, { useEffect, useState } from 'react'
import {
  CFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { API_URL } from 'src/store'
const QuizFooter = ({
  showQues,
  totalQues,
  score,
  saveQuestionArray,
  isTimer,
  examId,
  timeLeft,
  setTimeLeft,
  timeInSeconds,
  handleNextQuestion,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [endModal, setEndModal] = useState(false)
  // const [totalSeconds, setTotalSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  // const [timeLeft, setTimeLeft] = useState('00:00')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')

  useEffect(() => {
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
    if (timeInSeconds == 0) {
      setTotalSeconds(Number(totalQues) * 90)
    } else {
      setTotalSeconds(timeInSeconds + Number(totalQues) * 90)
    }
  }, [totalQues])

  useEffect(() => {
    console.log('saveQuestionArray')
  }, [saveQuestionArray])

  useEffect(() => {
    //Implementing the setInterval method
    // console.log('ques ', totalQues, 'seconds', Number(totalQues) * 90, 'left', timeLeft)
    if (isTimer) {
      if (totalSeconds > 0) {
        const interval = setInterval(() => {
          setTotalSeconds(totalSeconds - 1)
          const leftTime = convertSeconds(totalSeconds - 1)
          setTimeLeft(leftTime)
        }, 1000)
        //Clearing the interval
        return () => {
          if (interval) {
            clearInterval(interval)
          }
        }
      } else {
        setTimeLeft('00:00')
      }
    } else {
      // console.log('total show ques is false')
      setTimeLeft('00:00')
    }
  }, [totalSeconds, isTimer, timeLeft])

  const endQuiz = () => {
    if (location.pathname.includes('full-length-exam')) {
      navigate('/previous-exams')
      setTimeLeft('00:00')
      saveExam()
    } else {
      navigate('/quiz-performance')
      setTimeLeft('00:00')
      saveQuiz()
    }
  }

  const saveQuiz = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      userId: userID,
      attemptedQuizzes: [
        {
          questions: saveQuestionArray,
          totalScore: totalQues,
          obtainedScore: score,
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
        console.log('result')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const saveExam = () => {
    // console.log('user id', userID, 'selected option', selectedOption)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      userId: userID,
      testId: examId,
      totalMarks: totalQues,
      obtainedMarks: score,
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
        console.log('result')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const convertSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const hourString = hours > 0 ? `${hours > 9 ? hours : '0' + hours}` : ''
    const minuteString = minutes > 0 ? `${minutes > 9 ? minutes : '0' + minutes}` : '00'
    const secondString =
      remainingSeconds > 0
        ? `${remainingSeconds > 9 ? remainingSeconds : '0' + remainingSeconds}`
        : '00'

    if (hours > 0) {
      return `${hourString}:${minuteString || '00'}${secondString && `:${secondString}`}`
    } else if (!hours && minutes > 0) {
      return `${minuteString}${secondString && `:${secondString}`}`
    }

    return `00:${secondString}`
  }

  return (
    <>
      <CFooter className="quiz-footer">
        {/* <div className="text-xl">Time Left : {showQues ? convertSeconds(totalSeconds) : '00:00'}</div> */}
        {isTimer && (
          <div className="text-md md:text-xl">Time Left : {showQues ? timeLeft : '00:00'}</div>
        )}
        <div className="text-md md:text-xl  opacity-40">ZAP-70 Q-Bank</div>
        {showQues && (
          <div
            className="cursor-pointer text-md md:text-xl flex justify-center items-center"
            onClick={() => setEndModal(true)}
          >
            End<span className="ml-2 md:ml-3 h-5 w-5 md:w-7 md:h-7 rounded-full bg-red-600 "></span>
          </div>
        )}
      </CFooter>
      {/* end quiz modal */}
      <CModal
        alignment="center"
        visible={endModal}
        onClose={() => setEndModal(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader className="bg-red-600">
          <CModalTitle id="VerticallyCenteredExample">
            End {location.pathname.includes('full-length-exam') ? 'Section' : 'Exam'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to end this{' '}
          {location.pathname.includes('full-length-exam') ? 'section?' : 'exam?'}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEndModal(false)}>
            No
          </CButton>
          {location.pathname.includes('full-length-exam') ? (
            <CButton
              color="primary"
              onClick={(e) => {
                handleNextQuestion(e)
                setEndModal(false)
              }}
            >
              Yes
            </CButton>
          ) : (
            <CButton color="primary" onClick={endQuiz}>
              Yes
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default React.memo(QuizFooter)
