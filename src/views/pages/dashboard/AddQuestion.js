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
} from '@coreui/react'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
const AddQuestion = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [op6, setOp6] = useState('')
  const [op1Exp, setOp1Exp] = useState('')
  const [op2Exp, setOp2Exp] = useState('')
  const [op3Exp, setOp3Exp] = useState('')
  const [op4Exp, setOp4Exp] = useState('')
  const [op5Exp, setOp5Exp] = useState('')
  const [op6Exp, setOp6Exp] = useState('')
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
      usmleStep: '',
      usmleCategory: '',
      question: '',
      op1: '',
      op2: '',
      op3: '',
      op4: '',
      op5: '',
      correct: '',
      explaination: '',
    },
  })
  const stepSelected = watch('usmleStep')
  const step1 = watch('op1')
  const step2 = watch('op2')
  const step3 = watch('op3')
  const step4 = watch('op4')
  const step5 = watch('op5')
  const step6 = watch('op6')
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUserID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])
  const addQuestion = (data) => {
    console.log('add function called', data)
    setSpinner(true)
    setError(false)
    setErrorMsg('')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    myHeaders.append('Content-Type', 'application/json')
    const raw = JSON.stringify({
      userId: userID,
      usmleStep: data.usmleStep,
      USMLE: data.usmleCategory,
      question: data.question,
      correctAnswer: data.correct,
      questionExplanation: data.explaination,
      optionOne: data.op1,
      optionTwo: data.op2,
      optionThree: data.op3,
      optionFour: data.op4,
      optionFive: data.op5,
      optionSix: op6 ? op6 : '',
      optionOneExplanation: op1Exp ? op1Exp : '',
      optionTwoExplanation: op2Exp ? op2Exp : '',
      optionThreeExplanation: op3Exp ? op3Exp : '',
      optionFourExplanation: op4Exp ? op4Exp : '',
      optionFiveExplanation: op5Exp ? op5Exp : '',
      optionSixExplanation: op6Exp ? op6Exp : '',
    })
    const requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'add-question-by-user', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setSpinner(false)
        if (result.success) {
          reset({})
          setOp6('')
          setOp1Exp('')
          setOp2Exp('')
          setOp3Exp('')
          setOp4Exp('')
          setOp5Exp('')
          setOp6Exp('')
          setSuccess(true)
          setSuccessMsg('Thank you! Your question is currently under review!')
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
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 mx-4 lg:mx-[10%] ">
          <section className=" py-1 bg-blueGray-50">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t  mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className="text-xl font-bold">Add Question</h6>
                  {/* <button
                    className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Settings
                  </button> */}
                </div>
                <hr className="mt-6 border-b-1 border-slate-600" />
                <p className="text-base mt-3 mb-6">
                  Feel free to add your own question to the ZAP-70 Q-Bank! You may want to use AI to
                  polish up the language. Please recognize that you will be greatly helping us reach
                  our project&apos;s completion faster by contributing, and you will definitely be
                  given credit for your addition(s)!{' '}
                  <span className="text-sm">
                    (Note: all content will be reviewed by AJ before being published.)
                  </span>
                </p>
                <hr className="mt-6 border-b-1 border-slate-600" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <CForm onSubmit={handleSubmit(addQuestion)}>
                  <h6 className="text-sm mt-3 mb-6 font-bold uppercase">Question Details</h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-xs font-bold mb-2"
                          htmlFor="usmleStep"
                        >
                          USMLE Step
                        </label>
                        <CFormSelect
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
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-xs font-bold mb-2"
                          htmlFor="usmleCategory"
                        >
                          USMLE Category
                        </label>
                        <CFormSelect
                          aria-label="usmle category"
                          id="usmleCategory"
                          defaultValue={getValues('usmleCategory')}
                          {...register('usmleCategory', { required: true })}
                          feedback="Please select USMLE Category."
                          invalid={errors.usmleCategory ? true : false}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        >
                          <option value="">Select USMLE Category</option>
                          {getValues('usmleStep') == '1' ? (
                            step1Categories.map((category, idx) => (
                              <option key={idx} value={category}>
                                {category}
                              </option>
                            ))
                          ) : getValues('usmleStep') == '2' ? (
                            step2Categories.map((category, idx) => (
                              <option key={idx} value={category}>
                                {category}
                              </option>
                            ))
                          ) : getValues('usmleStep') == '3' ? (
                            step3Categories.map((category, idx) => (
                              <option key={idx} value={category}>
                                {category}
                              </option>
                            ))
                          ) : (
                            <option disabled>Select Usmle Step first</option>
                          )}
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="w-full px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-xs font-bold mb-2"
                          htmlFor="question"
                        >
                          Question
                        </label>
                        <CFormTextarea
                          id="question"
                          rows={4}
                          defaultValue={getValues('question')}
                          {...register('question', { required: true })}
                          feedback="Please enter question."
                          invalid={errors.question ? true : false}
                          placeholder="Enter question here"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        ></CFormTextarea>
                      </div>
                    </div>
                  </div>

                  <hr className="mt-6 border-b-1 border-slate-600" />
                  <h6 className="text-sm mt-3 mb-6 font-bold uppercase">Options</h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-xs font-bold mb-2">Option One</label>
                        <CFormInput
                          type="text"
                          {...register('op1', { required: true })}
                          feedback="Option 1 is required"
                          invalid={errors.op1 ? true : false}
                          placeholder="Enter option one"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Option Two
                        </label>
                        <CFormInput
                          type="text"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          {...register('op2', { required: true })}
                          feedback="Option 2 is required"
                          invalid={errors.op2 ? true : false}
                          placeholder="Enter option two"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Option Three
                        </label>
                        <CFormInput
                          type="text"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          {...register('op3', { required: true })}
                          feedback="Option 3 is required"
                          invalid={errors.op3 ? true : false}
                          placeholder="Enter option three"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Option Four
                        </label>
                        <CFormInput
                          type="text"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          {...register('op4', { required: true })}
                          feedback="Option 4 is required"
                          invalid={errors.op4 ? true : false}
                          placeholder="Enter option four"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Option Five
                        </label>
                        <CFormInput
                          type="text"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          {...register('op5', { required: true })}
                          feedback="Option 5 is required"
                          invalid={errors.op5 ? true : false}
                          placeholder="Enter option five"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Option Six
                        </label>
                        <CFormInput
                          type="text"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => setOp6(e.target.value)}
                          value={op6}
                          placeholder="Enter option six"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-slate-600" />
                  <h6 className=" text-sm mt-3 mb-6 font-bold uppercase">Correct Answer</h6>
                  <div className="flex flex-wrap">
                    <div className="w-full px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase  text-xs font-bold mb-2"
                          htmlFor="correct"
                        >
                          Correct Answer
                        </label>
                        <CFormSelect
                          aria-label="correct option"
                          id="correct"
                          defaultValue={getValues('correct')}
                          options={
                            op6
                              ? [
                                  { label: 'Select Correct Option', value: '' },
                                  { label: getValues('op1'), value: getValues('op1') },
                                  { label: getValues('op2'), value: getValues('op2') },
                                  { label: getValues('op3'), value: getValues('op3') },
                                  { label: getValues('op4'), value: getValues('op4') },
                                  { label: getValues('op5'), value: getValues('op5') },
                                  { label: op6, value: op6 },
                                ]
                              : [
                                  { label: 'Select Correct Option', value: '' },
                                  { label: getValues('op1'), value: getValues('op1') },
                                  { label: getValues('op2'), value: getValues('op2') },
                                  { label: getValues('op3'), value: getValues('op3') },
                                  { label: getValues('op4'), value: getValues('op4') },
                                  { label: getValues('op5'), value: getValues('op5') },
                                ]
                          }
                          {...register('correct', { required: true })}
                          feedback="Please select correct option"
                          invalid={errors.correct ? true : false}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-slate-600" />

                  <h6 className=" text-sm mt-3 mb-6 font-bold uppercase">Explanation</h6>
                  <div className="flex flex-wrap">
                    <div className="w-full px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase  text-xs font-bold mb-2"
                          htmlFor="question"
                        >
                          Question Explanation
                        </label>
                        <CFormTextarea
                          id="explanation"
                          rows={4}
                          defaultValue={getValues('explaination')?.replace(
                            /\(Choice/g,
                            '<br/>• (Option',
                          )}
                          {...register('explaination', { required: true })}
                          feedback="Please enter question explanation."
                          invalid={errors.explaination ? true : false}
                          placeholder="Enter question explanation here"
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        ></CFormTextarea>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option One
                        </label>
                        <CFormInput
                          placeholder="first option explanation"
                          type="text"
                          onChange={(e) => setOp1Exp(e.target.value)}
                          value={op1Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option Two
                        </label>
                        <CFormInput
                          placeholder="second option explanation"
                          type="text"
                          onChange={(e) => setOp2Exp(e.target.value)}
                          value={op2Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option Three
                        </label>
                        <CFormInput
                          placeholder="Third option explanation"
                          type="text"
                          onChange={(e) => setOp3Exp(e.target.value)}
                          value={op3Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option Four
                        </label>
                        <CFormInput
                          placeholder="Forth option explanation"
                          type="text"
                          onChange={(e) => setOp4Exp(e.target.value)}
                          value={op4Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option Five
                        </label>
                        <CFormInput
                          placeholder="Fifth option explanation"
                          type="text"
                          onChange={(e) => setOp5Exp(e.target.value)}
                          value={op5Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-0 lg:px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase  text-xs font-bold mb-2">
                          Explain Option Six
                        </label>
                        <CFormInput
                          placeholder="Sixth option explanation"
                          type="text"
                          onChange={(e) => setOp6Exp(e.target.value)}
                          value={op6Exp}
                          className="border-0 px-3 py-3 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>
                  {error && <p className="text-red-600 my-3 px-4">{errorMsg}</p>}
                  <button
                    className="w-full bg-[#6261CC] text-white hover:bg-[#464592] font-bold uppercase text-xs mt-3 px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="Submit"
                    disabled={spinner ? true : false}
                  >
                    {spinner ? <CSpinner color="light" size="sm" /> : 'Add Question'}
                  </button>
                </CForm>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* success alert */}
      {success && (
        <CAlert color="success" className="success-alert">
          {successMsg}
        </CAlert>
      )}
    </div>
  )
}
export default AddQuestion
