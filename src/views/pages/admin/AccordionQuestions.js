import React, { useEffect, useRef, useState } from 'react'
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
  options,
  onClick,
}) => {
  const contentHeight = useRef()
  const [contentHeightStyle, setContentHeightStyle] = useState({ height: '0px' })

  useEffect(() => {
    if (isOpen) {
      setContentHeightStyle({ height: `${contentHeight.current.scrollHeight}px` })
    } else {
      setContentHeightStyle({ height: '0px' })
    }
  }, [isOpen])

  const getTotalUsers = () => {
    return Object.values(options).reduce((total, num) => total + num, 0)
  }

  const getPercentage = (count) => {
    const total = getTotalUsers()
    return total > 0 ? ((count / total) * 100).toFixed(2) : '0.00'
  }

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

      <div ref={contentHeight} className="answer-container border-t" style={contentHeightStyle}>
        <div className="answer-content">
          {[op1, op2, op3, op4, op5, op6].map(
            (option, index) =>
              option && (
                <div
                  key={index}
                  className={`${option === answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
                >
                  <span>
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                  <span className="text-center">
                    {options.hasOwnProperty(option)
                      ? `(${options[option]} Users Selected this option)`
                      : '(0 Users Selected this option)'}
                  </span>
                  <span className="text-right">{getPercentage(options[option] || 0)}%</span>
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  )
}

export default AccordionQuestions
