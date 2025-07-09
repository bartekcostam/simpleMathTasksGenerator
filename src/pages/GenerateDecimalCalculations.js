import React, { useState } from 'react';
import './GenerateDecimalCalculations.css';

const GenerateDecimalCalculations = () => {
  // Stany formularza
  const [operation, setOperation] = useState('add');
  const [from, setFrom]         = useState(0);
  const [to, setTo]             = useState(10);
  const [decimals, setDecimals] = useState(1);
  const [numTasks, setNumTasks] = useState(20);
  const [allowNegative, setAllowNegative] = useState(false);
  const [tasks, setTasks]       = useState([]);
  const [showTrim, setShowTrim] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // Losowanie liczby z przecinkiem
  const randFloat = () => {
    const raw = Math.random() * (to - from) + from;
    return Number(raw.toFixed(decimals));
  };

  // Formatowanie: kropka→przecinek, opcjonalne obcięcie ",0"
  const formatDecimal = (num) => {
    let str = num.toFixed(decimals).replace('.', ',');
    if (showTrim && decimals > 0) {
      const regex = new RegExp(`,0{1,${decimals}}$`);
      str = str.replace(regex, '');
    }
    return str;
  };

  // Generowanie zadań
  const handleGenerate = (e) => {
    e.preventDefault();
    const list = [];
    for (let i = 0; i < numTasks; i++) {
      let x = randFloat();
      let y = randFloat();
      if (operation === 'sub' && !allowNegative && x < y) {
        [x, y] = [y, x];
      }
      const q   = `${formatDecimal(x)} ${operation === 'add' ? '+' : '-'} ${formatDecimal(y)} =`;
      const ans = formatDecimal(operation === 'add' ? x + y : x - y);
      list.push({ question: q, answer: ans });
    }
    setTasks(list);
    setShowAnswers(false);
  };

  return (
    <div className="decimal-page">
      <h1>Generator działań z przecinkiem</h1>

      <form onSubmit={handleGenerate} className="decimal-form">
        <div className="form-row">
          <label>
            Operacja:
            <select value={operation} onChange={e => setOperation(e.target.value)}>
              <option value="add">Dodawanie</option>
              <option value="sub">Odejmowanie</option>
            </select>
          </label>

          <label>
            Od:
            <input type="number" value={from} onChange={e => setFrom(+e.target.value)} />
          </label>
          <label>
            Do:
            <input type="number" value={to} onChange={e => setTo(+e.target.value)} />
          </label>

          <label>
            Miejsc po przecinku:
            <select value={decimals} onChange={e => setDecimals(+e.target.value)}>
              {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Ile zadań:
            <input type="number" value={numTasks} onChange={e => setNumTasks(+e.target.value)} />
          </label>

          {operation === 'sub' && (
            <label>
              <input
                type="checkbox"
                checked={allowNegative}
                onChange={e => setAllowNegative(e.target.checked)}
              />
              Wynik może być ujemny
            </label>
          )}

          <label>
            <input
              type="checkbox"
              checked={showTrim}
              onChange={e => setShowTrim(e.target.checked)}
            />
            Usuń końcówkę ",0"
          </label>

          <button type="submit" className="btn-generate">Generuj zadania</button>
        </div>
      </form>

      {tasks.length > 0 && (
        <>
          <section className="tasks-section">
            <h2>Zadania</h2>
            <ul className="tasks-list">
              {tasks.map((t,i) => <li key={i}>{t.question}</li>)}
            </ul>
          </section>

          <div className="answers-control">
            <button onClick={() => setShowAnswers(true)} className="btn-answers">
              Pokaż odpowiedzi
            </button>
          </div>
        </>
      )}

      {showAnswers && (
        <section className="answers-section">
          <h2>Odpowiedzi</h2>
          <div className="answers-list">
            {tasks.map((t,i) => (
              <div key={i}>
                <strong>{i + 1}.</strong> {t.question} <em>{t.answer}</em>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GenerateDecimalCalculations;
