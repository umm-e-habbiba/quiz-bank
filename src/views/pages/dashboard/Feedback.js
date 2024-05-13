import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { AppHeader, AppSidebar } from 'src/components'
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
} from '@coreui/react'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
// import StarRatings from 'react-star-ratings'
import StarRating from 'react-star-rating'
import ReactStars from 'react-rating-stars-component'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
const Feedback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [feedbackId, setFeedbackId] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [loader, setLoader] = useState(false)
  const [allFeedbacks, setAllFeedbacks] = useState([])
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [activeKey, setActiveKey] = useState(1)
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      message: '',
      rating: 0,
      school: '',
    },
  })
  useEffect(() => {
    getAllFeedbacks()
    getMyFeedbacks()
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
    getFeedback()
  }, [feedbackId])
  const getFeedback = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'feedback/' + feedbackId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('ques detail', result)
        if (result.data) {
          reset({
            name: result.data.name,
            message: result.data.text,
            school: result.data.school,
            rating: result.data.rating,
          })
        }
      })
      .catch((error) => console.log('error', error))
  }
  const getAllFeedbacks = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'feedbacks', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.data) {
          setAllFeedbacks(result.data)
        }
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const getMyFeedbacks = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-feedbacks/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.data) {
          setMyFeedbacks(result.data)
        }
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const addfeedback = (data) => {
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    console.log('data', data)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', token)

    const raw = JSON.stringify({
      name: data.name,
      text: data.message,
      school: data.school,
      rating: data.rating,
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-feedback/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setFeedbackModal(false)
          setSpinner(false)
          getAllFeedbacks()
          reset({})
          setSuccess(true)
          setSuccessMsg('Feedback sent successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setSpinner(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setSpinner(false)
      })
  }
  const editFeedback = (data) => {
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    console.log('data', data)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', token)

    const raw = JSON.stringify({
      name: data.name,
      text: data.message,
      school: data.school,
      rating: data.rating,
    })

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(API_URL + 'edit-feedback/' + feedbackId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setFeedbackModal(false)
          setSpinner(false)
          getAllFeedbacks()
          getMyFeedbacks()
          reset({})
          setSuccess(true)
          setSuccessMsg('Feedback updated successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setSpinner(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setSpinner(false)
      })
  }
  const handleRating = (rate) => {
    setValue('rating', rate)

    // other logic
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 mx-4">
          <CNav variant="underline" role="tablist">
            <CNavItem>
              <CNavLink href="#!" active={activeKey === 1} onClick={() => setActiveKey(1)}>
                My Feedbacks
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#!" active={activeKey === 2} onClick={() => setActiveKey(2)}>
                All Feedbacks
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
              <div className="flex justify-between items-center my-2">
                <p className="text-2xl mb-1">My Feedbacks</p>
                <CButton
                  onClick={(e) => {
                    setFeedbackModal(true)
                    reset({})
                  }}
                  className="bg-[#d2652d] text-white hover:bg-[#d2642ddc]"
                >
                  Add Feedback
                </CButton>
              </div>
              {loader ? (
                <div className="text-center">
                  <CSpinner color="success" variant="grow" />
                </div>
              ) : myFeedbacks && myFeedbacks.length > 0 ? (
                <CRow>
                  {myFeedbacks.map((feedback, index) => (
                    <CCol sm={1} md={4} lg={4} key={index}>
                      <figure className="snip1533">
                        <figcaption>
                          <blockquote>
                            <p>{feedback.text}</p>
                          </blockquote>
                          <h3>{feedback.name}</h3>
                          <h4>{feedback.school}</h4>

                          <div className="flex justify-center items-center my-1">
                            <ReactStars
                              count={5}
                              size={34}
                              isHalf={true}
                              emptyIcon={<i className="far fa-star"></i>}
                              halfIcon={<i className="fa fa-star-half-alt"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#d2652d"
                              classNames="justify-center"
                              value={feedback.rating}
                              disabled={true}
                            />
                          </div>
                          <div className="my-2 flex justify-center items-center">
                            <div
                              id={feedback._id}
                              onClick={(e) => {
                                setFeedbackModal(true)
                                setFeedbackId(e.currentTarget.id)
                                setError(false)
                                setErrorMsg('')
                              }}
                              className="w-8 h-8 rounded-sm cursor-pointer bg-[#d2652d] flex justify-center items-center"
                              title="Edit feedback"
                            >
                              <CIcon icon={cilPencil} className="text-white" />
                            </div>
                          </div>
                        </figcaption>
                      </figure>
                    </CCol>
                  ))}
                </CRow>
              ) : (
                <center>No Feedbacks added yet</center>
              )}
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
              <p className="text-2xl mb-1 mt-2">All Feedbacks</p>
              {loader ? (
                <div className="text-center">
                  <CSpinner color="success" variant="grow" />
                </div>
              ) : allFeedbacks && allFeedbacks.length > 0 ? (
                <CRow>
                  {allFeedbacks.map((feedback, index) => (
                    <CCol sm={1} md={4} lg={4} key={index}>
                      <figure className="snip1533">
                        <figcaption>
                          <blockquote>
                            <p>{feedback.lastFeedback.text}</p>
                          </blockquote>
                          <h3>{feedback.lastFeedback.name}</h3>
                          <h4>{feedback.lastFeedback.school}</h4>

                          <div className="flex justify-center items-center my-1">
                            <ReactStars
                              count={5}
                              size={34}
                              isHalf={true}
                              emptyIcon={<i className="far fa-star"></i>}
                              halfIcon={<i className="fa fa-star-half-alt"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#d2652d"
                              classNames="justify-center"
                              value={feedback.lastFeedback.rating}
                              disabled={true}
                            />
                          </div>
                          <h4>{feedback.email}</h4>
                        </figcaption>
                      </figure>
                    </CCol>
                  ))}
                </CRow>
              ) : (
                <center>No Feedbacks added yet</center>
              )}
            </CTabPane>
          </CTabContent>
        </div>
      </div>
      {/* add feedback modal */}
      <CModal
        alignment="center"
        visible={feedbackModal}
        onClose={() => {
          setFeedbackModal(false)
          reset({})
        }}
        aria-labelledby="VerticallyCenteredExample"
        // scrollable={true}
        backdrop="static"
        size="sm"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Tell us what you think</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={feedbackId ? handleSubmit(editFeedback) : handleSubmit(addfeedback)}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  placeholder="Name"
                  type="text"
                  {...register('name', { required: true })}
                  feedback="Name is required"
                  invalid={errors.name ? true : false}
                  className="mb-2"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  placeholder="School"
                  type="text"
                  {...register('school', { required: true })}
                  feedback="School is required"
                  invalid={errors.school ? true : false}
                  className="mb-2"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormTextarea
                  type="text"
                  id="message"
                  rows={4}
                  placeholder="Your message"
                  {...register('message', { required: true })}
                  feedback="Message is required"
                  invalid={errors.message ? true : false}
                />
              </CCol>
            </CRow>
            <div className="flex justify-center items-center">
              <ReactStars
                count={5}
                onChange={handleRating}
                size={44}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#d2652d"
                required={true}
                classNames="justify-center"
                value={getValues('rating')}
              />
            </div>
            {errors.rating ? <span className="text-red-500 text-sm">Rating is required</span> : ''}
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
            {feedbackId ? (
              <button
                type="submit"
                className="w-full bg-[#d2652d] text-white hover:bg-[#d2642ddc] py-2"
                disabled={spinner ? true : false}
              >
                {spinner ? <CSpinner color="light" size="sm" /> : 'Save'}
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#d2652d] text-white hover:bg-[#d2642ddc] py-2"
                disabled={spinner ? true : false}
              >
                {spinner ? <CSpinner color="light" size="sm" /> : 'Submit'}
              </button>
            )}
          </CForm>
        </CModalBody>
      </CModal>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </div>
  )
}
export default Feedback
