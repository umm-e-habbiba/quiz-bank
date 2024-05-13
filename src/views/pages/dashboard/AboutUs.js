import React from 'react'
import { AppHeader, AppSidebar } from 'src/components'
const AboutUs = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="flex justify-center items-center flex-col mx-40 my-20">
            <p className="text-3xl mb-3">About US</p>
            <p className="text-base/loose">
              The ZAP-70 Question Bank was produced by AJ, creator of AJmonics. AJ is a medical
              student whose life mission is to elevate the world with kindness, goodness, and insane
              creativity. He believes that medical students should not be paying a fraction of the
              portion that they pay - for the (often) inefficient and boring education that they
              get. This is why, after producing AJmonics.com, a platform of pixar-style animated
              video to enhance education and fun, he created ZAP-70, a free question bank for
              students to learn (and often have a good time too!).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
