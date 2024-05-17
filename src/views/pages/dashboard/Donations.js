import CIcon from '@coreui/icons-react'
import { CButton } from '@coreui/react'
import React from 'react'
import { AppHeader, AppSidebar } from 'src/components'
import { RiPaypalFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
const Donations = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="flex justify-center items-center flex-col mx-40 my-20">
            <p className="text-3xl mb-1">Donations</p>
            <p className="text-base/loose text-center">
              No pressure, but if you have benefitted from my work
            </p>
            <p className="text-base/loose text-center">Please consider donating!!</p>
            <p className="text-base/loose text-center">
              Every donation, no matter how small, makes me feel truly appreciated for my hard work.
            </p>
            <p className="text-base/loose text-center">
              (And helps me produce better, more awesome content!)
            </p>
            <p className="text-base/loose text-center">From the bottom of my heart, Thank you.</p>
            <em>ajmonics@gmail.com</em>
            <Link to="https://www.paypal.com/pk/home" className="my-2" target="_blank">
              <CButton color="link" className="flex justify-center items-center no-underline">
                <RiPaypalFill />
                Donate now
              </CButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Donations
