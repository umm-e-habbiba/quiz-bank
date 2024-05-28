import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  CHeader,
  CHeaderNav,
  CNavLink,
  CNavItem,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CModalFooter,
  CButton,
  CSpinner,
  CAlert,
  CPopover,
  CFormSwitch,
} from '@coreui/react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'

import { HiHome, HiMenu } from 'react-icons/hi'
import {
  BiLeftArrow,
  BiRightArrow,
  BiFullscreen,
  BiExitFullscreen,
  BiSolidHelpCircle,
  BiZoomIn,
  BiZoomOut,
} from 'react-icons/bi'
import { FcCalculator } from 'react-icons/fc'
import { FiSettings } from 'react-icons/fi'
import noteIcon from '../../assets/images/post-it.png'
// import markIcon from '../../assets/images/mark-flag.png'
import markIcon from '../../assets/images/mark-icon.svg'
// import { ReactCalculator } from 'simple-react-calculator'
import ReactStickies from 'react-stickies'
import { API_URL } from 'src/store'
import { FaUndoAlt } from 'react-icons/fa'
import Calculator from './Calculator'
// isTimer={isTimer}
//         setIsTimer={setIsTimer}
const QuizHeader = ({
  currentQuestion,
  setCurrentQuestion,
  showQues,
  totalQues,
  filteredArray,
  fontSize,
  setFontSize,
  isTimer,
  setIsTimer,
  markedQuestions,
  setMarkedQuestions,
  undoHighlight,
  highlightStack,
  toggleSidebar,
}) => {
  const headerRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const [fullscreen, setFullscreen] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState([])
  const [selectedOption, setSelectedOption] = useState('')
  const [marked, setMarked] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [commentValue, setCommentValue] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentModal, setCommentModal] = useState(false)
  const [questionId, setQuestionId] = useState('')
  const [quizEnd, setQuizEnd] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [timer, setTimer] = useState(true)
  const [isUndoClicked, setIsUndoClicked] = useState(false)

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  // Function to toggle the calculator
  const toggleCalculator = () => {
    setShowCalculator((prevState) => !prevState) // Toggle the state
  }

  const onChange = (notes) => {
    setNotes(notes)
  }

  const onSave = () => {
    // Make sure to delete the editorState before saving to backend
    // console.log('save function called', notes)
    const notes = notes
    notes.map((note) => {
      delete note.editorState
    })
    // Make service call to save notes
    // Code goes here...
  }

  const toggleFullscreen = () => {
    setFullscreen((prevCheck) => !prevCheck)
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption('')
    }
    setMarked(false)
    setQuestionId('')
    setCommentValue('')
  }
  const handleNextQuestion = () => {
    if (currentQuestion + 1 < totalQues) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption('')
      setMarkedQuestions(markedQuestions.filter((id) => id !== questionId)) // Remove current question from marked questions
      setMarked(false)
      setQuestionId('')
      setCommentValue('')
    } else {
      setQuizEnd(true)
    }
  }

  const toggleMarked = (e) => {
    const questionNumber = currentQuestion
    const isMarked = markedQuestions.includes(questionNumber)

    if (!isMarked) {
      setMarkedQuestions([...markedQuestions, questionNumber])
    } else {
      setMarkedQuestions(markedQuestions.filter((num) => num !== questionNumber))
    }
  }

  const handleAddComment = () => {
    setCommentModal(true)
    setError(false)
    setErrorMsg('')
  }

  const addComment = () => {
    // console.log('comment', commentValue)
    setIsLoading(true)

    // Get the ID of the current question
    const currentQuestionId = filteredArray[currentQuestion]._id

    if (!currentQuestionId) {
      setError(true)
      setErrorMsg('Cannot find ID of the current question.')
      setIsLoading(false)
      return
    }

    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      commentText: commentValue,
    })

    let url = `${API_URL}add-comment/${currentQuestionId}`

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.success) {
          setCommentModal(false)
          setIsLoading(false)
          setSuccess(true)
          setSuccessMsg('Comment sent successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error('Error adding comment:', error)
        setIsLoading(false)
      })
  }
  return (
    <>
      <CHeader position="sticky" className="p-0 quiz-header px-4">
        <div className="flex justify-start items-center">
          {/* {showQues && ( */}
          <Link to="/">
            <HiHome className="quiz-icons transition-all hover:text-[#6261CC] cursor-pointer mr-2" />
          </Link>
          {/* )} */}
          {showQues && (
            <div className="flex justify-start items-center">
              <div className="flex justify-start items-center">
                <h1 className="mr-5 text-2xl">
                  Item {currentQuestion + 1} of {totalQues}
                </h1>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-center items-center">
                    <CFormCheck
                      inline
                      id={
                        filteredArray[currentQuestion] && filteredArray[currentQuestion].questionId
                          ? filteredArray[currentQuestion].questionId._id
                          : filteredArray[currentQuestion] && filteredArray[currentQuestion]._id
                            ? filteredArray[currentQuestion]._id
                            : ''
                      }
                      checked={markedQuestions.includes(currentQuestion)}
                      label=""
                      onChange={(e) => toggleMarked(e)}
                    />
                    <img src={markIcon} alt="mark icon" className="cursor-pointer w-5 h-5" />
                  </div>
                  <span className="text-xs">Mark</span>
                </div>
              </div>
              <CButton color="primary" className="ml-3" onClick={handleAddComment}>
                Add Comment
              </CButton>
              {location.pathname.includes('review-quiz') ? (
                ''
              ) : (
                <div className="p-1 ml-1">
                  {highlightStack.length > 0 ? (
                    <button
                      onClick={undoHighlight}
                      title="Undo Highlight"
                      className={`p-2 rounded-md hover:bg-gray-700 focus:outline-none transform transition-transform duration-200 hover:scale-90`}
                    >
                      <FaUndoAlt className="text-2xl" />
                    </button>
                  ) : null}
                </div>
              )}
              {/* {markedQuestions.length > 0 && (
                <CDropdown className="ml-3">
                  <CDropdownToggle color="secondary">Marked Questions</CDropdownToggle>
                  <CDropdownMenu>
                    {markedQuestions.map((questionNumber) => (
                      <CDropdownItem
                        key={questionNumber}
                        onClick={() => handleQuestionNavigation(questionNumber)}
                      >
                        Question No : {questionNumber}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              )} */}
            </div>
          )}
        </div>
        <CHeaderNav className="d-md-flex">
          <CNavItem>
            <CNavLink
              as={NavLink}
              className={`flex flex-col justify-center items-center mr-2 ${showQues && currentQuestion >= 1 ? '' : 'opacity-30'}`}
              disabled={showQues && currentQuestion >= 1 ? false : true}
              onClick={handlePrevQuestion}
            >
              <BiLeftArrow className="quiz-icons" />
              <span className="text-[#ffffffde]">Previous</span>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              as={NavLink}
              className={`flex flex-col justify-center items-center ${showQues && currentQuestion + 1 != totalQues ? '' : 'opacity-30'}`}
              disabled={showQues && currentQuestion + 1 != totalQues ? false : true}
              onClick={handleNextQuestion}
            >
              <BiRightArrow className="quiz-icons" />
              <span className="text-[#ffffffde]">Next</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="d-md-flex mr-2">
          {fullscreen ? (
            <BiExitFullscreen
              className="quiz-icons mr-2 cursor-pointer"
              onClick={toggleFullscreen}
            />
          ) : (
            <BiFullscreen className="quiz-icons mr-2 cursor-pointer" onClick={toggleFullscreen} />
          )}
          <CPopover content="Please email ajmonics@gmail.com" placement="bottom">
            <CButton color="link p-0">
              <BiSolidHelpCircle className="quiz-icons mr-2 cursor-pointer" />
            </CButton>
          </CPopover>
          <div onClick={() => setShowNotes((prevCheck) => !prevCheck)}>
            <img src={noteIcon} alt="notes icon" className="mr-2 cursor-pointer" />
          </div>
          <FcCalculator className="quiz-icons mr-2 cursor-pointer" onClick={toggleCalculator} />
          <BiZoomIn
            className="quiz-icons mr-2 cursor-pointer"
            onClick={() => setFontSize(fontSize + 1)}
          />
          {fontSize > 16 && showQues ? (
            <BiZoomOut
              className="quiz-icons mr-2 cursor-pointer"
              onClick={() => setFontSize(fontSize - 1)}
            />
          ) : (
            ''
          )}
          {/* {location.pathname == '/review-quiz' ? ( */}
          {location.pathname.includes('review-quiz') ? (
            <FiSettings className="quiz-icons cursor-pointer" />
          ) : (
            <CDropdown alignment="end">
              <CDropdownToggle className="border-none flex p-0 setting-toggle">
                <FiSettings className="quiz-icons cursor-pointer" />
              </CDropdownToggle>
              <CDropdownMenu className="p-3">
                <CFormSwitch
                  label="Timer"
                  id="formSwitchCheckChecked"
                  onChange={() => setIsTimer((prevCheck) => !prevCheck)}
                  defaultChecked={isTimer ? true : false}
                />
              </CDropdownMenu>
            </CDropdown>
          )}
          {/* <FiSettings className="quiz-icons cursor-pointer" /> */}
        </CHeaderNav>
      </CHeader>{' '}
      {showCalculator && (
        <div className="fixed bottom-20 right-0 z-50">
          <Calculator />
        </div>
      )}
      {showNotes && <ReactStickies notes={notes} onChange={onChange} onSave={onSave} />}
      {/* comment modal */}
      <CModal
        alignment="center"
        visible={commentModal}
        onClose={() => setCommentModal(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add Comment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Comment"
                  type="text"
                  id="comment"
                  value={commentValue}
                  placeholder="Add your comment"
                  onChange={(e) => setCommentValue(e.target.value)}
                />
              </CCol>
            </CRow>
            <p className="text-xs mt-3 text-red-400">{commentError}</p>
          </CForm>
          {error && <span className="text-red-400 my-3">{errorMsg}</span>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCommentModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={addComment} disabled={loading ? true : false}>
            {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </>
  )
}

export default QuizHeader
