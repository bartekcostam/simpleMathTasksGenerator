import './App.css';
import Numbers from '../components/Numbers';
import { useState } from 'react';

function GenerateMultiplication() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  const [numTasks, setNumTasks] = useState(5);
  const [tasks, setTasks] = useState([]);

  const handleGenerateTasks = (e) => {
    e.preventDefault();
    const generateTasks = [];
    
    for (let i = 0; i < numTasks; i++) {
      const num1 = Math.floor(Math.random() * (to - from + 1)) + from;
      const num2 = Math.floor(Math.random() * (to - from + 1)) + from;

      generateTasks.push(`${num1} × ${num2} =`);
    }
    setTasks(generateTasks);
  };

  return (
    <div className="App">
      <main>
        <header>Generate multiplication tasks...</header>
        <form onSubmit={handleGenerateTasks}>
          <input
            placeholder='From'
            type='number'
            value={from}
            onChange={(e) => setFrom(+e.target.value)}
          />
          <input
            placeholder='To'
            type='number'
            value={to}
            onChange={(e) => setTo(+e.target.value)}
          />
          <input
            placeholder='Number of tasks'
            type='number'
            value={numTasks}
            onChange={(e) => setNumTasks(+e.target.value)}
          />
          <button type='submit'>Generate</button>
        </form>
      </main>

      <Numbers tasks={tasks} />
    </div>
  );
}

export default GenerateMultiplication;