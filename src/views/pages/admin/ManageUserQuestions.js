import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CSpinner,
  CFormTextarea,
  CAlert,
  CFormCheck,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilTrash } from '@coreui/icons'
import { API_URL } from 'src/store'
import { useForm } from 'react-hook-form'
import AdminLayout from 'src/layout/AdminLayout'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
//////////
import JoditEditor from 'jodit-react'
import { RiEyeLine } from 'react-icons/ri'
/// video player
import '../../../../node_modules/video-react/dist/video-react.css' // import css
import { Player } from 'video-react'
import DropBox from 'src/components/admin/DropBox'
import { step1Categories, step2Categories, step3Categories } from 'src/usmleData'
const ManageUserQuestions = () => {
  return <div>ManageUserQuestions</div>
}
export default ManageUserQuestions
