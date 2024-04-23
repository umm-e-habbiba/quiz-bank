import { CButton, CFormCheck } from '@coreui/react'
import React, { useState } from 'react'
import QuizFooter from 'src/components/quiz/QuizFooter'
import QuizHeader from 'src/components/quiz/QuizHeader'

const QuizLayout = () => {
  const [intro, setIntro] = useState(true)
  const [steps, setSteps] = useState(false)
  const [step1, setStep1] = useState(false)
  const [step2, setStep2] = useState(false)
  const [step3, setStep3] = useState(false)
  const [showQues, setShowQues] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('')

  const setTopic = (value) => {
    setSelectedTopic(value)
    setShowQues(true)
    setIntro(false)
    setSteps(false)
    setStep1(false)
    setStep2(false)
    setStep3(false)
    console.log(selectedTopic)
  }
  return (
    <div>
      <QuizHeader showQues={showQues} />
      <div className="wrapper d-flex flex-column min-h-[77vh]">
        {/* tutorial */}
        {intro && (
          <div className="flex flex-col">
            <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mx-auto mt-20 mb-10">
              <h3 className="font-bold text-center text-3xl mb-3">Tutorial</h3>
              <p className="text-center leading-6">
                Welcome to the USMLE Practice Question Bank Tutorial!
                <br />
                This tutorial will guide you through the features and
                <br />
                functionalities of our practice question bank to help you make
                <br />
                the most of your study time.
              </p>
            </div>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full"
              onClick={() => {
                setIntro(false)
                setSteps(true)
              }}
            >
              Next
            </CButton>
          </div>
        )}
        {/* select steps */}
        {steps && (
          <div className="flex flex-col bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mx-auto mt-20 mb-10">
            <h3 className="text-center text-3xl mb-3">Please select your Exam</h3>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                setIntro(false)
                setSteps(false)
                setStep1(true)
                setStep2(false)
                setStep3(false)
              }}
            >
              USMLE: <span className="font-bold">Step1</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                setIntro(false)
                setSteps(false)
                setStep1(false)
                setStep2(true)
                setStep3(false)
              }}
            >
              USMLE: <span className="font-bold">Step2</span>
            </CButton>
            <CButton
              color="primary"
              className="mx-auto px-5 rounded-full mb-3 text-xl"
              onClick={() => {
                setIntro(false)
                setSteps(false)
                setStep1(false)
                setStep2(false)
                setStep3(true)
              }}
            >
              USMLE: <span className="font-bold">Step3</span>
            </CButton>
          </div>
        )}
        {/* USMLE STEP 1 */}
        {step1 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step1</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer"
                onClick={() => setTopic('Microbiology')}
              >
                Microbiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Immunology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Histology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Anatomy
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Physiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Embryology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Biochemistry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Genetics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                General Pathology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Genreal Pharmacology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Behavioral sciences
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Biostatistics and epidemiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ethics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Cardiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Musculoskeletal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Neurology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Psychiatry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Gastrointestinal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                OB/GYN
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Nephrology/Urology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Dermatology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Pulmonology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Hematology/Oncology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Endocrinology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ophthalmology
              </div>
            </div>
          </div>
        )}
        {/* USMLE STEP 2 */}
        {step2 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step2</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Internal Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Surgery
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Pediatrics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Obstetrics and Gynecology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Psychiatry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Preventive Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Family Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Emergency Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Radiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Dermatology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ophthalmology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Otolaryngology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Orthopedics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Anesthesiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Geriatrics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ethics and Legal Issues in Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ethics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Cardiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Musculoskeletal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Neurology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Psychiatry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Gastrointestinal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                OB/GYN
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Nephrology/Urology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Dermatology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Pulmonology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Hematology/Oncology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Endocrinology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ophthalmology
              </div>
            </div>
          </div>
        )}
        {/* USMLE STEP 3 */}
        {step3 && (
          <div className=" text-black p-4 mx-auto mt-8 mb-10">
            <center>
              <CButton color="secondary" className="mx-auto px-7 rounded-full mb-5 text-2xl ">
                USMLE: <span className="font-bold">Step3</span>
              </CButton>
            </center>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Internal Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Surgery
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Pediatrics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Obstetrics and Gynecology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Psychiatry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Preventive Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Family Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Emergency Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Radiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Dermatology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ophthalmology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Otolaryngology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Orthopedics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Anesthesiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Geriatrics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ethics and Legal Issues in Medicine
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ethics
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Cardiology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Musculoskeletal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Neurology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Psychiatry
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Gastrointestinal
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                OB/GYN
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Nephrology/Urology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Dermatology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Pulmonology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Hematology/Oncology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Endocrinology
              </div>
              <div className="bg-gray-200 border-3 border-solid border-gray-400 p-2 text-black cursor-pointer">
                Ophthalmology
              </div>
            </div>
          </div>
        )}
        {/* Questions */}
        {showQues && (
          <div className="p-10">
            <p className="mb-5">
              In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
              demonstrate the visual form of a document or a typeface without relying on meaningful
              content. Lorem ipsum may be used as a placeholder before the final copy is available.
            </p>
            <div className="bg-gray-200 border-3 border-solid border-gray-400 text-black p-4 mb-3 w-64">
              <CFormCheck type="radio" name="q1" id="q1" label="Default radio" />
              <CFormCheck type="radio" name="q1" id="q1" label="Default radio" />
              <CFormCheck type="radio" name="q1" id="q1" label="Default radio" />
              <CFormCheck type="radio" name="q1" id="q1" label="Default radio" />
            </div>
            <CButton color="primary" className="mx-auto px-5 rounded-full">
              Submit
            </CButton>
          </div>
        )}
      </div>
      <QuizFooter />
    </div>
  )
}

export default QuizLayout
