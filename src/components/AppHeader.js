import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderNav, CHeaderToggler, CNavLink, CNavItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const role = localStorage.getItem('user') || ''

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('score')
    localStorage.removeItem('userId')
    navigate('/login')
  }
  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{
            marginInlineStart: '-14px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <CIcon icon={cilMenu} size="lg" />
          <CHeaderNav className="d-none d-md-flex">
            <CNavItem>
              <CNavLink to={`${role == 'admin' ? '/admin' : '/'}`} as={NavLink}>
                Dashboard
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
        </CHeaderToggler>
        <CHeaderNav>
          {/* <AppHeaderDropdown /> */}
          <CNavItem>
            <CNavLink onClick={logout} className="cursor-pointer">
              <CIcon icon={cilAccountLogout} className="me-2" />
              Logout
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
