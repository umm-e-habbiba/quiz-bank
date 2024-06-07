import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from 'src/store'
import { AppHeader, AppSidebar } from 'src/components'
import { CAlert, CSpinner } from '@coreui/react'
import ReviewExamAccordion from './ReviewExamAccordion'
const ViewQuestions = () => {
  const navigate = useNavigate()
  let { id } = useParams()
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [examId, setExamId] = useState('')
  const [allQuestions, setAllQuestions] = useState([])
  const [allSections, setAllSections] = useState([])
  const [testName, setTestName] = useState('')
  const [activeIndex, setActiveIndex] = useState(null)
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
      setToken(getToken)
      getUSerQuestions(getUserId)
    } else {
      navigate('/login')
    }
  }, [])
  const getUSerQuestions = (id) => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'question-by-user/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false)
        // console.log('ques detail', result)
        if (result.data) {
          console.log('getExam', result)
          setAllQuestions(result.data)
        }
      })
      .catch((error) => {
        console.log('error', error)
        setLoader(false)
      })
  }
  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          {loader ? (
            <div className="text-center">
              <CSpinner color="success" variant="grow" />
            </div>
          ) : (
            <div className="mx-4 lg:mx-10 mb-5">
              <p className="text-2xl mb-1">Your Questions</p>
              {/* <p className="text-xl mb-1">{testName}</p> */}
              {allQuestions && allQuestions.length > 0 ? (
                allQuestions.map((q, index) => (
                  <ReviewExamAccordion
                    key={index}
                    question={q.question}
                    answer={q.correctAnswer}
                    op1={q.optionOne}
                    op2={q.optionTwo}
                    op3={q.optionThree}
                    op4={q.optionFour}
                    op5={q.optionFive}
                    op6={q.optionSix ? q.optionSix : ''}
                    isOpen={activeIndex === index}
                    onClick={() => handleItemClick(index)}
                    explanation={q.questionExplanation}
                    op1Exp={q.optionOneExplanation ? q.optionOneExplanation : ''}
                    op2Exp={q.optionTwoExplanation ? q.optionTwoExplanation : ''}
                    op3Exp={q.optionThreeExplanation ? q.optionThreeExplanation : ''}
                    op4Exp={q.optionFourExplanation ? q.optionFourExplanation : ''}
                    op5Exp={q.optionFiveExplanation ? q.optionFiveExplanation : ''}
                    op6Exp={q.optionSixExplanation ? q.optionSixExplanation : ''}
                    image={q.image ? q.image : ''}
                    imageTwo={q.imageTwo ? q.imageTwo : ''}
                    video={q.video ? q.video : ''}
                    isapproved={q.isApproved}
                  />
                ))
              ) : (
                <CAlert color="danger" className="middle-alert">
                  No questions added yet
                </CAlert>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ViewQuestions
