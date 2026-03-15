import './App.css';
import Numbers from '../components/Numbers';
import { useState } from 'react';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GenerateDivisions() {
  const [from, setFrom] = useState(2);
  const [to, setTo] = useState(30);
  const [numTasks, setNumTasks] = useState(8);
  const [maxResult, setMaxResult] = useState(10);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const handleGenerateTasks = (e) => {
    e.preventDefault();

    const safeFrom = Math.max(1, Math.trunc(from));
    const safeTo = Math.max(1, Math.trunc(to));
    const rangeStart = Math.min(safeFrom, safeTo);
    const rangeEnd = Math.max(safeFrom, safeTo);
    const safeNumTasks = Math.max(1, Math.trunc(numTasks));
    const safeMaxResult = Math.max(1, Math.trunc(maxResult));

    if (rangeStart > rangeEnd || safeMaxResult < 1) {
      setTasks([]);
      setMessage('No tasks can be generated for this range and max result.');
      return;
    }

    const generated = [];
    const maxAttempts = safeNumTasks * 200;
    let attempts = 0;

    while (generated.length < safeNumTasks && attempts < maxAttempts) {
      attempts += 1;

      const divisor = getRandomInt(1, rangeEnd);
      const result = getRandomInt(1, safeMaxResult);
      const dividend = divisor * result;

      if (dividend >= rangeStart && dividend <= rangeEnd) {
        generated.push(`${dividend} ÷ ${divisor} =`);
      }
    }

    setTasks(generated);

    if (generated.length < safeNumTasks) {
      setMessage(`Generated ${generated.length} of ${safeNumTasks} tasks. Try a higher max result or a larger range.`);
      return;
    }

    setMessage('');
  };

  return (
    <div className="App">
      <main>
        <header>
          <h1>Generate Division</h1>
        </header>

        <form onSubmit={handleGenerateTasks}>
          <input
            placeholder="from"
            type="number"
            min="1"
            value={from}
            onChange={(e) => setFrom(+e.target.value)}
          />
          <input
            placeholder="to"
            type="number"
            min="1"
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
            min="1"
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

export default GenerateDivisions;
