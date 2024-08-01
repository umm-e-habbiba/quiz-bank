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
  CProgress,
  CProgressBar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
import AdminLayout from 'src/layout/AdminLayout'
import Multiselect from 'multiselect-react-dropdown'
import { RiEyeLine } from 'react-icons/ri'
import axios from 'axios'
const AddTesterUser = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [loader, setLoader] = useState(false)
  const [subjectsSelected, setSubjectsSelected] = useState([])
  const [step1subjects, setStep1Subjects] = useState(
    step1Categories.map((cate) => ({
      name: cate,
      id: cate,
    })),
  )
  const [step2subjects, setStep2Subjects] = useState(
    step2Categories.map((cate) => ({
      name: cate,
      id: cate,
    })),
  )
  const [step3subjects, setStep3Subjects] = useState(
    step3Categories.map((cate) => ({
      name: cate,
      id: cate,
    })),
  )

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
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      stepsAllowed: '',
      subjectsAllowed: [],
    },
  })
  const step = watch('stepsAllowed')
  const subject = watch('subjectsAllowed')
  useEffect(() => {
    // getAllQuest()
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    if (step == 'all') {
      const step1_2 = step1Categories.concat(step2Categories)
      const allSteps = step1_2.concat(step3Categories)
      const allStepsFinal = removeDuplicates(allSteps)
      setValue(
        'subjectsAllowed',
        allStepsFinal.map((sub) => sub),
      )
    }
    setSubjectsSelected([])
  }, [getValues('stepsAllowed')])

  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index)
  }
  const onSelect = (selectedList, selectedItem) => {
    console.log('selectedList', selectedList, selectedItem)
    setValue(
      'subjectsAllowed',
      selectedList.map((sub) => sub.name),
    )
    setSubjectsSelected(selectedList)
  }

  const onRemove = (selectedList, removedItem) => {
    console.log('selectedList', selectedList, removedItem)
    setSubjectsSelected(selectedList)
  }

  const addTesterUser = (data) => {
    setLoader(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password,
      stepsAllowed: data.stepsAllowed,
      subjectsAllowed: data.subjectsAllowed,
    })
    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-tester-user', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          setLoader(false)
          //   getAllQuest()
          reset({})
          setSuccess(true)
          setSuccessMsg(result.message)
          setSubjectsSelected([])
          setTimeout(() => {
            setSuccess(false)
            setSuccessMsg('')
          }, 3000)
        } else {
          setError(true)
          setErrorMsg(result.message)
          setLoader(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  const [users, setUsers] = useState([])
  const [progress, setProgress] = useState(0)

  const getAllUsers = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'get-tester-users', requestOptions)
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
        console.log('response data:', result)

        setLoader(false)
        if (result.data) {
          setUsers(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    setValue('subjectsAllowed', [])
  }, [getValues('stepsAllowed')])
  return (
    <AdminLayout>
      <div className="mx-4">
        <p className="text-2xl font-semibold">Add Doc/Students</p>

        <CForm onSubmit={handleSubmit(addTesterUser)} className="my-3">
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                placeholder="Enter first name"
                label="First Name"
                type="text"
                {...register('firstname', { required: true })}
                feedback="First name is required"
                invalid={errors.firstname ? true : false}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                placeholder="Enter last name"
                label="Last Name"
                type="text"
                {...register('lastname', { required: true })}
                feedback="Last name is required"
                invalid={errors.lastname ? true : false}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                placeholder="Enter email"
                label="Email"
                type="email"
                {...register('email', { required: true })}
                feedback="Email is required"
                invalid={errors.email ? true : false}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormInput
                placeholder="Enter password"
                label="Password"
                type="password"
                {...register('password', { required: true, minLength: 8 })}
                feedback="Password is required"
                invalid={errors.password ? true : false}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormSelect
                label="Steps allowed"
                aria-label="steps allowed"
                id="allowedSteps"
                options={[
                  { label: 'Select Allowed Step', value: '' },
                  { label: 'Step 1', value: '1' },
                  { label: 'Step 2', value: '2' },
                  { label: 'Step 3', value: '3' },
                  { label: 'All', value: 'all' },
                ]}
                {...register('stepsAllowed', { required: true })}
                feedback="Please select Allowed Step"
                invalid={errors.stepsAllowed ? true : false}
                defaultValue={getValues('stepsAllowed')}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel>Subjects Allowed</CFormLabel>
              {step == 'all' ? (
                <>
                  <br />
                  <CFormLabel className="text-xs">All Subjects all allowed</CFormLabel>
                </>
              ) : (
                <Multiselect
                  options={
                    step == 1
                      ? step1subjects
                      : step == 2
                        ? step2subjects
                        : step == 3
                          ? step3subjects
                          : []
                  } // Options to display in the dropdown
                  showCheckbox={true}
                  selectedValues={subjectsSelected} // Preselected value to persist in dropdown
                  onSelect={onSelect} // Function will trigger on select event
                  onRemove={onRemove}
                  displayValue="name"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-800"
                />
              )}
            </CCol>
          </CRow>

          {error && <p className="mt-3 text-base text-red-700">{errorMsg}</p>}

          <CButton color="primary" type="submit" disabled={loader ? true : false}>
            {loader ? <CSpinner color="light" size="sm" /> : 'Add Doc/Student'}
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

export default AddTesterUser
