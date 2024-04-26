import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilNotes,
  cilPencil,
  cilSpeedometer,
  cilListFilter,
  cilBarChart,
  cilMagnifyingGlass,
  cilBook,
  cilCreditCard,
  cilCommentBubble,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Create Test',
    to: '/quiz',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Previous Tests',
    to: '/',
    icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Performance',
    to: '/',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Overall',
        to: '/quiz-performance',
      },
      {
        component: CNavItem,
        name: 'Reports',
        to: '/',
      },
      {
        component: CNavItem,
        name: 'Graphs',
        to: '/',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Search',
    to: '/',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Notes',
    to: '/',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'FlashCards',
    to: '/',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Notebook',
    to: '/',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Help',
    to: '/',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  },
]

export default _nav
