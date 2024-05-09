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
      <CFooter className="quiz-footer">
        {/* <div className="text-xl">Time Left : {showQues ? convertSeconds(totalSeconds) : '00:00'}</div> */}
        <div className="text-xl">Time Left : 00:00</div>
        <div className="text-xl opacity-40">USMLE Question Bank</div>
        <div
          className="cursor-pointer text-xl flex justify-center items-center"
          // onClick={() => setEndModal(true)}
        >
          {/* End<span className="ml-3 w-7 h-7 rounded-full bg-red-600 "></span> */}
        </div>
      </CFooter>
    </>
  )
}

export default React.memo(ReviewQuizFooter)
