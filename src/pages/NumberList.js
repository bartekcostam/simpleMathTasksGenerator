import React from 'react'
import { useState } from 'react'
import './NumberList.css'




const NumberList = () => {
  const [numberList, setNumberList] = useState(0)

  const handleInputChange = (event) => {
    setNumberList(parseInt(event.target.value,10) || 0)
  }

  const renderBoxes = () => {
    let boxes = []
    for (let i = 0; i < numberList; i++) {
      boxes.push(<div key={i} className="box">{i}</div>)
    }
    return boxes
  }
  return (
    <div>
    <input type="number" placeholder='number to ...' onChange={handleInputChange} />
    <div>NumberList</div>
   
    {renderBoxes()}
    
    </div>
  )
}

export default NumberList