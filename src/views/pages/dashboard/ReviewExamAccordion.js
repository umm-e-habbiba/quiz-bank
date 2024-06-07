import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from 'src/store'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { CCol, CRow } from '@coreui/react'
const ReviewExamAccordion = ({
  question,
  answer,
  op1,
  op2,
  op3,
  op4,
  op5,
  op6,
  explanation,
  op1Exp,
  op2Exp,
  op3Exp,
  op4Exp,
  op5Exp,
  op6Exp,
  image,
  imageTwo,
  video,
  isOpen,
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
  return (
    <div className="question-wrapper">
      <button className={`question-container ${isOpen ? 'active' : ''}`} onClick={onClick}>
        <p
          className="question-content text-xl font-normal"
          dangerouslySetInnerHTML={{
            __html: question,
            // __html: question.length > 120 ? question.substring(0, 120) + '...' : question,
          }}
        ></p>
        <div className="flex justify-end items-center">
          <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} />
        </div>
      </button>

      <div ref={contentHeight} className="answer-container" style={contentHeightStyle}>
        <p className="text-xl mb-1">Question</p>
        {image ? (
          <CRow className="mb-3">
            <CCol sm={12} md={8} lg={8}>
              <p
                className="question-content text-xl font-normal"
                dangerouslySetInnerHTML={{
                  __html: question,
                }}
              ></p>
            </CCol>
            <CCol sm={12} md={4} lg={4}>
              <img
                src={`${API_URL}uploads/testimages/${image}`}
                alt="question image"
                className="w-full h-52"
                loading="eager"
              />
            </CCol>
          </CRow>
        ) : (
          <p
            className="question-content text-xl font-normal"
            dangerouslySetInnerHTML={{
              __html: question,
            }}
          ></p>
        )}
        <div className="answer-content">
          {[op1, op2, op3, op4, op5, op6].map(
            (option, index) =>
              option && (
                <div
                  key={index}
                  className={`${option === answer ? 'text-green-500' : ''} border-b grid grid-cols-1 w-full pb-1 mb-1`}
                >
                  <span>
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              ),
          )}
        </div>
        <p className="text-xl mb-1">Explanation</p>
        {imageTwo ? (
          <CRow className="mb-3">
            <CCol sm={12} md={8} lg={8}>
              <p
                className="question-content text-xl font-normal"
                dangerouslySetInnerHTML={{
                  __html: question,
                }}
              ></p>
            </CCol>
            <CCol sm={12} md={4} lg={4}>
              <img
                src={`${API_URL}uploads/testimages/${imageTwo}`}
                alt="question image"
                className="w-full h-52"
                loading="eager"
              />
            </CCol>
          </CRow>
        ) : (
          <p
            className="question-content text-xl font-normal"
            dangerouslySetInnerHTML={{
              __html: explanation,
            }}
          ></p>
        )}
        {/* {video && (
          <video controls src={`${API_URL}uploads/videos/${video}`} className="my-3"></video>
        )} */}
        {op1Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice A)</span> {op1Exp}
          </p>
        )}
        {op2Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice B)</span> {op2Exp}
          </p>
        )}
        {op3Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice C)</span> {op3Exp}
          </p>
        )}
        {op4Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice D)</span> {op4Exp}
          </p>
        )}
        {op5Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice E)</span> {op5Exp}
          </p>
        )}
        {op6Exp && (
          <p className="mb-3">
            <span className="font-bold">(Choice F)</span> {op6Exp}
          </p>
        )}
      </div>
    </div>
  )
}
export default ReviewExamAccordion
