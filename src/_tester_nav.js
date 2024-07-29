import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilListFilter, cilListRich } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _tester_nav = [
  {
    component: CNavItem,
    name: 'Manage Questions',
    to: '/tester-questions',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Exam',
    to: '/tester-exam',
    icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
  },
]

export default _tester_nav
