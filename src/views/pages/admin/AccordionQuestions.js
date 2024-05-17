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
    // <div className="question-wrapper">
    //   <button className={`question-container ${isOpen ? 'active' : ''}`} onClick={onClick}>
    //     <p
    //       className="question-content text-xl font-normal"
    //       dangerouslySetInnerHTML={{
    //         __html: question.length > 120 ? question.substring(0, 120) + '...' : question,
    //       }}
    //     ></p>
    //     <div className="flex justify-end items-center">
    //       <span className="text-yellow-500 text-sm mr-1">({attempts} Attempts)</span>
    //       <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} />
    //     </div>
    //   </button>

    //   <div
    //     ref={contentHeight}
    //     className="answer-container border-t"
    //     style={isOpen ? { height: contentHeight.current.scrollHeight } : { height: '0px' }}
    //   >
    //     <div className="answer-content">
    //       <div
    //         className={`${op1 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //       >
    //         <span>A. {op1}</span>
    //         <span className="text-center">
    //           {Object.hasOwn(options, op1)
    //             ? `(${options[op1]} Users Selected this option)`
    //             : '(0 Users Selected this option)'}
    //         </span>
    //         <span className="text-right">
    //           {Object.hasOwn(options, op1) ? `${percentage(options[op1], 100)}%` : '0%'}
    //         </span>
    //       </div>
    //       <div
    //         className={`${op2 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //       >
    //         <span>B. {op2}</span>
    //         <span className="text-center">
    //           {Object.hasOwn(options, op2)
    //             ? `(${options[op2]} Users Selected this option)`
    //             : // ? `(${GetPropertyValue(options, op2)} Users Selected this option)`
    //               '(0 Users Selected this option)'}
    //         </span>
    //         <span className="text-right">
    //           {Object.hasOwn(options, op2) ? `${percentage(options[op2], 100)}%` : '0%'}
    //         </span>
    //       </div>
    //       <div
    //         className={`${op3 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //       >
    //         <span>C. {op3}</span>
    //         <span className="text-center">
    //           {Object.hasOwn(options, op3)
    //             ? `(${options[op3]} Users Selected this option)`
    //             : '(0 Users Selected this option)'}
    //         </span>
    //         <span className="text-right">
    //           {Object.hasOwn(options, op3) ? `${percentage(options[op3], 100)}%` : '0%'}
    //         </span>
    //       </div>
    //       <div
    //         className={`${op4 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //       >
    //         <span>D. {op4}</span>
    //         <span className="text-center">
    //           {Object.hasOwn(options, op4)
    //             ? `(${options[op4]} Users Selected this option)`
    //             : '(0 Users Selected this option)'}
    //         </span>
    //         <span className="text-right">
    //           {Object.hasOwn(options, op4) ? `${percentage(options[op4], 100)}%` : '0%'}
    //         </span>
    //       </div>
    //       <div
    //         className={`${op5 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //       >
    //         <span>E. {op5}</span>
    //         <span className="text-center">
    //           {Object.hasOwn(options, op5)
    //             ? `(${options[op5]} Users Selected this option)`
    //             : '(0 Users Selected this option)'}
    //         </span>
    //         <span className="text-right">
    //           {Object.hasOwn(options, op5) ? `${percentage(options[op5], 100)}%` : '0%'}
    //         </span>
    //       </div>
    //       {op6 && (
    //         <div
    //           className={`${op6 == answer ? 'text-green-500' : ''} border-b grid grid-cols-1 lg:grid-cols-3 w-full pb-1 mb-1`}
    //         >
    //           <span>E. {op6}</span>
    //           <span className="text-center">
    //             {Object.hasOwn(options, op6)
    //               ? `(${options[op6]} Users Selected this option)`
    //               : '(0 Users Selected this option)'}
    //           </span>
    //           <span className="text-right">
    //             {Object.hasOwn(options, op6) ? `${percentage(options[op6], 100)}%` : '0%'}
    //           </span>
    //         </div>
    //       )}
    //     </div>
    //     {/* <p className="answer-content">{answer}</p> */}
    //   </div>
    // </div>
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
