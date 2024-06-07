import React, { useState } from 'react'

const Calculator = () => {
  const [input, setInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleClick = (value) => {
    setInput(input + value)
  }

  const handleClear = () => {
    setInput('')
    setErrorMessage('')
  }

  const handleCalculate = () => {
    try {
      const result = eval(input)
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation')
      }
      setInput(result.toString())
    } catch (error) {
      setErrorMessage('Error: Invalid expression')
    }
  }

  return (
    <div className="sm:w-full w-[60%]  mx-auto mt-10 p-4 bg-gray-300 rounded-lg">
      <input
        type="text"
        value={input}
        readOnly
        className="w-full p-2 mb-4 text-[30px] text-right border border-gray-300 rounded"
      />
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <div className="grid grid-cols-4 gap-2  ">
        <button
          onClick={() => handleClick('1')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md "
        >
          1
        </button>
        <button
          onClick={() => handleClick('2')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md "
        >
          2
        </button>
        <button
          onClick={() => handleClick('3')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          3
        </button>
        <button
          onClick={() => handleClick('+')}
          className="border transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          +
        </button>
        <button
          onClick={() => handleClick('4')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          4
        </button>
        <button
          onClick={() => handleClick('5')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          5
        </button>
        <button
          onClick={() => handleClick('6')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          6
        </button>
        <button
          onClick={() => handleClick('-')}
          className="border transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          -
        </button>
        <button
          onClick={() => handleClick('7')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          7
        </button>
        <button
          onClick={() => handleClick('8')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          8
        </button>
        <button
          onClick={() => handleClick('9')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          9
        </button>
        <button
          onClick={() => handleClick('*')}
          className="border transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          *
        </button>
        <button
          onClick={() => handleClick('0')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          0
        </button>
        <button
          onClick={() => handleClick('.')}
          className=" transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          .
        </button>
        <button
          onClick={handleClear}
          className="border transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          C
        </button>
        <button
          onClick={() => handleClick('/')}
          className="border transition-all text-[20px] sm:text-[30px] bg-white text-black rounded-md border-gray-600"
        >
          /
        </button>
        <button
          onClick={handleCalculate}
          className="col-span-4 btn bg-blue-500 hover:bg-blue-700 text-[20px] sm:text-[30px]"
        >
          =
        </button>
      </div>
    </div>
  )
}

export default Calculator
