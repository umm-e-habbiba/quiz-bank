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
    getMyNotifications()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUserID(getUserId)
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
  const deleteNotification = () => {
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'users/' + userID + '/' + 'notifications/' + notificationId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setSpinner(false)
        if (result.success) {
          setDeleteModal(false)
          getMyNotifications()
          setSuccess(true)
          setSuccessMsg('Notification deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => console.log('error', error))
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
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    })
                    .map((notification, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 rounded-lg shadow-lg"
                      >
                        {/* <span className="absolute flex justify-center items-center text-white w-10 h-4 me-3 bg-teal-500 rounded-full -top-1 -left-1 text-xs">
                          New
                        </span> */}
                        <button
                          className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                          //   id={notification._id}
                          onClick={(e) => {
                            setNotificationId(notification._id)
                            setDeleteModal(true)
                            setError(false)
                            setErrorMsg('')
                          }}
                        >
                          <RiCloseLine />
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
                              <p className="font-medium text-gray-900">
                                {notification.notificationTitle}
                              </p>
                              <p className="text-sm text-gray-500">
                                {notification.notificationBody}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 ml-3">
                            {moment(notification.createdAt).fromNow()}
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
      <CModal
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
export default Notifications
