import React from 'react'
import {useState} from 'react'
import './MissingNumbers.css'




const MissingNumbers = () => {

  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(0)
  const [generateNumbersArr, setGenerateNumbers] = useState([])
  
  const From = (event) =>{
    setFrom(parseInt(event.target.value),10)
    }
    const To = (event) =>{
      setTo(parseInt(event.target.value),10)
    }

    const generateNumbers = () => {
      let arr = []
      for(let i = from; i < to; i++) {
        const showNumber = Math.random() < 0.2
        arr.push(<div key={i} className="inline">{showNumber ? i : ''}</div>)
      }
       return setGenerateNumbers(arr)
    }


  return (
    <div>
    <div>Generate missing numbers</div>
      <input  type="number" placeholder="from" onChange={From}/>
      <input  type="number" placeholder="to" onChange={To}/>
      <button onClick={generateNumbers}> Generate</button>
      <hr></hr>
      {generateNumbersArr}

    </div>

  )
}

export default MissingNumbers