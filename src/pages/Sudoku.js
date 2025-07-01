import React, { useState } from 'react';
import { shuffle } from 'lodash-es';
import './Sudoku.css';

const Sudoku = () => {
  const [settings, setSettings] = useState({
    gridSize: '9x9',       // '4x4' | '6x6' | '9x9'
    numberOfBoards: 1,
    columns: 2,
    difficulty: 50         // procent wypełnienia
  });
  const [boards, setBoards] = useState([]);

  // BACKTRACKING: generuje pełne rozwiązanie
  const generateValidSolution = (size) => {
    const [rows, cols] = size.split('x').map(Number);
    let blockRows, blockCols;
    if (size === '4x4')      { blockRows = 2; blockCols = 2; }
    else if (size === '6x6') { blockRows = 2; blockCols = 3; }
    else                     { blockRows = 3; blockCols = 3; }

    const board = Array.from({ length: rows }, () => Array(cols).fill(0));
    const nums  = Array.from({ length: rows }, (_, i) => i + 1);

    const isSafe = (r, c, n) => {
      for (let i = 0; i < cols; i++) if (board[r][i] === n) return false;
      for (let i = 0; i < rows; i++) if (board[i][c] === n) return false;
      const sr = r - (r % blockRows), sc = c - (c % blockCols);
      for (let i = 0; i < blockRows; i++)
        for (let j = 0; j < blockCols; j++)
          if (board[sr + i][sc + j] === n) return false;
      return true;
    };

    const solve = () => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (board[r][c] === 0) {
            for (let n of shuffle(nums)) {
              if (isSafe(r, c, n)) {
                board[r][c] = n;
                if (solve()) return true;
                board[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve();
    return board.flat();
  };

  // Tworzy puzzle wg % wypełnienia
  const generatePuzzle = (size, pct) => {
    const [rows, cols] = size.split('x').map(Number);
    const sol   = generateValidSolution(size);
    const total = rows * cols;
    const clues = Math.round(total * (pct / 100));
    const puzzle = [...sol];
    const toRemove = shuffle(Array.from({ length: total }, (_, i) => i))
                       .slice(0, total - clues);
    toRemove.forEach(i => puzzle[i] = '');

    return {
      puzzle,
      solution: sol,
      rows, cols,
      blockRows: size==='6x6'?2:Math.sqrt(rows),
      blockCols: size==='6x6'?3:Math.sqrt(cols)
    };
  };

  // Generuj i ustaw w stanie
  const handleGenerate = e => {
    e.preventDefault();
    const arr = [];
    for (let i = 0; i < settings.numberOfBoards; i++) {
      arr.push(generatePuzzle(settings.gridSize, settings.difficulty));
    }
    setBoards(arr);
  };

  const handleSettingChange = (name, val) => {
    setSettings(prev => ({
      ...prev,
      [name]: ['numberOfBoards','columns','difficulty'].includes(name)
        ? Math.max(1, Number(val))
        : val
    }));
  };

  // Ile plansz na stronę?
  const perPage = settings.gridSize === '4x4' ? 6
                : settings.gridSize === '6x6' ? 4
                : 2;
  // Podziel na "strony"
  const pages = [];
  for (let i = 0; i < boards.length; i += perPage) {
    pages.push(boards.slice(i, i + perPage));
  }

  return (
    <div className={`sudoku-page size-${settings.gridSize.replace('x','')}`}>
      <h1>Generator Sudoku</h1>
      <form onSubmit={handleGenerate}>
        <div className="controls">
          <label>
            Rozmiar:
            <select
              value={settings.gridSize}
              onChange={e => handleSettingChange('gridSize', e.target.value)}
            >
              <option value="4x4">4×4</option>
              <option value="6x6">6×6</option>
              <option value="9x9">9×9</option>
            </select>
          </label>
          <label>
            Ilość:
            <input
              type="number" min="1"
              value={settings.numberOfBoards}
              onChange={e => handleSettingChange('numberOfBoards', e.target.value)}
            />
          </label>
          <label>
            Kolumny (podgląd):
            <input
              type="number" min="1"
              value={settings.columns}
              onChange={e => handleSettingChange('columns', e.target.value)}
            />
          </label>
          <label>
            % fill:
            <input
              type="number" min="20" max="80"
              value={settings.difficulty}
              onChange={e => handleSettingChange('difficulty', e.target.value)}
            />
          </label>
          <button type="submit">Generuj</button>
        </div>
      </form>

      {pages.map((pageBoards, pi) => (
        <div key={pi} className="page">
          <div
            className="boards-container"
            style={{ gridTemplateColumns: `repeat(${settings.columns},1fr)` }}
          >
            {pageBoards.map((b, bi) => (
              <div key={bi} className="sudoku-board" data-size={settings.gridSize}>
                <h3>#{pi*perPage + bi + 1} ({settings.gridSize})</h3>
                <table>
                  <tbody>
                    {Array.from({ length: b.rows }).map((_, r) => (
                      <tr key={r}
                          className={((r + 1) % b.blockRows === 0) ? 'thick-bottom' : ''}>
                        {Array.from({ length: b.cols }).map((_, c) => {
                          const v = b.puzzle[r * b.cols + c];
                          return (
                            <td key={c}
                                className={((c + 1) % b.blockCols === 0) ? 'thick-right' : ''}>
                              {v || ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sudoku;
