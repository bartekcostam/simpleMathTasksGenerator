import React, { useState } from 'react';

const NumberAxis = () => {
  const [numAxes, setNumAxes] = useState(1);
  const [minStart, setMinStart] = useState(-10);
  const [maxEnd, setMaxEnd] = useState(10);
  const [step, setStep] = useState(1);
  const [axesData, setAxesData] = useState([]);

  const generateAxes = () => {
    const newAxes = [];
    for (let i = 0; i < numAxes; i++) {
      const start = minStart; 
      const end = maxEnd; 
      const stepVal = step;

      const values = [];
      for (let v = start; v <= end; v += stepVal) {
        values.push(v);
      }

      const hiddenCount = Math.floor(values.length / 3);
      const hiddenIndices = new Set();
      while (hiddenIndices.size < hiddenCount) {
        hiddenIndices.add(Math.floor(Math.random() * values.length));
      }

      newAxes.push({ values, hiddenIndices });
    }
    setAxesData(newAxes);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Generate Number Axis Tasks</h2>
      <p>Use this tool to create number line exercises for your students. Students will fill in the missing numbers on the axis.</p>
      <div>
        <label>Number of Axes: </label>
        <input type="number" value={numAxes} onChange={(e) => setNumAxes(parseInt(e.target.value))}/>
      </div>
      <div>
        <label>Start Value: </label>
        <input type="number" value={minStart} onChange={(e) => setMinStart(parseInt(e.target.value))}/>
      </div>
      <div>
        <label>End Value: </label>
        <input type="number" value={maxEnd} onChange={(e) => setMaxEnd(parseInt(e.target.value))}/>
      </div>
      <div>
        <label>Step: </label>
        <input type="number" value={step} onChange={(e) => setStep(parseInt(e.target.value))}/>
      </div>
      <button onClick={generateAxes}>Generate</button>

      <div style={{ marginTop: '50px' }}>
        {axesData.map((axis, idx) => (
          <div key={idx} style={{ marginBottom: '50px' }}>
             {/* <h3>Axis {idx + 1}</h3> */}
            
            <div style={{height:'100px', position:'relative'}}>
              {/* Centered horizontal line */}
              <div style={{
                position:'absolute',
                top:'50%',
                left:0,
                right:0,
                borderBottom:'2px solid black',
                transform:'translateY(-50%)'
              }}>
              </div>
              {/* Arrow on the right end */}
              <div style={{
                position:'absolute',
                right:0,
                top:'50%',
                transform:'translateY(-50%)',
                width:'0',
                height:'0',
                borderLeft:'10px solid black',
                borderTop:'5px solid transparent',
                borderBottom:'5px solid transparent'
              }}></div>

              {axis.values.map((val, i) => {
                const totalRange = axis.values.length - 1;
                const leftPercent = (i / totalRange) * 100;
                return (
                  <div key={i} style={{
                    position:'absolute',
                    left: `${leftPercent}%`,
                    top:'60%',
                    transform:'translate(-50%, -50%)',
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center'
                  }}>
                    <div style={{ height:'30px', borderLeft:'2px solid black'}}></div>
                    <div style={{ fontSize: '20px', marginTop:'5px'}}>
                      {axis.hiddenIndices.has(i) ? '____' : val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberAxis;
