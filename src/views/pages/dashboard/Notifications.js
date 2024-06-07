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
const Notifications = () => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [allNotifications, setAllNotifications] = useState([])
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
    // setLoader(true)
    // const myHeaders = new Headers()
    // myHeaders.append('Authorization', token)
    // const requestOptions = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   redirect: 'follow',
    // }
    // fetch(API_URL + 'feedbacks', requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (result.data) {
    //       setAllNotifications(result.data)
    //     }
    //     setLoader(false)
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //     setLoader(false)
    //   })
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
                <div className="relative border border-gray-200 rounded-lg shadow-lg">
                  {/* <button
                    onClick="return this.parentNode.remove()"
                    className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button> */}

                  <div className="flex justify-between items-center p-4">
                    <div className="flex">
                      <CAvatar size="md" color="primary" textColor="white">
                        {/* {user.firstName.substring(0, 2)} */}
                        JO
                      </CAvatar>
                      <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="max-w-xs text-sm text-gray-500 truncate">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
                          laborum?
                        </p>
                      </div>
                    </div>
                    <p className="max-w-xs text-sm text-gray-500 truncate">2 hours ago</p>
                  </div>
                </div>
                <div className="relative border border-gray-200 rounded-lg shadow-lg">
                  {/* <button
                    onClick="return this.parentNode.remove()"
                    className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button> */}

                  <div className="flex justify-between items-center p-4">
                    <div className="flex">
                      <CAvatar size="md" color="primary" textColor="white">
                        {/* {user.firstName.substring(0, 2)} */}
                        MI
                      </CAvatar>
                      <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-gray-900">Mike Doe</p>
                        <p className="max-w-xs text-sm text-gray-500 truncate">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
                          laborum?
                        </p>
                      </div>
                    </div>
                    <p className="max-w-xs text-sm text-gray-500 truncate">Yesterday</p>
                  </div>
                </div>
                <div className="relative border border-gray-200 rounded-lg shadow-lg">
                  {/* <button
                    onClick="return this.parentNode.remove()"
                    className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button> */}

                  <div className="flex justify-between items-center p-4">
                    <div className="flex">
                      <CAvatar size="md" color="primary" textColor="white">
                        {/* {user.firstName.substring(0, 2)} */}
                        JA
                      </CAvatar>
                      <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="max-w-xs text-sm text-gray-500 truncate">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
                          laborum?
                        </p>
                      </div>
                    </div>
                    <p className="max-w-xs text-sm text-gray-500 truncate">1 Month ago</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default Notifications
