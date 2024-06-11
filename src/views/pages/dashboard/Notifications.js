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
  CAvatar,
} from '@coreui/react'
import { API_URL } from 'src/store'
import { RiCloseLine } from 'react-icons/ri'
const Notifications = () => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [deleteModal, setDeleteModal] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [allNotifications, setAllNotifications] = useState([])
  const [notificationId, setNotificationId] = useState()
  const [spinner, setSpinner] = useState(false)
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getMyNotifications()
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUserID(getUserId)
      setTimeout(() => {
        updateNotifications()
      }, 5000)
      const interval = setInterval(() => {
        getMyNotificationsWithoutLoader()
      }, 10000)
      return () => clearInterval(interval)
    } else {
      navigate('/login')
    }
  }, [])

  const getMyNotifications = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'users-notifications/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setAllNotifications(result.notifications)
        }
        setLoader(false)
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const getMyNotificationsWithoutLoader = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'users-notifications/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setAllNotifications(result.notifications)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const deleteNotification = (id) => {
    setError(false)
    setErrorMsg('')
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'users/' + userID + '/' + 'notifications/' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          getMyNotificationsWithoutLoader()
          // setDeleteModal(false)
          // setSuccess(true)
          // setSuccessMsg('Notification deleted successfully')
          // setTimeout(() => {
          //   setSuccess(false)
          //   setSuccessMsg('')
          // }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setTimeout(() => {
            setError(false)
            setErrorMsg('')
          }, 3000)
        }
      })
      .catch((error) => console.log('error', error))
  }
  const updateNotifications = () => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'update-user-notifications/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          getMyNotificationsWithoutLoader()
          window.localStorage.setItem('newNotifications', true)
          window.dispatchEvent(new Event('storage'))
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 mx-4 lg:mx-[10%] ">
          {loader ? (
            <div className="text-center">
              <CSpinner color="success" variant="grow" />
            </div>
          ) : (
            <>
              <p className="text-3xl mb-3">Notifications</p>
              <div className="flex flex-col gap-3">
                {allNotifications && allNotifications.length > 0 ? (
                  allNotifications
                    .sort((a, b) => {
                      return (
                        new Date(b.notification?.createdAt).getTime() -
                        new Date(a.notification?.createdAt).getTime()
                      )
                    })
                    .map((notification, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 rounded-lg shadow-lg"
                      >
                        {notification.isViewed == false && (
                          <span className="absolute flex justify-center items-center text-white w-10 h-4 me-3 bg-red-500 rounded-full -top-1 -left-1 text-xs">
                            New
                          </span>
                        )}
                        <button
                          className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                          //   id={notification._id}
                          onClick={(e) => {
                            deleteNotification(notification._id)
                            // setDeleteModal(true)
                            // setError(false)
                            // setErrorMsg('')
                          }}
                        >
                          <RiCloseLine className="text-black" />
                        </button>
                        <div className="flex justify-between items-center p-4">
                          <div className="flex w-full">
                            <div className="bg-[#5856D6] w-8 h-8 rounded-full hidden lg:flex justify-center items-center text-white">
                              AJ
                            </div>
                            <div className="ml-3 overflow-hidden">
                              <div className="bg-[#5856D6] w-8 h-8 rounded-full flex lg:hidden justify-center items-center text-white">
                                AJ
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {notification.notification?.notificationTitle}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-white">
                                {notification.notification?.notificationBody}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 ml-3 dark:text-gray-200">
                            {moment(notification.notification?.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <CAlert color="danger" className="middle-alert">
                    No notifications found
                  </CAlert>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* delete modal */}
      {/* <CModal
        alignment="center"
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Delete Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure to delete this notification?
          {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            No
          </CButton>
          <CButton color="primary" onClick={deleteNotification} disabled={spinner ? true : false}>
            {spinner ? <CSpinner color="light" size="sm" /> : 'Yes'}
          </CButton>
        </CModalFooter>
      </CModal> */}
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
      {error && (
        <CAlert color="success" className="success-alert">
          {errorMsg}
        </CAlert>
      )}
    </div>
  )
}
export default Notifications
