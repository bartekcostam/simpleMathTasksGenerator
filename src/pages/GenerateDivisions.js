import React, { useState } from 'react';
import Numbers from '../components/Numbers';
import './GenerateDivisions.css';

function GenerateDivisions() {
  const [from, setFrom] = useState(2);
  const [to, setTo] = useState(30);
  const [numTasks, setNumTasks] = useState(8);
  const [tasks, setTasks] = useState([]);
  const [showCircles, setShowCircles] = useState(false);

  // Funkcja generująca pojedyncze zadanie z limitem prób
  const generateDivisionTask = () => {
    let num2, result, num1;
    const minResult = 2; // Minimalny wynik dzielenia
    let attempts = 0;
    const maxAttempts = 1000; // Maksymalna liczba prób

    while (attempts < maxAttempts) {
      attempts++;
      // Generuj dzielnik między 2 a połową maksymalnego zakresu
      num2 = Math.floor(Math.random() * (Math.min(15, to / 2) - 2 + 1)) + 2;
      
      // Maksymalny możliwy wynik dla danego dzielnika
      const maxResult = Math.floor(to / num2);
      if (maxResult < minResult) continue; // Brak możliwości wygenerowania wyniku
      
      // Generuj wynik między minResult a maxResult
      result = Math.floor(Math.random() * (maxResult - minResult + 1)) + minResult;
      num1 = num2 * result;
      
      // Sprawdź, czy num1 mieści się w przedziale oraz nie jest równy num2
      if (num1 >= from && num1 <= to && num1 !== num2) {
        return {
          equation: `${num1} ÷ ${num2} =`,
          divisor: num2,    // Zachowujemy dzielnik, ale do rysowania kół użyjemy wyniku
          result: result    // Wynik działania, na podstawie którego będzie dzielone koło
        };
      }
    }
    // Jeśli nie uda się wygenerować poprawnego zadania, zwróć wartość domyślną
    return {
      equation: `N/A`,
      divisor: 0,
      result: 0
    };
  };

  // Funkcja generująca zadania z dodatkowym limitem prób, aby zapobiec zawieszaniu się
  const handleGenerateTasks = (e) => {
    e.preventDefault();
    const newTasks = [];
    const generated = new Set();
    let attempts = 0;
    const maxAttempts = numTasks * 100; // Przyjmujemy 100 prób na każde zadanie

    while (newTasks.length < numTasks && attempts < maxAttempts) {
      attempts++;
      const task = generateDivisionTask();
      const taskKey = `${task.equation}`;
      
      // Jeśli zadanie jest unikalne lub przekroczono połowę maksymalnej liczby prób, akceptujemy je
      if (!generated.has(taskKey) || attempts > maxAttempts / 2) {
        newTasks.push(task);
        generated.add(taskKey);
      }
    }
    
    if (newTasks.length < numTasks) {
      console.warn('Nie udało się wygenerować wymaganej liczby unikalnych zadań, więc dodano powtórzenia.');
    }
    setTasks(newTasks);
  };

  // Funkcja renderująca koło podzielone na równe części według wyniku działania
  const renderCircle = (parts) => {
    const rotationIncrement = 360 / parts;
    return (
      <div className="circle-container">
        <div className="circle">
          {Array.from({ length: parts }).map((_, index) => {
            const rotation = rotationIncrement * index;
            return (
              <div
                key={index}
                className="circle-part"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  borderLeft: '2px solid #000'
                }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="App division-page">
      <main>
        <header>Generate Division Tasks</header>
        <form onSubmit={handleGenerateTasks}>
          <label>
            From:
            <input
              type="number"
              min="1"
              value={from}
              onChange={(e) => setFrom(Math.max(1, +e.target.value))}
            />
          </label>
          <label>
            To:
            <input
              type="number"
              min="1"
              value={to}
              onChange={(e) => setTo(Math.max(1, +e.target.value))}
            />
          </label>
          <label>
            Number of tasks:
            <input
              type="number"
              min="1"
              value={numTasks}
              onChange={(e) => setNumTasks(Math.max(1, +e.target.value))}
            />
          </label>
          <button type="submit">Generate</button>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showCircles}
              onChange={(e) => setShowCircles(e.target.checked)}
            />
            Show circles
          </label>
        </form>
      </main>

      <div className="division-tasks">
        {tasks.map((task, index) => (
          <div key={index} className="task-container">
            <div className="equation">{task.equation}</div>
            {/* Renderujemy koło tylko, gdy showCircles jest true */}
            {showCircles && task.result > 0 && renderCircle(task.result)}
            {/* Wynik działania nie jest wyświetlany */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenerateDivisions;
