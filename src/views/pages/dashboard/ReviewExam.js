import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from 'src/store'
import AdminLayout from 'src/layout/AdminLayout'
import { AppHeader, AppSidebar } from 'src/components'
import { CSpinner } from '@coreui/react'
import ReviewExamAccordion from './ReviewExamAccordion'
const ReviewExam = () => {
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
      getExam()
      setToken(getToken)
      setExamId(id)
    } else {
      navigate('/login')
    }
  }, [])
  const getExam = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'uploaded-test/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoader(false)
        // console.log('ques detail', result)
        if (result.data) {
          console.log('getExam', result)
          setAllQuestions(result.data.questions)
          setAllSections(result.data.sections)
          setTestName(result.data.testName)
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
            <div className="mx-10 mb-5">
              <p className="text-2xl mb-1">Review exam {testName}</p>
              {/* <p className="text-xl mb-1">{testName}</p> */}
              {allSections &&
                allSections.length > 0 &&
                allSections.map((section, index) => (
                  <div key={index}>
                    <p className="text-xl font-semibold">{section.section}</p>
                    {section.questions?.map((q, index) => (
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
                        isapproved={false}
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ReviewExam
