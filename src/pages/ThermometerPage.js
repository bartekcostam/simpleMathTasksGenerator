import React, { useState } from 'react';
import Thermometer from '../components/Thermometer';

const ThermometerPage = () => {
  const [minTemp, setMinTemp] = useState(-10);
  const [maxTemp, setMaxTemp] = useState(20);
  const [numberOfThermometers, setNumberOfThermometers] = useState(5);
  const [temperatures, setTemperatures] = useState([]);

  const generateTemperatures = () => {
    const temps = [];
    for (let i = 0; i < numberOfThermometers; i++) {
      const temp = Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
      temps.push(temp);
    }
    setTemperatures(temps);
  };

  return (
    <div style={{ textAlign: 'center', fontSize: '20px' }}>
      <h1>Thermometer Generator</h1>
      <div>
        <label>
          Temperature From:
          <input
            type="number"
            value={minTemp}
            onChange={(e) => setMinTemp(parseInt(e.target.value))}
            style={{ margin: '10px' }}
          />
        </label>
        <label>
          Temperature To:
          <input
            type="number"
            value={maxTemp}
            onChange={(e) => setMaxTemp(parseInt(e.target.value))}
            style={{ margin: '10px' }}
          />
        </label>
        <label>
          Number of Thermometers:
          <input
            type="number"
            value={numberOfThermometers}
            onChange={(e) => setNumberOfThermometers(parseInt(e.target.value))}
            style={{ margin: '10px' }}
          />
        </label>
        <br />
        <button onClick={generateTemperatures}>Generate</button>
      </div>
      <div>
        {temperatures.map((temp, index) => (
          <Thermometer key={index} temperature={temp} minTemp={minTemp} maxTemp={maxTemp} />
        ))}
      </div>
    </div>
  );
};

export default ThermometerPage;
