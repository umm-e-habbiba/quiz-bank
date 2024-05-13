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
              If you have found value in what we do and want to support us in creating more content
              like this, consider making a donation. Your contribution helps us continue our work
              and ensures that we can dedicate more time and resources to producing high-quality
              content.
            </p>
            <p className="text-base/loose text-center">
              Every donation, no matter how small, makes a difference and is greatly appreciated. It
              helps cover expenses such as hosting fees, software licenses, and the time invested in
              research and creation.
            </p>
            <p className="text-base/loose text-center">
              Your support enables us to keep providing valuable resources and services. Thank you
              for considering a donation to support our work. Together, we can make a difference.
            </p>
            <p className="text-base/loose text-center">
              If you had like to donate, simply click the link below. Thank you for your generosity!
            </p>
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
