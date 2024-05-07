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
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

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
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'users', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.data) {
          setAllUsers(result.data)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <AdminLayout>
      <div className="mx-4">
        <CRow className="mb-4" xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              color="primary"
              value={<>{allUsers.length}</>}
              title="Users"
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
                    {allUsers && allUsers.length > 0
                      ? allUsers.map((user, index) => (
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
                              <CProgress thin color="info" value={user.attemptedQuizzes.length} />
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      : 'No users registered yet'}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </AdminLayout>
  )
}
export default Admin
