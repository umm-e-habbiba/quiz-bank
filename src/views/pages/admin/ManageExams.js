import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
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
  CSpinner,
  CAlert,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import AdminLayout from 'src/layout/AdminLayout'
import moment from 'moment'
const ManageExams = () => {
  //////
  const navigate = useNavigate()
  const [allExam, setAllExam] = useState([])

  const [detailModal, setDetailModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    getAllExams()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    console.log(progress)
  }, [progress])

  const getAllExams = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    fetch(API_URL + 'uploaded-tests', requestOptions)
      .then((response) => {
        const contentLength = response.headers.get('content-length')
        let loaded = 0
        return new Response(
          new ReadableStream({
            start(controller) {
              const reader = response.body.getReader()
              read()
              function read() {
                reader.read().then((progressEvent) => {
                  if (progressEvent.done) {
                    controller.close()
                    return
                  }
                  loaded += progressEvent.value.byteLength

                  const percentageComplete = Math.round((loaded / contentLength) * 100)
                  setProgress(percentageComplete)

                  controller.enqueue(progressEvent.value)
                  read()
                })
              }
            },
          }),
        )
      })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.data) {
          setAllExam(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const deleteExam = () => {
    setIsLoading(true)
    setErrorr(false)
    setErrorMsg('')
    var myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
    }

    fetch(API_URL + 'delete-test/' + examId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.success) {
          setDeleteModal(false)
          getAllExams()
          setSuccess(true)
          setSuccessMsg('Exam deleted successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setErrorr(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => console.log('error', error))
  }
  return (
    <AdminLayout>
      <>
        {loader ? (
          <div>
            <div className="flex flex-col gap-10 items-center mt-[25vh] mx-[15%]">
              <div className="lds-spinner -ml-8">
                {[...Array(12)].map((_, index) => (
                  <div key={index}></div>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-500 mt-2">
                <span className="text-[#6261CC]">{progress}%</span> Completed, Please wait while it
                get`s completed...
              </div>
              {/* <div className="w-[30%] h-2 bg-gray-400 rounded overflow-hidden ">
         <div className="h-full bg-[#6261CC]" style={{ width: `${progress}%` }}></div>
       </div> */}
              <CProgress color="primary" value={progress} className="my-3 w-full"></CProgress>
            </div>
          </div>
        ) : (
          <CCard className="mb-4 mx-4">
            <CCardHeader className="flex justify-between items-center">
              <div className="flex">
                <div className="flex flex-col">
                  <strong>Manage Exams</strong>
                  {!loader && allExam.length > 0 && (
                    <span className="text-sm">Total {allExam.length} exams added</span>
                  )}
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CTable striped className="admin-tables">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Exam Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Usmle Step</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total Questions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {allExam && allExam.length > 0 ? (
                    allExam.map((exam, idx) => (
                      <CTableRow key={idx}>
                        <CTableHeaderCell className="cursor-pointer">
                          {exam.testName}
                        </CTableHeaderCell>
                        <CTableDataCell>{exam.usmleStep}</CTableDataCell>
                        <CTableDataCell>{exam.questions?.length}</CTableDataCell>
                        <CTableDataCell>
                          {moment(exam.TestCreatedAt).format('DD MMMM YYYY, h:mm a')}
                        </CTableDataCell>
                        <CTableDataCell className="flex justify-start items-center">
                          <CButton
                            color="danger"
                            className="text-white my-2"
                            id={exam._id}
                            onClick={(e) => {
                              setDeleteModal(true)
                              setExamId(e.currentTarget.id)
                              setErrorr(false)
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
                        No Exams Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
              {/* )} */}
            </CCardBody>
          </CCard>
        )}
        {/* delete modal */}
        <CModal
          alignment="center"
          visible={deleteModal}
          onClose={() => setDeleteModal(false)}
          aria-labelledby="VerticallyCenteredExample"
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Delete Exam</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure to delete this exam?
            {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteModal(false)}>
              No
            </CButton>
            <CButton color="primary" onClick={deleteExam} disabled={loading ? true : false}>
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
export default ManageExams
