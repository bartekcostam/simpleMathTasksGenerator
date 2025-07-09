// src/pages/GenerateCalculations.jsx
import './App.css';
import Numbers from '../components/Numbers';
import { useState } from 'react';

function GenerateCalculations() {
  // --- STANY ---
  const [from, setFrom]           = useState(0);    // początek zakresu (inclusive)
  const [to, setTo]               = useState(10);   // koniec zakresu (exclusive)
  const [numTasks, setNumTasks]   = useState(5);    // ile zadań wygenerować
  const [numOperands, setNumOperands] = useState(2);// czy dodajemy 2 czy 3 liczby
  const [tasks, setTasks]         = useState([]);   // wygenerowane działania

  // --- HANDLERY PRZEŁĄCZANIA TRYBU (2 vs 3 operandów) ---
  const handleUseTwo = () => setNumOperands(2);
  const handleUseThree = () => setNumOperands(3);

  // --- GENERATOR ZADAŃ ---
  const handleGenerateTasks = (e) => {
    e.preventDefault();
    const generated = [];

    for (let i = 0; i < numTasks; i++) {
      // 1) wylosuj numOperands liczb w zadanym zakresie
      const nums = [];
      for (let k = 0; k < numOperands; k++) {
        // Math.random()*(to-from) + from, zaokrąglone w dół
        const n = Math.floor(Math.random() * (to - from + 1)) + from;
        nums.push(n);
      }
      // 2) zbuduj string "a + b" lub "a + b + c"
      const expr = nums.join(' + ');
      // 3) dodaj "=" i wrzuć do tablicy
      generated.push(`${expr} =`);
    }

    // Zapisz i wyczyść poprzednie wyniki
    setTasks(generated);
  };

  return (
    <div className="App">
      <main>
        <header>
          <h1>Generate Calculations</h1>
          {/* przyciski przełączające liczbę operandów */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handleUseTwo}
              style={{
                fontWeight: numOperands === 2 ? 'bold' : 'normal',
                marginRight: '0.5rem'
              }}
            >
              Dodawanie 2 liczb
            </button>
            <button
              type="button"
              onClick={handleUseThree}
              style={{
                fontWeight: numOperands === 3 ? 'bold' : 'normal'
              }}
            >
              Dodawanie 3 liczb
            </button>
          </div>
        </header>

        {/* formularz zakresu i ilości zadań */}
        <form onSubmit={handleGenerateTasks}>
          <input
            placeholder="from"
            type="number"
            value={from}
            onChange={(e) => setFrom(+e.target.value)}
          />
          <input
            placeholder="to"
            type="number"
            value={to}
            onChange={(e) => setTo(+e.target.value)}
          />
          <input
            placeholder="how many tasks?"
            type="number"
            value={numTasks}
            onChange={(e) => setNumTasks(+e.target.value)}
          />
          <button type="submit">Generate tasks</button>
        </form>
      </main>

      {/* komponent wyświetlający listę działań */}
      <Numbers tasks={tasks} />
    </div>
  );
}

export default GenerateCalculations;
