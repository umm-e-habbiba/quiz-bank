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
import { useNavigate } from 'react-router-dom'
const QuizFooter = ({ showQues, step, category, totalQues, score }) => {
  const navigate = useNavigate()
  const [endModal, setEndModal] = useState(false)
  // const [totalSeconds, setTotalSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState('00:00')

  useEffect(() => {
    setTotalSeconds(Number(totalQues) * 90)
  }, [totalQues])

  useEffect(() => {
    //Implementing the setInterval method
    // console.log('ques ', totalQues, 'seconds', Number(totalQues) * 90, 'left', timeLeft)
    if (showQues) {
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
        endQuiz()
      }
    } else {
      console.log('total show ques is false')
    }
  }, [totalSeconds, showQues, timeLeft])

  const endQuiz = () => {
    navigate('/quiz-performance')
    setTimeLeft('00:00')
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
        <div className="text-xl">Time Left : {showQues ? timeLeft : '00:00'}</div>
        <div className="text-xl opacity-40">
          Question Bank for USMLE {showQues ? `Step ${step}: ${category}` : ''}
        </div>
        {showQues && (
          <div
            className="cursor-pointer text-xl flex justify-center items-center"
            onClick={() => setEndModal(true)}
          >
            End<span className="ml-3 w-7 h-7 rounded-full bg-red-600 "></span>
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
          <CModalTitle id="VerticallyCenteredExample">End Exam</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to end this exam?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEndModal(false)}>
            No
          </CButton>
          <CButton color="primary" onClick={endQuiz}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default React.memo(QuizFooter)
