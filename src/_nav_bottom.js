import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilStarHalf, cilMoney, cilBellExclamation } from '@coreui/icons'
import { CNavItem } from '@coreui/react'
const _nav_bottom = [
  {
    component: CNavItem,
    name: 'Notifications',
    to: '/notifications',
    icon: <CIcon icon={cilBellExclamation} customClassName="nav-icon" />,
    badge: {
      color: 'primary',
    },
  },
  {
    component: CNavItem,
    name: 'About Us',
    to: '/about-us',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Donations',
    to: '/donations',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Feedback',
    to: '/feedback',
    icon: <CIcon icon={cilStarHalf} customClassName="nav-icon" />,
  },
]

export default _nav_bottom
