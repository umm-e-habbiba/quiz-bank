import { CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader, AppSidebar } from 'src/components'
import { API_URL } from 'src/store'
const AboutUs = () => {
  const navigate = useNavigate()
  const [about, setAbout] = useState('')
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  useEffect(() => {
    const getToken = localStorage.getItem('token')
    if (getToken) {
      getAbout()
      setToken(getToken)
    } else {
      navigate('/login')
    }
  }, [])
  const getAbout = () => {
    setLoader(true)
    const myHeaders = new Headers()
    myHeaders.append('Authorization', token)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(API_URL + 'about-us', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setLoader(false)
        if (result.aboutUsText) {
          setAbout(result.aboutUsText)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoader(false)
      })
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="flex justify-center items-center flex-col mx-4 lg:mx-40 my-4 lg:my-20">
            <p className="text-3xl mb-3">About US</p>
            {loader ? (
              <div role="status" className="w-full animate-pulse mx-4">
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
                <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-200 w-full mb-2.5"></div>
              </div>
            ) : (
              <p className="text-base/loose text-center mx-4">{about}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
