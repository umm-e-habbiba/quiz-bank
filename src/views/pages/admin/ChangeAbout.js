import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'

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
import { FaRegEye } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { RiEyeLine, RiPencilFill, RiPencilLine } from 'react-icons/ri'
const ChangeAbout = () => {
  const navigate = useNavigate()
  const [editModal, setEditModal] = useState(false)
  const [about, setAbout] = useState('')
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [aboutId, setAboutId] = useState('')
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
      about: '',
    },
  })
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role === 'admin') {
      getAbout()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const getAbout = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'about-us', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.aboutUsText) {
          setValue('about', result.aboutUsText)
          setAboutId(result._id)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  const editAbout = (data) => {
    setLoading(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      aboutUsText: data.about,
    })
    const requestOptions = {
      method: 'PUT',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'edit-aboutus/' + aboutId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result.aboutUsText) {
          setEditModal(false)
          setLoading(false)
          getAbout()
          setAboutId('')
          reset({})
          setSuccess(true)
          setSuccessMsg('Updated successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.error)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }
  return (
    <AdminLayout>
      <div className="m-4">
        {loader ? (
          <center>
            <CSpinner color="primary" variant="grow" />
          </center>
        ) : (
          <>
            <div className="flex justify-between items-center mx-4">
              <div></div>
              <p className="text-3xl mb-3 text-center">About US</p>
              <CButton color="info" onClick={() => setEditModal(true)}>
                <RiPencilLine className="text-white" />
              </CButton>
            </div>
            <p className="text-base/loose text-center mx-4">{getValues('about')}</p>
          </>
        )}
        {/* edit about modal */}
        <CModal
          alignment="center"
          visible={editModal}
          backdrop="static"
          onClose={() => setEditModal(false)}
          aria-labelledby="FeedbackModalTitle"
          className="bg-transparent"
          size="lg"
        >
          <CModalHeader>
            <CModalTitle id="VerticallyCenteredExample">Edit</CModalTitle>
          </CModalHeader>
          <CModalBody className="pr-9">
            <CForm onSubmit={handleSubmit(editAbout)}>
              <CFormTextarea
                label="About Us"
                id="about"
                rows={7}
                defaultValue={getValues('about')}
                {...register('about', { required: true })}
                feedback="Please enter about us text."
                invalid={errors.about ? true : false}
                placeholder="Enter question explanation here"
                className="mb-3"
                // className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              ></CFormTextarea>
              {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
              <CButton
                color="primary"
                type="submit"
                disabled={loading ? true : false}
                className="flex justify-end items-end"
              >
                {loading ? <CSpinner color="light" size="sm" /> : 'Save'}
              </CButton>
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
    </AdminLayout>
  )
}
export default ChangeAbout
