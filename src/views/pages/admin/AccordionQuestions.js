import React, { useRef } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
const AccordionQuestions = ({
  question,
  answer,
  attempts,
  op1,
  op2,
  op3,
  op4,
  op5,
  op6,
  isOpen,
  onClick,
}) => {
  const contentHeight = useRef()
  return (
    <div className="question-wrapper">
      <button className={`question-container ${isOpen ? 'active' : ''}`} onClick={onClick}>
        <p
          className="question-content text-xl font-normal"
          dangerouslySetInnerHTML={{
            __html: question.length > 120 ? question.substring(0, 120) + '...' : question,
          }}
        ></p>
        <div className="flex justify-end items-center">
          <span className="text-yellow-500 text-sm mr-1">({attempts} Attempts)</span>
          <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} />
        </div>
      </button>

      <div
        ref={contentHeight}
        className="answer-container border-t"
        style={isOpen ? { height: contentHeight.current.scrollHeight } : { height: '0px' }}
      >
        <div className="answer-content">
          <div
            className={`${op1 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
          >
            <span>A. {op1}</span>
            <span className="text-center">(70 Users Selected this option)</span>
            <span className="text-right">20%</span>
          </div>
          <div
            className={`${op2 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
          >
            <span>B. {op2}</span>
            <span className="text-center">(70 Users Selected this option)</span>
            <span className="text-right">20%</span>
          </div>
          <div
            className={`${op3 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
          >
            <span>C. {op3}</span>
            <span className="text-center">(70 Users Selected this option)</span>
            <span className="text-right">20%</span>
          </div>
          <div
            className={`${op4 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
          >
            <span>D. {op4}</span>
            <span className="text-center">(70 Users Selected this option)</span>
            <span className="text-right">20%</span>
          </div>
          <div
            className={`${op5 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
          >
            <span>E. {op5}</span>
            <span className="text-center">(70 Users Selected this option)</span>
            <span className="text-right">20%</span>
          </div>
          {op6 && (
            <div
              className={`${op6 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
            >
              <span>E. {op6}</span>
              <span className="text-center">(70 Users Selected this option)</span>
              <span className="text-right">20%</span>
            </div>
          )}
        </div>
        {/* <p className="answer-content">{answer}</p> */}
      </div>
    </div>
  )
}
export default AccordionQuestions
