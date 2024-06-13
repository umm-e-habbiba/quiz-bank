import React, { useState, useEffect, useRef } from 'react'
import AdminLayout from 'src/layout/AdminLayout'
import classNames from 'classnames'
import { API_URL } from 'src/store'
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
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
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
  cilArrowBottom,
  cilArrowTop,
  cilOptions,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from 'src/views/widgets/WidgetsBrand'
import WidgetsDropdown from 'src/views/widgets/WidgetsDropdown'
import MainChart from 'src/views/dashboard/MainChart'
const Admin = () => {
  const [allUsers, setAllUsers] = useState([])
  const [totalQuestions, setTotalQuestions] = useState('')
  const [totalExams, setTotalExams] = useState('')
  const [totalUserQuestions, setTotalUserQuestions] = useState('')
  const [userPendingQuestions, setUserPendingQuestions] = useState('')
  const [userApprovedQuestions, setUserApprovedQuestions] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getAllUsers()
      setToken(getToken)
    }
  }, [])

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])
  const getAllUsers = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'stats-counts', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.success) {
          setAllUsers(result.users)
          setTotalQuestions(result.totalMcqs)
          setTotalUserQuestions(result.totalUserMcqs)
          setUserApprovedQuestions(result.UserApprovedQuestions)
          setUserPendingQuestions(result.UserPEndingQuestions)
          setTotalExams(result.totalTests)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }

  return (
    <AdminLayout>
      {loader ? (
        <div className="text-center">
          <CSpinner className="bg-[#6261CC]" variant="grow" />
        </div>
      ) : (
        <div className="mx-4">
          <CRow className="mb-4" xs={{ gutter: 4 }}>
            <CCol sm={6} xl={3} xxl={3}>
              <CWidgetStatsA
                color="primary"
                value={<>{allUsers.length}</>}
                title="Total Users"
                chart={
                  <CChartLine
                    ref={widgetChartRef1}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-primary'),
                          data: [65, 59, 84, 84, 51, 55, 40],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: 30,
                          max: 89,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={3} xxl={3}>
              <CWidgetStatsA
                color="warning"
                value={<>{totalQuestions ? totalQuestions : 0}</>}
                title="Questions Added"
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={3} xxl={3}>
              <CWidgetStatsA
                color="info"
                value={<>{totalExams ? totalExams : 0}</>}
                title="Exams Added"
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={3} xxl={3}>
              <CWidgetStatsA
                color="danger"
                // value={<>{totalUserQuestions ? totalUserQuestions : 0}</>}
                value={
                  <>
                    {totalUserQuestions ? totalUserQuestions : 0}{' '}
                    <span className="fs-6 fw-normal">
                      ({userApprovedQuestions} Approved, {userPendingQuestions} Pending
                      {/* <CIcon icon={cilArrowTop} /> */})
                    </span>
                  </>
                }
                title="User's Questions"
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol xs>
              <CCard className="mb-4">
                <CCardHeader>Users</CCardHeader>
                <CCardBody>
                  <CTable align="middle" className="mb-0 border admin-tables" hover responsive>
                    <CTableHead className="text-nowrap">
                      <CTableRow>
                        <CTableHeaderCell className="bg-body-tertiary text-center">
                          <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">
                          Quiz Attempted
                        </CTableHeaderCell>
                        <CTableHeaderCell className="bg-body-tertiary">
                          Exams Attempted
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {/* {tableExample.map((item, index) => (
                      <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.user.name}</div>
                          <div className="small text-body-secondary text-nowrap">
                            <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                            {item.user.registered}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-between text-nowrap">
                            <div className="fw-semibold">{item.usage.value}%</div>
                            <div className="ms-3">
                              <small className="text-body-secondary">{item.usage.period}</small>
                            </div>
                          </div>
                          <CProgress thin color={item.usage.color} value={item.usage.value} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CIcon size="xl" icon={item.payment.icon} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small text-body-secondary text-nowrap">Last login</div>
                          <div className="fw-semibold text-nowrap">{item.activity}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))} */}
                      {allUsers && allUsers.length > 0 ? (
                        allUsers.map((user, index) => (
                          <CTableRow v-for="item in tableItems" key={index}>
                            <CTableDataCell className="text-center">
                              <CAvatar size="md" color="primary" textColor="white">
                                {user.firstName.substring(0, 2)}
                              </CAvatar>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{user.firstName + user.lastName}</div>
                              <div className="small text-body-secondary text-nowrap">
                                {user.email}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex justify-content-between text-nowrap">
                                <div className="fw-semibold">{user.attemptedQuizzes.length}</div>
                                {/* <div className="ms-3">
                           <small className="text-body-secondary">{item.usage.period}</small>
                         </div> */}
                              </div>
                              <CProgress
                                thin
                                // color="#4f4ea0"
                                color="primary"
                                value={user.attemptedQuizzes.length}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex justify-content-between text-nowrap">
                                <div className="fw-semibold">{user.attemptedTests.length}</div>
                                {/* <div className="ms-3">
                           <small className="text-body-secondary">{item.usage.period}</small>
                         </div> */}
                              </div>
                              <CProgress
                                thin
                                // color="#4f4ea0"
                                color="primary"
                                value={user.attemptedTests.length}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell className="text-center" colSpan={4}>
                            No users registered yet
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      )}
    </AdminLayout>
  )
}
export default Admin
