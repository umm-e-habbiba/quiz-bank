import React, { useEffect, useState } from 'react'
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
import { cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
const UploadQuestions = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      usmleStep: '',
      usmleCategory: '',
      excelfile: '',
    },
  })
  const step = watch('usmleStep')
  useEffect(() => {
    // getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const uploadQuestion = (data) => {
    console.log('upload function called', data)
    setIsLoading(true)
    setErrorr(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)

    const formdata = new FormData()
    formdata.append('usmleStep', data.usmleStep)
    formdata.append('USMLE', data.usmleCategory)
    formdata.append('file', data.excelfile[0])
    const requestOptions = {
      method: 'POST',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'upload-questions', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.success) {
          reset({})
          setSuccess(true)
          setSuccessMsg('Questions added successfully')
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
            navigate('/manage-quiz')
          }, 3000)
        } else {
          setErrorr(true)
          setErrorMsg(result.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }
  return (
    <AdminLayout>
      <div className="mx-4">
        <p className="text-2xl">Upload Questions</p>
        <CForm onSubmit={handleSubmit(uploadQuestion)} className="my-3">
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormSelect
                label="USMLE Step"
                aria-label="usmle step"
                id="usmleStep"
                options={[
                  { label: 'Select USMLE Step', value: '' },
                  { label: 'Step 1', value: '1' },
                  { label: 'Step 2', value: '2' },
                  { label: 'Step 3', value: '3' },
                ]}
                {...register('usmleStep', { required: true })}
                feedback="Please select USMLE Step"
                invalid={errors.usmleStep ? true : false}
                defaultValue={getValues('usmleStep')}
                // onChange={(e) => setUsmleStep(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormSelect
                label="USMLE Category"
                aria-label="usmle category"
                id="usmleCategory"
                defaultValue={getValues('usmleCategory')}
                options={
                  step == '1'
                    ? [
                        { label: 'Select USMLE Category', value: '' },
                        { label: 'Microbiology', value: 'Microbiology' },
                        { label: 'Immunology', value: 'Immunology' },
                        { label: 'Histology', value: 'Histology' },
                        { label: 'Anatomy', value: 'Anatomy' },
                        { label: 'Physiology', value: 'Physiology' },
                        { label: 'Embryology', value: 'Embryology' },
                        { label: 'Biochemistry', value: 'Biochemistry' },
                      ]
                    : step == '2'
                      ? [
                          { label: 'Select USMLE Category', value: '' },
                          { label: 'Internal Medicine', value: 'Internal Medicine' },
                          { label: 'Surgery', value: 'Surgery' },
                          { label: 'Pediatrics', value: 'Pediatrics' },
                          {
                            label: 'Obstetrics and Gynecology',
                            value: 'Obstetrics and Gynecology',
                          },
                          { label: 'Psychiatry', value: 'Psychiatry' },
                          { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                          { label: 'Family Medicine', value: 'Family Medicine' },
                        ]
                      : step == '3'
                        ? [
                            { label: 'Select USMLE Category', value: '' },
                            { label: 'Internal Medicine', value: 'Internal Medicine' },
                            { label: 'Surgery', value: 'Surgery' },
                            { label: 'Pediatrics', value: 'Pediatrics' },
                            {
                              label: 'Obstetrics and Gynecology',
                              value: 'Obstetrics and Gynecology',
                            },
                            { label: 'Psychiatry', value: 'Psychiatry' },
                            { label: 'Preventive Medicine', value: 'Preventive Medicine' },
                            { label: 'Family Medicine', value: 'Family Medicine' },
                          ]
                        : [{ label: 'Select USMLE Category', value: '' }]
                }
                {...register('usmleCategory', { required: true })}
                feedback="Please select USMLE Category."
                invalid={errors.usmleCategory ? true : false}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                type="file"
                id="formFile"
                label="Upload Excel File"
                {...register('excelfile', { required: true })}
                feedback="Please upload Excel file."
                invalid={errors.excelfile ? true : false}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </CCol>
          </CRow>
          {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}
          <CButton color="primary" type="submit" disabled={loading ? true : false}>
            {loading ? <CSpinner color="light" size="sm" /> : 'Upload'}
          </CButton>
        </CForm>
      </div>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </AdminLayout>
  )
}
export default UploadQuestions
