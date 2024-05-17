import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilStarHalf, cilMoney } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav_bottom = [
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
