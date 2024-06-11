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
  CFormCheck,
  CProgress,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import { RiCloseLine } from 'react-icons/ri'
import moment from 'moment'
const AddNotification = () => {
  const editor = useRef(null)
  const options = ['bold', 'italic', 'underline', 'image', 'table']
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
      defaultActionOnPaste: 'insert_as_text',
      defaultLineHeight: 1.5,
      enter: 'div',
      // options that we defined in above step.
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: true,
    }),
    [],
  )
  //////
  const navigate = useNavigate()
  const [spinner, setSpinner] = useState(false)
  const [loader, setLoader] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [allNotifications, setAllNotifications] = useState([])
  const [notificationId, setNotificationId] = useState()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
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
      title: '',
      body: '',
    },
  })

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      getAllNotifications()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const getAllNotifications = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'get-notifications', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
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
  const addNotification = (data) => {
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      notificationTitle: data.title,
      notificationBody: data.body,
    })
    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-notifications', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setSpinner(false)
        if (result.success) {
          setAddModal(false)
          getAllNotifications()
          reset({})
          setSuccess(true)
          setSuccessMsg('Notification Sent Successfully')
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
        console.error(error)
        setSpinner(false)
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

    fetch(API_URL + 'delete-notifications/' + notificationId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setSpinner(false)
        if (result.success) {
          setDeleteModal(false)
          getAllNotifications()
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
    <AdminLayout>
      <div className="mx-4">
        {loader ? (
          <div className="text-center">
            <CSpinner color="success" variant="grow" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="text-3xl">Notifications</p>
              <CButton
                className="text-white bg-[#6261CC]  hover:bg-[#4f4ea0] float-right"
                onClick={() => {
                  setAddModal(true)
                  setSpinner(false)
                  reset({})
                  setError(false)
                  setErrorMsg('')
                }}
              >
                Send Notification
              </CButton>
            </div>
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
                        <RiCloseLine className="text-black" />
                      </button>

                      <div className="flex justify-between items-center p-4">
                        <div className="flex w-full">
                          <CAvatar size="md" color="primary" textColor="white">
                            AJ
                          </CAvatar>
                          <div className="ml-3  overflow-hidden">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {notification.notificationTitle}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-white">
                              {notification.notificationBody}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 ml-3 dark:text-white">
                          {moment(notification.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-red-400 font-bold mt-5">
                  No notifications added yet
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* add modal */}
      <CModal
        alignment="center"
        visible={addModal}
        onClose={() => setAddModal(false)}
        aria-labelledby="VerticallyCenteredExample"
        // scrollable={true}
        size="lg"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">Add Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <CForm onSubmit={handleSubmit(addNotification)}>
              <div className="flex flex-wrap">
                <div className="w-full px-0 lg:px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase dark:text-slate-200 text-slate-600 text-xs font-bold mb-2"
                      htmlFor="question"
                    >
                      Notification Title
                    </label>
                    <CFormInput
                      type="text"
                      {...register('title', { required: true })}
                      feedback="Please enter notification title."
                      invalid={errors.title ? true : false}
                      placeholder="Enter title here"
                      className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
                <div className="w-full px-0 lg:px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase dark:text-slate-200 text-slate-600 text-xs font-bold mb-2"
                      htmlFor="question"
                    >
                      Notification Text
                    </label>
                    <CFormTextarea
                      id="body"
                      rows={4}
                      defaultValue={getValues('body')}
                      {...register('body', { required: true })}
                      feedback="Please enter notification text."
                      invalid={errors.body ? true : false}
                      placeholder="Enter notification here"
                      className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    ></CFormTextarea>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-600 my-3 px-4">{errorMsg}</p>}
              <button
                className="w-full bg-[#6261CC] text-white hover:bg-[#464592] font-bold uppercase text-xs mt-3 px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="Submit"
                disabled={spinner ? true : false}
              >
                {spinner ? <CSpinner color="light" size="sm" /> : 'Add Notification'}
              </button>
            </CForm>
          </div>
        </CModalBody>
        {/* <CModalFooter>
              <CButton color="secondary" onClick={() => setAddModal(false)}>
                Close
              </CButton>
              {questionId ? (
                <CButton color="primary" type="submit" disabled={loading ? true : false}>
                  {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
                </CButton>
              ) : (
                <CButton color="primary" type="submit" disabled={loading ? true : false}>
                  {loading ? <CSpinner color="light" size="sm" /> : 'Add'}
                </CButton>
              )}
            </CModalFooter> */}
        {/* </CForm> */}
      </CModal>
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
    </AdminLayout>
  )
}
export default AddNotification
