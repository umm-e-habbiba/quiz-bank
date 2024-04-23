import React, { useEffect, useRef, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CHeader, CHeaderNav, CNavLink, CNavItem, useColorModes, CFormCheck } from '@coreui/react'
import { HiMenuAlt4 } from 'react-icons/hi'
import {
  BiLeftArrow,
  BiRightArrow,
  BiFullscreen,
  BiExitFullscreen,
  BiSolidHelpCircle,
  BiZoomIn,
} from 'react-icons/bi'
import { FcCalculator } from 'react-icons/fc'
import { FiSettings } from 'react-icons/fi'
import noteIcon from '../../assets/images/post-it.png'
import markIcon from '../../assets/images/mark-flag.png'
import { ReactCalculator } from 'simple-react-calculator'
import ReactStickies from 'react-stickies'

const QuizHeader = ({ showQues }) => {
  const headerRef = useRef()
  const [fullscreen, setFullscreen] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState([])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const onChange = (notes) => {
    setNotes(notes)
  }

  const onSave = () => {
    // Make sure to delete the editorState before saving to backend
    console.log('save function called', notes)
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
  return (
    <>
      <CHeader position="sticky" className="mb-4 p-0 quiz-header px-4" ref={headerRef}>
        <div className="flex justify-start items-center">
          <HiMenuAlt4 className="quiz-icons cursor-pointer mr-2" />
          {showQues && (
            <div className="flex justify-start items-center">
              <h1 className="mr-5 text-2xl">Item 1 of 400</h1>
              <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center">
                  <CFormCheck inline id="inlineCheckbox1" value="marked" label="" />
                  <img src={markIcon} alt="mark icon" className="cursor-pointer w-5 h-5" />
                </div>
                <span className="text-xs">Mark</span>
              </div>
            </div>
          )}
        </div>
        <CHeaderNav className="d-md-flex">
          <CNavItem>
            <CNavLink
              to="/"
              as={NavLink}
              className="flex flex-col justify-center items-center mr-2"
            >
              <BiLeftArrow className="quiz-icons" />
              <span className="text-[#ffffffde]">Previous</span>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/" as={NavLink} className="flex flex-col justify-center items-center">
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
          <BiSolidHelpCircle className="quiz-icons mr-2 cursor-pointer" />
          <div onClick={() => setShowNotes((prevCheck) => !prevCheck)}>
            <img src={noteIcon} alt="notes icon" className="mr-2 cursor-pointer" />
          </div>
          <FcCalculator
            className="quiz-icons mr-2 cursor-pointer"
            onClick={() => setShowCalculator((prevCheck) => !prevCheck)}
          />
          <BiZoomIn className="quiz-icons mr-2 cursor-pointer" />
          <FiSettings className="quiz-icons cursor-pointer" />
        </CHeaderNav>
      </CHeader>
      {showCalculator && (
        <div className="fixed bottom-0 right-0">
          <ReactCalculator />
        </div>
      )}
      {showNotes && (
        // <div className="fixed bottom-0 right-0">
        <ReactStickies notes={notes} onChange={onChange} onSave={onSave} />
        // </div>
      )}
    </>
  )
}

export default QuizHeader
