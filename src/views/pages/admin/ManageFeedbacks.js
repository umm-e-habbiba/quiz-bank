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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCommentBubble } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
const ManageFeedbacks = () => {
  const navigate = useNavigate()
  const [allFeedbacks, setAllFeedbacks] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [feedbackId, setFeedbackId] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    getAllFeedbacks()
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])

  const getAllFeedbacks = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'all-feedbacks', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setLoader(false)
        if (result.data) {
          setAllFeedbacks(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const deleteFeedback = () => {
    setIsLoading(true)
    setError(false)
    setErrorMsg('')
    console.log(feedbackId)
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'feedback/' + feedbackId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.success) {
          setDeleteModal(false)
          getAllFeedbacks()
          setSuccess(true)
          setSuccessMsg('Feedback deleted successfully')
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
      <>
        <CCard className="mb-4 mx-4">
          <CCardHeader className="flex justify-between items-center">
            <strong>Manage Feedbacks</strong>
          </CCardHeader>
          <CCardBody>
            {loader ? (
              <div className="text-center">
                <CSpinner color="success" variant="grow" />
              </div>
            ) : (
              <CTable striped className="admin-tables">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Feedback</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Rating</CTableHeaderCell>
                    <CTableHeaderCell scope="col">School</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {allFeedbacks && allFeedbacks.length > 0 ? (
                    allFeedbacks.map((feedback, idx) => (
                      <CTableRow key={idx}>
                        <CTableHeaderCell>{feedback.email}</CTableHeaderCell>
                        <CTableDataCell>{feedback.text}</CTableDataCell>
                        <CTableDataCell>{feedback.rating}</CTableDataCell>
                        <CTableDataCell>{feedback.school}</CTableDataCell>
                        <CTableDataCell>
                          {moment(feedback.feedbackCreatedAt).format('DD MMMM YYYY, h:mm a')}
                        </CTableDataCell>
                        <CTableDataCell className="flex justify-center items-center">
                          <CButton
                            color="danger"
                            className="text-white my-2"
                            id={feedback.feedbackId}
                            onClick={(e) => {
                              setDeleteModal(true)
                              setFeedbackId(e.currentTarget.id)
                              setError(false)
                              setErrorMsg('')
                            }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell className="text-center" colSpan={6}>
                        No Feedbacks added yet
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
        {/* delete modal */}
        <CModal
          alignment="center"
          visible={deleteModal}
          backdrop="static"
          onClose={() => setDeleteModal(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Delete feedback</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure to delete this feedback?
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteModal(false)}>
              No
            </CButton>
            <CButton color="primary" onClick={deleteFeedback} disabled={loading ? true : false}>
              {loading ? <CSpinner color="light" size="sm" /> : 'Yes'}
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
    </AdminLayout>
  )
}
export default ManageFeedbacks
