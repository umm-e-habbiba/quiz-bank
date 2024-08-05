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

const ManageTestingUsers = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const role = localStorage.getItem('user') || ''
  const [error, setErrorr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [loader, setLoader] = useState(false)
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
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [progress, setProgress] = useState(0)
  const [totalQuestionsUpdated, setTotalQuestionsUpdated] = useState(0)
  const [totalNumbersOfQuestionsAllowedToUser, setTotalNumbersOfQuestionsAllowedToUser] =
    useState(0)

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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      stepsAllowed: '',
      subjectsAllowed: [],
    },
  })

  const step = watch('stepsAllowed')
  const subject = watch('subjectsAllowed')

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken && role == 'admin') {
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])

  const stepsAllowed = watch('stepsAllowed')

  useEffect(() => {
    if (stepsAllowed === 'all') {
      const step1_2 = step1Categories.concat(step2Categories)
      const allSteps = step1_2.concat(step3Categories)
      const allStepsFinal = removeDuplicates(allSteps)
      setValue(
        'subjectsAllowed',
        allStepsFinal.map((sub) => sub),
      )
    } else {
      // setValue('subjectsAllowed', [])
      console.log('selected step', stepsAllowed, 'subjects allowed', subject)
      if (stepsAllowed == 1) {
        setValue(
          'subjectsAllowed',
          step1Categories.filter((x) => subject.includes(x)),
        )
      }
      if (stepsAllowed == 2) {
        setValue(
          'subjectsAllowed',
          step2Categories.filter((x) => subject.includes(x)),
        )
      }
      if (stepsAllowed == 3) {
        setValue(
          'subjectsAllowed',
          step3Categories.filter((x) => subject.includes(x)),
        )
      }
    }
  }, [stepsAllowed])

  const handleStepsAllowedChange = (event) => {
    const newStep = event.target.value
    setValue('stepsAllowed', newStep)
  }

  const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index)
  }

  const onSelect = (selectedList, selectedItem) => {
    console.log('selectedList', selectedList, selectedItem)
    setValue(
      'subjectsAllowed',
      selectedList.map((sub) => sub.name),
    )
  }

  const onRemove = (selectedList, removedItem) => {
    console.log('selectedList', selectedList, removedItem)
  }

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
        setLoader(false)
        if (result.data) {
          setUsers(result.data)
          const totalNumberOfQuestionsUpdated = result.data.reduce((sum, user) => {
            return sum + (user.numberOfQuestionsUpdated || 0)
          }, 0)
          setTotalQuestionsUpdated(totalNumberOfQuestionsUpdated)
          const totalNumbersOfQuestionsAllowed = result.data.reduce((sum, user) => {
            return sum + (user.totalNumbersOfQuestionsAllowed || 0)
          }, 0)
          setTotalNumbersOfQuestionsAllowedToUser(totalNumbersOfQuestionsAllowed)
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

  const handleView = (user) => {
    setSelectedUser(user)
    setViewModalOpen(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setValue('firstName', user.firstName)
    setValue('lastName', user.lastName)
    setValue('email', user.email)
    setValue('password', user.password)
    setValue('stepsAllowed', user.stepsAllowed)
    setValue('subjectsAllowed', user.subjectsAllowed)
    // reset({
    //   firstname: user.firstName,
    //   lastname: user.lastName,
    //   email: user.email,
    //   password: user.password,
    //   stepsAllowed: user.stepsAllowed,
    //   subjectsAllowed: user.subjectsAllowed || [],
    // })
    setEditModalOpen(true)
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const submitEditForm = (data) => {
    axios
      .put(`${API_URL}edit-tester-user/${selectedUser._id}`, data, {
        headers: { Authorization: token },
      })
      .then(() => {
        setEditModalOpen(false)
        getAllUsers()
      })
      .catch((error) => {
        console.error(error)
        setError(true)
        setErrorMsg('Failed to update user.')
      })
  }

  const confirmDelete = () => {
    axios
      .delete(`${API_URL}delete-tester-user/${userToDelete._id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        setDeleteModalOpen(false)
        getAllUsers()
      })
      .catch((error) => {
        console.error(error)
        setError(true)
        setErrorMsg('Failed to delete user.')
      })
  }

  const handleRemove = (selectedList) => {
    setValue(
      'subjectsAllowed',
      selectedList.map((item) => item.name),
    )
  }

  return (
    <AdminLayout>
      <div className="">
        <CCard className="mb-4 mx-4">
          <CCardHeader className="flex justify-between items-center">
            <div className="flex flex-col">
              <strong>Manage Testing Users</strong>
              <span className="text-sm">
                Total Number of Questions Updated:{' '}
                <span className="font-bold">{totalQuestionsUpdated}</span>
                {/* <span className="font-bold">{totalNumbersOfQuestionsAllowedToUser}</span> */}
              </span>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable striped className="admin-tables">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="text-center">
                    First Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Last Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Steps Allowed
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Question Checked
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="text-center">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <CTableRow key={user._id}>
                      <CTableDataCell className="font-semibold pt-3 text-center">
                        {user.firstName}
                      </CTableDataCell>
                      <CTableDataCell className="font-semibold pt-3 text-center">
                        {user.lastName}
                      </CTableDataCell>
                      <CTableDataCell className="font-semibold pt-3 text-center">
                        {user.email}
                      </CTableDataCell>
                      <CTableDataCell className="font-semibold pt-3 text-center">
                        {user.stepsAllowed}
                      </CTableDataCell>
                      <CTableDataCell className="font-semibold pt-3 text-center">
                        {user.numberOfQuestionsUpdated} out of {user.totalNumbersOfQuestionsAllowed}
                      </CTableDataCell>
                      <CTableDataCell className="flex justify-center items-center">
                        <CButton
                          className="text-white bg-[#6261CC] hover:bg-[#4f4ea0] mr-3 my-2"
                          onClick={() => handleView(user)}
                          title="View"
                        >
                          <RiEyeLine className="my-1" />
                        </CButton>
                        <CButton
                          color="info"
                          className="text-white mr-3 my-2"
                          onClick={() => handleEdit(user)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          className="text-white my-2"
                          onClick={() => handleDelete(user)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell className="text-center" colSpan={6}>
                      No Users Found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </div>

      {/* View User Modal */}
      <CModal backdrop="static" visible={viewModalOpen} onClose={() => setViewModalOpen(false)} c>
        <CModalHeader>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedUser && (
            <div className="flex flex-col gap-3 mt-4 text-center mb-4">
              <p className="text-3xl font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p className="text-xl">{selectedUser.email}</p>
              <p>
                <strong>Usmle Step Allowed:</strong> {selectedUser.stepsAllowed}
              </p>
              {/* <p>
                <strong>Subjects Allowed:</strong> {selectedUser.subjectsAllowed.join(',     ')}
              </p> */}
              <strong>Usmle Cetagory Allowed:</strong>
              <ul className="list-decimal list-inside space-y-1 text-sm">
                {selectedUser.subjectsAllowed.map((subject, index) => (
                  <li key={index} className="text-gray-100">
                    {subject}
                  </li>
                ))}
              </ul>
              <p>
                This user has checked{' '}
                <span className="font-bold">{selectedUser.numberOfQuestionsUpdated}</span> questions
                out of{' '}
                <span className="font-bold">{selectedUser.totalNumbersOfQuestionsAllowed}</span>{' '}
                allowed questions
              </p>
            </div>
          )}
        </CModalBody>
        {/* <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalOpen(false)}>
            Close
          </CButton>
        </CModalFooter> */}
      </CModal>

      {/* Edit User Modal */}
      <CModal visible={editModalOpen} onClose={() => setEditModalOpen(false)} backdrop="static">
        <div className="">
          <CModalHeader>
            <CModalTitle>Edit User</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit(submitEditForm)}>
              <CFormLabel htmlFor="firstname">First Name</CFormLabel>
              <CFormInput
                id="firstname"
                {...register('firstName', { required: 'First Name is required' })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
              )}

              <CFormLabel htmlFor="lastname">Last Name</CFormLabel>
              <CFormInput
                id="lastname"
                {...register('lastName', { required: 'Last Name is required' })}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <CFormLabel htmlFor="password">Password</CFormLabel>
              <CFormInput id="password" type="text" {...register('password')} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              <CFormLabel htmlFor="stepsAllowed">Steps Allowed</CFormLabel>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormSelect
                    aria-label="steps allowed"
                    id="allowedSteps"
                    {...register('stepsAllowed', { required: 'Please select an allowed step' })}
                    feedback="Please select Allowed Step"
                    invalid={errors.stepsAllowed ? true : false}
                    defaultValue={getValues('stepsAllowed')}
                    onChange={handleStepsAllowedChange}
                  >
                    <option value="">Select Allowed Step</option>
                    <option value="1">Step 1</option>
                    <option value="2">Step 2</option>
                    <option value="3">Step 3</option>
                    <option value="all">All</option>
                  </CFormSelect>
                  {errors.stepsAllowed && (
                    <p className="text-red-500 text-sm">{errors.stepsAllowed.message}</p>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel>Subjects Allowed</CFormLabel>
                  {step === 'all' ? (
                    <>
                      <br />
                      <CFormLabel className="text-xs">All Subjects allowed</CFormLabel>
                    </>
                  ) : (
                    <Multiselect
                      options={
                        step === '1'
                          ? step1subjects
                          : step === '2'
                            ? step2subjects
                            : step === '3'
                              ? step3subjects
                              : []
                      }
                      selectedValues={getValues('subjectsAllowed').map((sub) => ({
                        name: sub,
                        id: sub,
                      }))}
                      showCheckbox={true}
                      onSelect={onSelect}
                      onRemove={handleRemove}
                      displayValue="name"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-800"
                    />
                  )}
                </CCol>
              </CRow>

              <div className="mt-8 flex gap-2">
                <CButton color="secondary" onClick={() => setEditModalOpen(false)}>
                  Close
                </CButton>
                <CButton type="submit" color="primary">
                  Save Changes
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </div>
      </CModal>

      {/* Delete User Modal */}
      <CModal backdrop="static" visible={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this user?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </AdminLayout>
  )
}

export default ManageTestingUsers
