import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
  CFormTextarea,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCommentBubble, cilArrowCircleBottom } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import AccordionQuestions from './AccordionQuestions'
import { RiArrowDropDownLine } from 'react-icons/ri'
const AttemptedQuestions = () => {
  const navigate = useNavigate()
  const [allQuestion, setAllQuestion] = useState([])
  const [allAttemptedQuestion, setAllAttemptedQuestion] = useState([])
  const [loader, setLoader] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [activeKey, setActiveKey] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [step1Questions, setStep1Questions] = useState('')
  const [step2Questions, setStep2Questions] = useState('')
  const [step3Questions, setStep3Questions] = useState('')
  const [showstep1Topics, setShowstep1Topics] = useState(true)
  const [showstep2Topics, setShowstep2Topics] = useState(false)
  const [showstep3Topics, setShowstep3Topics] = useState(false)
  const [showstep1Ques, setShowstep1Ques] = useState(false)
  const [showstep2Ques, setShowstep2Ques] = useState(false)
  const [showstep3Ques, setShowstep3Ques] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const contentHeight = useRef()
  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
  }
  const role = localStorage.getItem('user') || ''
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      getAllQuest()
      //   getAllAttemptedQuest()
      getAllAttemptedQuestAnalysis()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const getAllQuest = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'mcqs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setLoader(false)
        if (result.data) {
          setAllQuestion(result.data)
          const filterStep1Questions = result.data.filter((ques) => ques.usmleStep == 1)
          setStep1Questions(filterStep1Questions.length)
          const filterStep2Questions = result.data.filter((ques) => ques.usmleStep == 2)
          setStep2Questions(filterStep2Questions.length)
          const filterStep3Questions = result.data.filter((ques) => ques.usmleStep == 3)
          setStep3Questions(filterStep3Questions.length)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  //   const getAllAttemptedQuest = () => {
  //     // setLoader(true)
  //     const myHeaders = new Headers()
  //     myHeaders.append('Authorization', token)
  //     const requestOptions = {
  //       method: 'GET',
  //       headers: myHeaders,
  //       redirect: 'follow',
  //     }

  //     fetch(API_URL + 'attempted-questions', requestOptions)
  //       .then((response) => response.json())
  //       .then((result) => {
  //         console.log('attempted', result)
  //         setLoader(false)
  //         if (result.data) {
  //           setAllAttemptedQuestion(result.data)
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         setLoader(false)
  //       })
  //   }
  const getAllAttemptedQuestAnalysis = () => {
    // setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'all-questions', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('attempted analysis', result)
        setLoader(false)
        if (result.data) {
          setAllAttemptedQuestion(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  // const sortedCategories = step2Categories.slice().sort((a, b) => {
  //   const attemptsA = allAttemptedQuestion
  //     .filter((ques) => ques.details.USMLE === a && ques.details.usmleStep === 2)
  //     .reduce((acc, curr) => acc + curr.attempts, 0)
  //   const attemptsB = allAttemptedQuestion
  //     .filter((ques) => ques.details.USMLE === b && ques.details.usmleStep === 2)
  //     .reduce((acc, curr) => acc + curr.attempts, 0)
  //   return attemptsB - attemptsA
  // })
  const data = [
    {
      question: 'What are accordion components?',
      answer:
        'Accordion components are user interface elements used for organizing and presenting content in a collapsible manner. They typically consist of a header, content, and an expand/collapse action.',
    },
    {
      question: 'What are they used for?',
      answer:
        'They are commonly employed in various contexts, including FAQs, product descriptions, navigation menus, settings panels, and data tables, to save screen space and provide a structured and user-friendly interface for presenting information or options.',
    },
    {
      question: 'Accordion as a musical instrument',
      answer:
        'The accordion is a musical instrument with a keyboard and bellows. It produces sound by air passing over reeds when the player expands or compresses the bellows, used in various music genres.',
    },
    {
      question: 'Can I create an accordion component with a different framework?',
      answer:
        'Yes of course, it is very possible to create an accordion component with another framework.',
    },
  ]
  return (
    <AdminLayout>
      {loader ? (
        <div className="text-center">
          <CSpinner color="success" variant="grow" />
        </div>
      ) : (
        <div className="mx-4">
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                href="#!"
                active={activeKey === 1}
                className={activeKey === 1 ? 'active' : 'text-gray-400'}
                onClick={() => {
                  setActiveKey(1)
                  setShowstep1Topics(true)
                  setShowstep2Topics(false)
                  setShowstep3Topics(false)
                  setShowstep1Ques(false)
                  setShowstep2Ques(false)
                  setShowstep3Ques(false)
                }}
              >
                USMLE Step 1 <span className="text-yellow-800">({step1Questions} Qs)</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#!"
                active={activeKey === 2}
                className={activeKey === 2 ? 'active' : 'text-gray-400'}
                onClick={() => {
                  setActiveKey(2)
                  setShowstep1Topics(false)
                  setShowstep2Topics(true)
                  setShowstep3Topics(false)
                  setShowstep1Ques(false)
                  setShowstep2Ques(false)
                  setShowstep3Ques(false)
                }}
              >
                USMLE Step 2 <span className="text-yellow-800">({step2Questions} Qs)</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#!"
                className={activeKey === 3 ? 'active' : 'text-gray-400'}
                active={activeKey === 3}
                onClick={() => {
                  setActiveKey(3)
                  setShowstep1Topics(false)
                  setShowstep2Topics(false)
                  setShowstep3Topics(true)
                  setShowstep1Ques(false)
                  setShowstep2Ques(false)
                  setShowstep3Ques(false)
                }}
              >
                USMLE Step 3 <span className="text-yellow-800">({step3Questions} Qs)</span>
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
              {showstep1Topics && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-4 mx-4">
                  {step1Categories
                    .slice()
                    .sort((a, b) => {
                      const attemptsA = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === a && ques.details.usmleStep === 1)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      const attemptsB = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === b && ques.details.usmleStep === 1)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      return attemptsB - attemptsA
                    })
                    .map((category, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-lg hover:bg-gray-400 hover:border-gray-200 border-3 text-center border-solid border-gray-400 p-2 text-black cursor-pointer"
                        onClick={() => {
                          setShowstep1Ques(true)
                          setShowstep1Topics(false)
                          setSelectedCategory(category)
                        }}
                      >
                        <p className="text-xl">
                          {category}{' '}
                          <span className="text-yellow-800 text-sm font-semibold">
                            (
                            {
                              allQuestion.filter(
                                (ques) => ques.USMLE == category && ques.usmleStep == 1,
                              ).length
                            }{' '}
                            Qs)
                          </span>{' '}
                        </p>
                        <p className="text-sm">
                          <span className="text-yellow-800 text-sm font-semibold">
                            {allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE === category && ques.details.usmleStep === 1,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)}
                          </span>{' '}
                          Attempts For {category}
                        </p>
                      </div>
                    ))}
                </div>
              )}
              {showstep1Ques && (
                <div className="my-4 mx-4">
                  <div className="border-b w-fit flex flex-col pb-2">
                    <p className="text-xl">
                      {selectedCategory}{' '}
                      <span className="text-yellow-800 text-sm">
                        (
                        {
                          allQuestion.filter(
                            (ques) => ques.USMLE == selectedCategory && ques.usmleStep == 1,
                          ).length
                        }{' '}
                        Qs)
                      </span>{' '}
                    </p>
                    <p className="text-sm">
                      ({' '}
                      <span className="text-yellow-800">
                        {allAttemptedQuestion && allAttemptedQuestion.length > 0
                          ? allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE == selectedCategory &&
                                  ques.details.usmleStep == 1,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)
                          : 0}
                      </span>{' '}
                      ) Users Attempted {selectedCategory}
                    </p>
                  </div>
                  <div className="mt-4">
                    {allAttemptedQuestion &&
                    allAttemptedQuestion.length > 0 &&
                    allAttemptedQuestion.filter(
                      (ques) =>
                        ques.details.USMLE == selectedCategory && ques.details.usmleStep == 1,
                    ).length > 0 ? (
                      allAttemptedQuestion
                        .filter(
                          (ques) =>
                            ques.details.USMLE == selectedCategory && ques.details.usmleStep == 1,
                        )
                        .sort((a, b) => b.attempts - a.attempts) // Sorting attempted questions by attempts
                        .map((item, index) => (
                          <AccordionQuestions
                            key={index}
                            question={item.details?.question}
                            attempts={item.attempts}
                            answer={item.details?.correctAnswer}
                            op1={item.details?.optionOne}
                            op2={item.details?.optionTwo}
                            op3={item.details?.optionThree}
                            op4={item.details?.optionFour}
                            op5={item.details?.optionFive}
                            options={item.optionsCount}
                            op6={item.details?.optionSix ? item.details?.optionSix : ''}
                            isOpen={activeIndex === index}
                            onClick={() => handleItemClick(index)}
                          />
                        ))
                    ) : (
                      <div className="text-center align-center justify-center">
                        Sorry,No Attempted Questions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CTabPane>

            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
              {showstep2Topics && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-4 mx-4">
                  {step2Categories
                    .slice()
                    .sort((a, b) => {
                      const attemptsA = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === a && ques.details.usmleStep === 2)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      const attemptsB = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === b && ques.details.usmleStep === 2)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      return attemptsB - attemptsA
                    })
                    .map((category, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-lg hover:bg-gray-400 hover:border-gray-200 border-3 text-center border-solid border-gray-400 p-2 text-black cursor-pointer"
                        onClick={() => {
                          setShowstep2Ques(true)
                          setShowstep2Topics(false)
                          setSelectedCategory(category)
                        }}
                      >
                        <p className="text-xl">
                          {category}{' '}
                          <span className="text-yellow-800 text-sm font-semibold">
                            (
                            {
                              allQuestion.filter(
                                (ques) => ques.USMLE === category && ques.usmleStep === 2,
                              ).length
                            }{' '}
                            Qs)
                          </span>{' '}
                        </p>
                        <p className="text-sm">
                          <span className="text-yellow-800 text-sm font-semibold">
                            {allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE === category && ques.details.usmleStep === 2,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)}
                          </span>{' '}
                          Attempts For {category}
                        </p>
                      </div>
                    ))}
                </div>
              )}
              {showstep2Ques && (
                <div className="my-4 mx-4">
                  <div className="border-b w-fit flex flex-col pb-2">
                    <p className="text-xl">
                      {selectedCategory}{' '}
                      <span className="text-yellow-800 text-sm">
                        (
                        {
                          allQuestion.filter(
                            (ques) => ques.USMLE === selectedCategory && ques.usmleStep === 2,
                          ).length
                        }{' '}
                        Qs)
                      </span>{' '}
                    </p>
                    <p className="text-sm">
                      <span className="text-yellow-800">
                        {allAttemptedQuestion && allAttemptedQuestion.length > 0
                          ? allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE === selectedCategory &&
                                  ques.details.usmleStep === 2,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)
                          : 0}
                      </span>{' '}
                      Users Attempted {selectedCategory}
                    </p>
                  </div>
                  <div>
                    {allAttemptedQuestion &&
                    allAttemptedQuestion.length > 0 &&
                    allAttemptedQuestion.filter(
                      (ques) =>
                        ques.details.USMLE === selectedCategory && ques.details.usmleStep === 2,
                    ).length > 0 ? (
                      allAttemptedQuestion
                        .filter(
                          (ques) =>
                            ques.details.USMLE === selectedCategory && ques.details.usmleStep === 2,
                        )
                        .sort((a, b) => b.attempts - a.attempts) // Sorting attempted questions by attempts
                        .map((item, index) => (
                          <AccordionQuestions
                            key={index}
                            question={item.details?.question}
                            attempts={item.attempts}
                            answer={item.details?.correctAnswer}
                            op1={item.details?.optionOne}
                            op2={item.details?.optionTwo}
                            op3={item.details?.optionThree}
                            op4={item.details?.optionFour}
                            op5={item.details?.optionFive}
                            options={item.optionsCount}
                            op6={item.details?.optionSix ? item.details?.optionSix : ''}
                            isOpen={activeIndex === index}
                            onClick={() => handleItemClick(index)}
                          />
                        ))
                    ) : (
                      <div className="text-center align-center justify-center">
                        Sorry, No Attempted Questions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CTabPane>

            <CTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
              {showstep3Topics && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-4 mx-4">
                  {step3Categories
                    .slice()
                    .sort((a, b) => {
                      const attemptsA = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === a && ques.details.usmleStep === 3)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      const attemptsB = allAttemptedQuestion
                        .filter((ques) => ques.details.USMLE === b && ques.details.usmleStep === 3)
                        .reduce((acc, curr) => acc + curr.attempts, 0)
                      return attemptsB - attemptsA
                    })
                    .map((category, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-lg hover:bg-gray-400 hover:border-gray-200 border-3 text-center border-solid border-gray-400 p-2 text-black cursor-pointer"
                        onClick={() => {
                          setShowstep3Ques(true)
                          setShowstep3Topics(false)
                          setSelectedCategory(category)
                        }}
                      >
                        <p className="text-xl">
                          {category}{' '}
                          <span className="text-yellow-800 text-sm font-semibold">
                            (
                            {
                              allQuestion.filter(
                                (ques) => ques.USMLE == category && ques.usmleStep == 3,
                              ).length
                            }{' '}
                            Qs)
                          </span>{' '}
                        </p>
                        <p className="text-sm">
                          <span className="text-yellow-800 text-sm font-semibold">
                            {allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE === category && ques.details.usmleStep === 3,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)}
                          </span>{' '}
                          Attempts For {category}
                        </p>
                      </div>
                    ))}
                </div>
              )}
              {showstep3Ques && (
                <div className="my-4 mx-4">
                  <div className="border-b w-fit flex flex-col pb-2">
                    <p className="text-xl">
                      {selectedCategory}{' '}
                      <span className="text-yellow-800 text-sm">
                        (
                        {
                          allQuestion.filter(
                            (ques) => ques.USMLE == selectedCategory && ques.usmleStep == 3,
                          ).length
                        }{' '}
                        Qs)
                      </span>{' '}
                    </p>
                    <p className="text-sm">
                      <span className="text-yellow-800">
                        {allAttemptedQuestion && allAttemptedQuestion.length > 0
                          ? allAttemptedQuestion
                              .filter(
                                (ques) =>
                                  ques.details.USMLE == selectedCategory &&
                                  ques.details.usmleStep == 3,
                              )
                              .reduce((acc, curr) => acc + curr.attempts, 0)
                          : 0}
                      </span>{' '}
                      Attempts For {selectedCategory}
                    </p>
                  </div>
                  <div>
                    {allAttemptedQuestion &&
                    allAttemptedQuestion.length > 0 &&
                    allAttemptedQuestion.filter(
                      (ques) =>
                        ques.details.USMLE == selectedCategory && ques.details.usmleStep == 3,
                    ).length > 0 ? (
                      allAttemptedQuestion
                        .filter(
                          (ques) =>
                            ques.details.USMLE == selectedCategory && ques.details.usmleStep == 3,
                        )
                        .sort((a, b) => b.attempts - a.attempts) // Sorting attempted questions by attempts
                        .map((item, index) => (
                          <AccordionQuestions
                            key={index}
                            question={item.details?.question}
                            attempts={item.attempts}
                            answer={item.details?.correctAnswer}
                            op1={item.details?.optionOne}
                            op2={item.details?.optionTwo}
                            op3={item.details?.optionThree}
                            op4={item.details?.optionFour}
                            op5={item.details?.optionFive}
                            options={item.optionsCount}
                            op6={item.details?.optionSix ? item.details?.optionSix : ''}
                            isOpen={activeIndex === index}
                            onClick={() => handleItemClick(index)}
                          />
                        ))
                    ) : (
                      <div className="text-center align-center justify-center">
                        Sorry, No Attempted Questions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CTabPane>
          </CTabContent>
        </div>
      )}
    </AdminLayout>
  )
}
export default AttemptedQuestions
