import React from 'react'
import { CFooter } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
const QuizFooter = ({ showQues, quizEnd, step, category }) => {
  const navigate = useNavigate()

  return (
    <CFooter className="quiz-footer">
      <div className="text-xl">Time Left : 00:00</div>
      <div className="text-xl opacity-40">
        Question Bank for USMLE {showQues ? `Step ${step}: ${category}` : ''}
      </div>
      {showQues && (
        <div
          className="cursor-pointer text-xl flex justify-center items-center"
          onClick={() => navigate('/')}
        >
          End<span className="ml-3 w-7 h-7 rounded-full bg-red-950 "></span>
        </div>
      )}
    </CFooter>
  )
}

export default React.memo(QuizFooter)
