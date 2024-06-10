import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { Link, useNavigate } from 'react-router-dom'
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { API_URL } from 'src/store'
export const AppSidebarNav = ({ items }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userID, setUserID] = useState(localStorage.getItem('userId') || '')
  const [notifications, setNotifications] = useState([])
  // useEffect(() => {
  //   const getToken = localStorage.getItem('token')
  //   if (getToken) {
  //     getMyNotifications()
  //     setToken(getToken)
  //     const getUserId = localStorage.getItem('userId')
  //     setUserID(getUserId)
  //   }
  // }, [])

  // const getMyNotifications = () => {
  //   const myHeaders = new Headers()
  //   myHeaders.append('Authorization', token)
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   }
  //   fetch(API_URL + 'users-notifications/' + userID, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result)
  //       if (result.success) {
  //         setNotifications(result.notifications.filter((n) => n.isViewed == false))
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //     })
  // }
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
