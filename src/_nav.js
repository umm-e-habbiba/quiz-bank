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
  cilInfo,
  cilStarHalf,
  cilMoney,
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
  // {
  //   component: CNavItem,
  //   name: 'Previous Tests',
  //   to: '/previous-tests',
  //   icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
  // },
  {
    component: CNavGroup,
    name: 'Performance',
    to: '/',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Latest Exam',
        to: '/quiz-performance',
      },
      {
        component: CNavItem,
        name: 'All Exams',
        to: '/previous-tests',
      },
      // {
      //   component: CNavItem,
      //   name: 'Graphs',
      //   to: '/graphs',
      // },
    ],
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
  // {
  //   component: CNavItem,
  //   name: 'Notes',
  //   to: '/notes',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'FlashCards',
  //   to: '/flashcards',
  //   icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'My Notebook',
  //   to: '/my-notebook',
  //   icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Help',
  //   to: '/help',
  //   icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  // },
]

export default _nav
