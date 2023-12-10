import React from 'react'
import './Numbers.css'


const Numbers = ({tasks}) => {
  return (
    <div className="output">
        {tasks.map((task, index) => (
            <div key={index}> {task}</div>
        ))}

    </div>
  )
}

export default Numbers