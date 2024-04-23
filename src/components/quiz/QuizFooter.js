import React from 'react'
import { CFooter } from '@coreui/react'

const QuizFooter = () => {
  return (
    <CFooter className="quiz-footer">
      <div className="text-xl">Time Left : 00:00</div>
    </CFooter>
  )
}

export default React.memo(QuizFooter)
