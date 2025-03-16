import './App.css';
import Numbers from '../components/Numbers';
import { useState } from 'react';

function GenerateSubstractions() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  const [numTasks, setNumTasks] = useState(5);
  const [tasks, setTasks] = useState([]);
  const [allowNegative, setAllowNegative] = useState(false);

  const handleGenerateTasks = (e) => {
    e.preventDefault();
    const generateTasks = [];
    
    for (let i = 0; i < numTasks; i++) {
      let num1 = Math.floor(Math.random() * (to - from + 1)) + from;
      let num2 = Math.floor(Math.random() * (to - from + 1)) + from;

      if (!allowNegative) {
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }
      }

      generateTasks.push(`${num1} - ${num2} =`);
    }
    setTasks(generateTasks);
  };

  return (
    <div className="App">
      <main>
        <header>Generate calculations...</header>
        <form onSubmit={handleGenerateTasks}>
          <input
            placeholder='from'
            value={from}
            onChange={(e) => setFrom(+e.target.value)}
          />
          <input
            placeholder='to'
            value={to}
            onChange={(e) => setTo(+e.target.value)}
          />
          <input
            placeholder='how many tasks?'
            value={numTasks}
            onChange={(e) => setNumTasks(+e.target.value)}
          />
          <button type='submit'>Generate tasks</button>
          
          <label className="checkbox-label">
            <input
              type='checkbox'
              checked={allowNegative}
              onChange={(e) => setAllowNegative(e.target.checked)}
            />
            wynik ujemny
          </label>

          <input type='checkbox' name='Two columns' id='twoColumns' />
        </form>
      </main>

      <Numbers tasks={tasks} />
    </div>
  );
}

export default GenerateSubstractions;