import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilListFilter,
  cilBarChart,
  cilMagnifyingGlass,
  cilBook,
  cilStar,
  cilCreditCard,
  cilCommentBubble,
  cilCommentSquare,
  cilListRich,
  cilStarHalf,
  cilList,
  cilCloudUpload,
  cilCloud,
  cilUserX,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _admin_nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Quiz',
    to: '/manage-quiz',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Upload Questions',
    to: '/upload-questions',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Manage Exam',
    to: '/manage-exam',
    icon: <CIcon icon={cilListFilter} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Upload Full Length Exam',
    to: '/upload-full-length-exam',
    icon: <CIcon icon={cilCloud} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Questions Statistics',
    to: '/attempted-questions',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Comments',
    to: '/comments',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Feedbacks',
    to: '/manage-feedback',
    icon: <CIcon icon={cilStarHalf} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Questions By Users',
    to: '/manage-user-questions',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  },
]

export default _admin_nav
