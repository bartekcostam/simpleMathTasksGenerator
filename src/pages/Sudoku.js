// src/pages/Sudoku.js
import React, { useState } from 'react';
import { makepuzzle, solvepuzzle } from 'sudoku';
import { shuffle } from 'lodash-es';
import './Sudoku.css';

const Sudoku = () => {
  const [settings, setSettings] = useState({
    numberOfBoards: 1,
    columns: 2,
    difficulty: 50,
    gridSize: '9x9'
  });

  const [boards, setBoards] = useState([]);

  // Funkcja generująca poprawne rozwiązanie dla plansz niestandardowych (4x4, 6x6)
  const generateValidSolution = (size) => {
    const [rows, cols] = size.split('x').map(Number);
    let blockRows, blockCols;
    if (size === "4x4") {
      blockRows = 2;
      blockCols = 2;
    } else if (size === "6x6") {
      // W wariancie 6x6 sudoku przyjmujemy bloki 2x3
      blockRows = 2;
      blockCols = 3;
    } else {
      // Fallback - choć nie używamy tego dla 9x9, bo tam korzystamy z biblioteki
      blockRows = Math.sqrt(rows);
      blockCols = Math.sqrt(cols);
    }
    
    // Przygotowanie pustej planszy (macierz rows x cols)
    const board = Array.from({ length: rows }, () => Array(cols).fill(0));
    const numbers = Array.from({ length: rows }, (_, i) => i + 1);

    // Funkcja mieszająca tablicę
    const shuffleArray = (array) => {
      return array.sort(() => Math.random() - 0.5);
    };

    // Sprawdzenie, czy można umieścić liczbę num w komórce (row, col)
    const isSafe = (board, row, col, num) => {
      // Sprawdzenie wiersza
      for (let x = 0; x < cols; x++) {
        if (board[row][x] === num) return false;
      }
      // Sprawdzenie kolumny
      for (let x = 0; x < rows; x++) {
        if (board[x][col] === num) return false;
      }
      // Sprawdzenie bloku
      const startRow = row - (row % blockRows);
      const startCol = col - (col % blockCols);
      for (let i = 0; i < blockRows; i++) {
        for (let j = 0; j < blockCols; j++) {
          if (board[startRow + i][startCol + j] === num) return false;
        }
      }
      return true;
    };

    // Algorytm backtrackingowy do wypełnienia planszy
    const solve = () => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (board[i][j] === 0) {
            let shuffledNumbers = shuffleArray([...numbers]);
            for (let num of shuffledNumbers) {
              if (isSafe(board, i, j, num)) {
                board[i][j] = num;
                if (solve()) {
                  return true;
                } else {
                  board[i][j] = 0;
                }
              }
            }
            return false; // brak poprawnej liczby – cofamy się
          }
        }
      }
      return true; // plansza wypełniona
    };

    solve();
    return board.flat(); // zwracamy spłaszczoną planszę
  };

  const generateClassicSudoku = (percentage) => {
    const puzzle = makepuzzle();
    const solution = solvepuzzle(puzzle);
    const targetClues = Math.round(81 * (percentage / 100));

    return {
      puzzle: puzzle.map(cell => cell !== null ? cell + 1 : ''),
      solution: solution.map(cell => cell + 1),
      rows: 9,
      cols: 9,
      blockSize: 3
    };
  };

  const generateCustomSudoku = (size, percentage) => {
    const [rows, cols] = size.split('x').map(Number);
    const solution = generateValidSolution(size);
    const puzzle = [...solution];
    const totalCells = rows * cols;
    const cellsToKeep = Math.round(totalCells * (percentage / 100));
    
    // Usuwanie komórek z zachowaniem minimalnej liczby wskazówek
    const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i))
      .slice(0, totalCells - cellsToKeep);

    indices.forEach(idx => {
      puzzle[idx] = '';
    });

    return {
      puzzle,
      solution,
      rows,
      cols,
      // Dla 6x6 sudoku przyjmujemy, że linie oddzielające bloki pojawiają się co 2 wiersze (dla 4x4 – 2, dla 9x9 – 3)
      blockSize: settings.gridSize === "6x6" ? 2 : Math.sqrt(rows)
    };
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const newBoards = [];
    
    for (let i = 0; i < settings.numberOfBoards; i++) {
      const board = settings.gridSize === '9x9' 
        ? generateClassicSudoku(settings.difficulty)
        : generateCustomSudoku(settings.gridSize, settings.difficulty);
      newBoards.push(board);
    }
    
    setBoards(newBoards);
  };

  const handleSettingChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: name === 'gridSize' ? value : 
              ['numberOfBoards', 'columns', 'difficulty'].includes(name) ? Math.max(0, Number(value)) : value
    }));
  };

  // Funkcja do określenia rozmiaru bloku przy renderowaniu (do wyznaczania grubych linii)
  const getBlockSize = (size) => {
    switch (size) {
      case '4x4': return 2;
      case '6x6': return 2; // dla 6x6, ze względu na bloki 2x3, chcemy wyznaczać linie co 2 komórki
      case '9x9': return 3;
      default: return 3;
    }
  };

  return (
    <div className="sudoku-page">
      <h1>Generator Sudoku</h1>
      <form onSubmit={handleGenerate}>
        <div className="controls">
          <label>
            Rozmiar planszy:
            <select 
              value={settings.gridSize}
              onChange={(e) => handleSettingChange('gridSize', e.target.value)}
            >
              <option value="4x4">4x4 (łatwy)</option>
              <option value="6x6">6x6 (średni)</option>
              <option value="9x9">9x9 (trudny)</option>
            </select>
          </label>
          <label>
            Ilość plansz:
            <input
              type="number"
              value={settings.numberOfBoards}
              onChange={(e) => handleSettingChange('numberOfBoards', e.target.value)}
              min="1"
            />
          </label>
          <label>
            Kolumny:
            <input
              type="number"
              value={settings.columns}
              onChange={(e) => handleSettingChange('columns', e.target.value)}
              min="1"
            />
          </label>
          <label>
            Wypełnienie (%):
            <input
              type="number"
              value={settings.difficulty}
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              min="20"
              max="80"
            />
          </label>
          <button type="submit">Generuj</button>
        </div>
      </form>
      
      <div 
        className="boards-container" 
        style={{ gridTemplateColumns: `repeat(${settings.columns}, 1fr)` }}
      >
        {boards.map((board, index) => {
          const blockSize = getBlockSize(settings.gridSize);
          return (
            <div 
              key={index} 
              className="sudoku-board"
              data-size={settings.gridSize}
            >
              <h3>Sudoku #{index + 1} ({settings.gridSize})</h3>
              <table>
                <tbody>
                  {Array.from({ length: board.rows || board.puzzle.length / (board.cols || (settings.gridSize === '9x9' ? 9 : parseInt(settings.gridSize))) }).map((_, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={(rowIndex + 1) % blockSize === 0 ? 'thick-bottom' : ''}
                    >
                      {Array.from({ length: board.cols || (settings.gridSize === '9x9' ? 9 : parseInt(settings.gridSize)) }).map((_, cellIndex) => {
                        const value = board.puzzle[rowIndex * (board.cols || (settings.gridSize === '9x9' ? 9 : parseInt(settings.gridSize))) + cellIndex];
                        return (
                          <td 
                            key={cellIndex} 
                            className={(cellIndex + 1) % blockSize === 0 ? 'thick-right' : ''}
                          >
                            {value || ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sudoku;
