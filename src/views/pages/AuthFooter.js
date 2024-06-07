import React from 'react'
import { RiYoutubeFill, RiYoutubeLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
const AuthFooter = () => {
  return (
    <footer className="border-t-1 border-solid p-6  border-black/5 text-center text-surface/75 lg:text-left overflow-hidden h-[70px] flex justify-between items-center">
      <div className="hidden lg:block"></div>
      <div>
        <span>
          © 2024{' '}
          <Link
            to="https://www.ajmonics.com/"
            className="font-semibold text-[#35b18c]"
            target="_blank"
          >
            AJMonics
          </Link>
          . All rights reserved. Created by:{' '}
          <Link
            to="https://themksolution.com/"
            className="font-semibold text-[#35b18c]"
            target="_blank"
          >
            MK Solution
          </Link>
        </span>
      </div>
      <Link to="https://www.youtube.com/c/AJsMnemonics" target="_blank">
        <RiYoutubeFill className="text-2xl text-[#FF0000]" />
      </Link>
    </footer>
  )
}
export default AuthFooter
