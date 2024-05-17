import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useNavigate, Link } from 'react-router-dom'
import moment from 'moment'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CProgressBar,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { API_URL } from 'src/store'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const Dashboard = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUSerID] = useState(localStorage.getItem('userId') || '')
  const [allQuiz, setAllQuiz] = useState([])
  const [lastQuiz, setLastQuiz] = useState([])
  const [loading, setIsLoading] = useState(false)

  useEffect(() => {
    getAllQuiz()
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getAllQuiz()
      setToken(getToken)
      const getUserId = localStorage.getItem('userId')
      setUSerID(getUserId)
    } else {
      navigate('/login')
    }
  }, [])

  const getAllQuiz = () => {
    setIsLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'user-quizzes/' + userID, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setIsLoading(false)
        if (result.data) {
          setAllQuiz(result.data)
          setLastQuiz(result.data.slice(Math.max(result.data.length - 5, 0)))
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            {/* <CCardHeader>Traffic {' & '} Sales</CCardHeader> */}
            <CCardBody>
              {loading ? (
                <CRow>
                  <CCol md={12}>
                    <div className="text-center">
                      <CSpinner color="primary" variant="grow" />
                    </div>
                  </CCol>
                </CRow>
              ) : (
                <>
                  <CRow>
                    <CCol xs={12} md={12} xl={12}>
                      <CRow className="mb-0 pb-3">
                        <CCol xs={6}>
                          <div className="border-start border-start-4 border-start-info py-1 px-3">
                            <div className="text-body-secondary text-truncate small">
                              Exams Attempted
                            </div>
                            <div className="fs-5 fw-semibold">{allQuiz.length}</div>
                          </div>
                        </CCol>
                        <CCol xs={6}>
                          <div className="py-1 px-3 mb-3 flex justify-end items-center">
                            <Link to="/previous-tests">
                              <CButton className="bg-[#6261CC] text-white hover:bg-[#484796]">
                                Previous Exams
                              </CButton>
                            </Link>
                          </div>
                        </CCol>
                      </CRow>
                      <hr className="mt-0" />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12} md={6} xl={6}>
                      <div className="pt-3">
                        {allQuiz && allQuiz.length > 0 ? (
                          <>
                            <h4 className="my-2">Last attempted quizzes</h4>
                            {allQuiz.slice(Math.max(allQuiz.length - 5, 0)).map((quiz, idx) => (
                              <div className="progress-group mb-4" key={idx}>
                                <div className="progress-group-prepend">
                                  <span className="text-body-secondary small mr-2">
                                    {moment(quiz.createdAt).format('DD MMMM YYYY, h:mm a')}
                                  </span>
                                </div>
                                <div className="progress-group-bars">
                                  <CProgress
                                    height={10}
                                    // bg-[#6261CC] text-white hover:bg-[#484796]
                                    color="#6261CC"
                                    value={Math.round((100 * quiz.obtainedScore) / quiz.totalScore)}
                                  >
                                    <CProgressBar>
                                      {Math.round((100 * quiz.obtainedScore) / quiz.totalScore)}%
                                    </CProgressBar>
                                  </CProgress>
                                  {/* <CProgress
                              height={10}
                              color="info"
                              value={Math.round((100 * quiz.obtainedScore) / quiz.totalScore)}
                            /> */}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <CProgress thin color="info" value={0} />
                        )}
                        {/* {progressGroupExample1.map((item, index) => (
                      <div className="progress-group mb-4" key={index}>
                        <div className="progress-group-prepend">
                          <span className="text-body-secondary small">{item.title}</span>
                        </div>
                        <div className="progress-group-bars">
                          <CProgress thin color="info" value={item.value1} />
                          <CProgress thin color="danger" value={item.value2} />
                        </div>
                      </div>
                    ))} */}
                      </div>
                    </CCol>
                    {/* <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol> */}
                  </CRow>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
