import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from 'src/store'
import AdminLayout from 'src/layout/AdminLayout'
import { AppHeader, AppSidebar } from 'src/components'
import { CSpinner } from '@coreui/react'
const ReviewExam = () => {
  const navigate = useNavigate()
  let { id } = useParams()
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [examId, setExamId] = useState('')
  const [allQuestions, setAllQuestions] = useState([])
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
        <div className="body flex-grow-1 mx-[10%] ">
          {loader ? (
            <div className="text-center">
              <CSpinner color="success" variant="grow" />
            </div>
          ) : (
            <>
              <p className="text-2xl mb-1">Review Exam</p>
              <p className="text-xl mb-1">{testName}</p>
              {allQuestions &&
                allQuestions.length > 0 &&
                allQuestions.map((q, index) => <p key={index}>{q.question}</p>)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default ReviewExam
