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
  cilPlus,
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
    name: 'Create Quiz',
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
    name: 'Quiz Performance',
    to: '/',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Latest Quiz',
        to: '/quiz-performance',
      },
      {
        component: CNavItem,
        name: 'All Quizzes',
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
    name: 'Full Length Exam',
    to: '/full-length-exam',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Exam Performance',
    to: '/',
    icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Latest Exam',
        to: '/latest-exam',
      },
      {
        component: CNavItem,
        name: 'All Exams',
        to: '/previous-exams',
      },
      // {
      //   component: CNavItem,
      //   name: 'Graphs',
      //   to: '/graphs',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Added Questions ',
    to: '/',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add New',
        to: '/add-question',
      },
      {
        component: CNavItem,
        name: 'View All',
        to: '/view-questions',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Previous Exams',
  //   to: '/previous-exams',
  //   icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
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
