import './App.css';
import Numbers from '../components/Numbers';
import { useState } from 'react';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Multiplication() {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(10);
  const [numTasks, setNumTasks] = useState(5);
  const [numOperands, setNumOperands] = useState(2);
  const [maxResult, setMaxResult] = useState(50);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const handleUseTwo = () => setNumOperands(2);
  const handleUseThree = () => setNumOperands(3);

  const handleGenerateTasks = (e) => {
    e.preventDefault();

    const safeFrom = Math.max(0, Math.trunc(from));
    const safeTo = Math.max(0, Math.trunc(to));
    const rangeStart = Math.min(safeFrom, safeTo);
    const rangeEnd = Math.max(safeFrom, safeTo);
    const safeNumTasks = Math.max(1, Math.trunc(numTasks));
    const safeMaxResult = Math.max(0, Math.trunc(maxResult));
    const smallestPossibleResult = rangeStart ** numOperands;

    if (smallestPossibleResult > safeMaxResult) {
      setTasks([]);
      setMessage('No tasks can be generated for this range and max result.');
      return;
    }

    const generated = [];
    const maxAttempts = safeNumTasks * 200;
    let attempts = 0;

    while (generated.length < safeNumTasks && attempts < maxAttempts) {
      attempts += 1;

      const nums = [];
      for (let i = 0; i < numOperands; i++) {
        nums.push(getRandomInt(rangeStart, rangeEnd));
      }

      const result = nums.reduce((total, current) => total * current, 1);

      if (result <= safeMaxResult) {
        generated.push(`${nums.join(' × ')} =`);
      }
    }

    setTasks(generated);

    if (generated.length < safeNumTasks) {
      setMessage(`Generated ${generated.length} of ${safeNumTasks} tasks. Try a higher max result or a smaller range.`);
      return;
    }

    setMessage('');
  };

  return (
    <div className="App">
      <main>
        <header>
          <h1>Generate Multiplication</h1>
          <div style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handleUseTwo}
              style={{
                fontWeight: numOperands === 2 ? 'bold' : 'normal',
                marginRight: '0.5rem'
              }}
            >
              Multiplication of 2 numbers
            </button>
            <button
              type="button"
              onClick={handleUseThree}
              style={{
                fontWeight: numOperands === 3 ? 'bold' : 'normal'
              }}
            >
              Multiplication of 3 numbers
            </button>
          </div>
        </header>

        <form onSubmit={handleGenerateTasks}>
          <input
            placeholder="from"
            type="number"
            min="0"
            value={from}
            onChange={(e) => setFrom(+e.target.value)}
          />
          <input
            placeholder="to"
            type="number"
            min="0"
            value={to}
            onChange={(e) => setTo(+e.target.value)}
          />
          <input
            placeholder="how many tasks?"
            type="number"
            min="1"
            value={numTasks}
            onChange={(e) => setNumTasks(+e.target.value)}
          />
          <input
            placeholder="max result"
            type="number"
            min="0"
            value={maxResult}
            onChange={(e) => setMaxResult(+e.target.value)}
          />
          <button type="submit">Generate tasks</button>
        </form>
        {message && <p>{message}</p>}
      </main>

      <Numbers tasks={tasks} />
    </div>
  );
}

export default Multiplication;
