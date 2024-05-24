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
const ReviewQuizFooter = () => {
  return (
    <>
      <CFooter className="quiz-footer justify-between">
        {/* <div className="text-xl">Time Left : {showQues ? convertSeconds(totalSeconds) : '00:00'}</div> */}
        <div className="text-xl">Time Left : 00:00</div>
        <div className="text-xl opacity-40">ZAP-70 Q-Bank</div>
      </CFooter>
    </>
  )
}

export default React.memo(ReviewQuizFooter)
