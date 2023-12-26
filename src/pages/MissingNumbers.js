import React, { useState } from 'react';
import './MissingNumbers.css';

const MissingNumbers = () => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const handleFromChange = (event) => {
    setFrom(parseInt(event.target.value, 10));
  };

  const handleToChange = (event) => {
    setTo(parseInt(event.target.value, 10));
  };

  const generateNumbers = () => {
    let arr = [];
    for (let i = from; i <= to; i++) {
      const showNumber = Math.random() < 0.2;
      arr.push(<div key={i} className="inline">{showNumber ? i : ''}</div>);
    }
    return arr;
  };

  return (
    <div>
      <div>Generate missing numbers</div>
      <input type="number" placeholder="from" onChange={handleFromChange} />
      <input type="number" placeholder="to" onChange={handleToChange} />
      <button onClick={generateNumbers}>Generate</button>
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      <hr />
      {generateNumbers()}
      
    </div>
  );
};

export default MissingNumbers;
