import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BotTable() {
  const [TheRow, setTheRow] = useState(1);
  const [ToColl, setToColl] = useState(1);
  const [Square, setSquare] = useState([]);
  const [isX, setisX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [reset, setReset] = useState(false);
  const [replay, setReplay] = useState([]);

  useEffect(() => {
    setSquare(Array.from({ length: TheRow }, () => Array(ToColl).fill(null)));
  }, [TheRow, ToColl]);

  useEffect(() => {
    if (isDraw) {
      setWinner('Draw');
    }
  }, [isDraw]);

  const handlePlayerMove = (a, b) => {
    const currentSquare = Square[a][b];
    if (currentSquare === null && winner === null && !reset) {
      const newSquare = Square.map((row, rowIndex) =>
        row.map((col, colIndex) => (rowIndex === a && colIndex === b ? (isX ? 'X' : 'O') : col))
      );
      setSquare(newSquare);
      setisX(!isX);
      const calculatedWinner = calculateWinner(newSquare);
      if (calculatedWinner) {
        setWinner(calculatedWinner);
      }
      setReplay(prevReplay => [...prevReplay, newSquare]);
    }
  };

  const handleBotMove = () => {
    const newSquare = Square.map(row => [...row]);
    let bestScore = -Infinity;
    let move = { row: 0, col: 0 };

    for (let i = 0; i < TheRow; i++) {
      for (let j = 0; j < ToColl; j++) {
        if (newSquare[i][j] === null) {
          newSquare[i][j] = 'O';
          const score = minimax(newSquare, 0, false);
          newSquare[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = { row: i, col: j };
          }
        }
      }
    }

    newSquare[move.row][move.col] = 'O';
    setSquare(newSquare);
    setisX(!isX);
    const calculatedWinner = calculateWinner(newSquare);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
    }
    setReplay(prevReplay => [...prevReplay, newSquare]);
  };

  const calculateWinner = (board) => {
    let winrow = 1;
    if (TheRow < ToColl) {
      winrow = TheRow;
    } else if (TheRow > ToColl) {
      winrow = ToColl;
    } else if (TheRow === ToColl) {
      winrow = ToColl;
    }

    // Check rows
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j <= board[i].length - winrow; j++) {
        const row = [];
        for (let k = j; k < j + winrow; k++) {
          row.push(board[i][k]);
        }
        if (row.every(val => val === 'X') || row.every(val => val === 'O')) {
          return row[0];
        }
      }
    }

    // Check columns
    for (let i = 0; i < board[0].length; i++) {
      for (let j = 0; j <= board.length - winrow; j++) {
        let column = [];
        for (let k = j; k < j + winrow; k++) {
          column.push(board[k][i]);
        }
        if (column.every(val => val === 'X') || column.every(val => val === 'O')) {
          return column[0];
        }
      }
    }

    // Check diagonal1
    const diagonal1 = [];
    for (let i = 0; i <= board.length - winrow; i++) {
      for (let j = 0; j <= board[i].length - winrow; j++) {
        const diagonal = [];
        for (let k = 0; k < winrow; k++) {
          const x = i + k;
          const y = j + k;
          diagonal.push(board[x][y]);
        }
        diagonal1.push(diagonal);
      }
    }

    if (diagonal1.some(diagonal => diagonal.every(val => val === 'X') || diagonal.every(val => val === 'O'))) {
      return diagonal1.find(diagonal => diagonal.every(val => val === 'X') || diagonal.every(val => val === 'O'))[0];
    }

    // Check diagonal2
    const diagonal2 = [];
    for (let i = 0; i <= board.length - winrow; i++) {
      for (let j = board[i].length - 1; j >= winrow - 1; j--) {
        const diagonal = [];
        for (let k = 0; k < winrow; k++) {
          const x = i + k;
          const y = j - k;
          diagonal.push(board[x][y]);
        }
        diagonal2.push(diagonal);
      }
    }

    if (diagonal2.some(diagonal => diagonal.every(val => val === 'X') || diagonal.every(val => val === 'O'))) {
      return diagonal2.find(diagonal => diagonal.every(val => val === 'X') || diagonal.every(val => val === 'O'))[0];
    }

    if (board.flat().every(val => val !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleRowChange = (e) => {
    const value = parseInt(e.target.value);
    setTheRow(value >= 1 ? value : 1);
  };

  const handleColChange = (e) => {
    const value = parseInt(e.target.value);
    setToColl(value >= 1 ? value : 1);
  };

  const toggleTable = () => {
    if (ToColl === NaN) {
      setShowTable(false);
      setInputDisabled(false);
    } else {
      setShowTable(true);
      setInputDisabled(true);
    }
  };

  const table = () => {
    const board = [];
    for (let a = 0; a < TheRow; a++) {
      let row = [];
      for (let b = 0; b < ToColl; b++) {
        row.push(<td key={b}>{xsoros(a, b)}</td>);
      }
      board.push(<tr key={a}>{row}</tr>);
    }
    return board;
  };

  const xsoros = (Rowth, Colth) => {
    const currentSquare = Square[Rowth][Colth];
    const disabled = currentSquare !== null || winner !== null || reset;
  
    return (
      <button className = 'Playbutton' onClick={() => handlePlayerMove(Rowth, Colth)} disabled={disabled}>
        {currentSquare}
      </button>
    );
  };
  

  useEffect(() => {
    if (!isX && showTable && winner === null) {
      handleBotMove();
    }
  }, [isX, showTable, winner]);

  const handleReset = () => {
    setSquare(Array.from({ length: TheRow }, () => Array(ToColl).fill(null)));
    setShowTable(false);
    setInputDisabled(false);
    setisX(true);
    setWinner(null);
    setReset(false);
    setIsDraw(false);
    axios.post('http://localhost:5000/data', { row: TheRow, col: ToColl, rep: replay})
      .then(response => {
        console.log('Row and column values sent to the server');
      })
      .catch(error => {
        console.error(error);
      });
    setReplay([]);
  };

  const minimax = (board, depth, isMaximizingPlayer) => {
    const scores = {
      X: 1,
      O: -1,
      Draw: 0,
    };

    const winner = calculateWinner(board);
    if (winner) {
      return scores[winner];
    }

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < TheRow; i++) {
        for (let j = 0; j < ToColl; j++) {
          if (board[i][j] === null) {
            board[i][j] = 'X';
            const score = minimax(board, depth + 1, false);
            board[i][j] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < TheRow; i++) {
        for (let j = 0; j < ToColl; j++) {
          if (board[i][j] === null) {
            board[i][j] = 'O';
            const score = minimax(board, depth + 1, true);
            board[i][j] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  return (
    <>
      <div className='MainGamepage'>
      <span>
        <h1>Play with bot</h1>
        <p>row</p>
        <input
          type="number"
          min="1"
          onChange={handleRowChange}
          value={TheRow}
          disabled={inputDisabled}
        />
        <p>column</p>
        <input
          type="number"
          min="1"
          onChange={handleColChange}
          value={ToColl}
          disabled={inputDisabled}
        />
        <div>
        <button onClick={toggleTable}>Start Game</button>
        {showTable && (
          <>
          <p>row: {TheRow}</p>
          <p>col: {ToColl}</p>
          </>
        )}
        </div>
        </span>
        <div className='Table-button'>
        {showTable && (
          <>
          <table className="table">
            <tbody>{table()}</tbody>
          </table>
          {winner !== null && (
            <button onClick={handleReset}>Reset Game</button>
          )}
          {isDraw && (
            <button onClick={handleReset}>Draw! Start New Game</button>
          )}
          {reset && (
            <button onClick={handleReset}>Start New Game</button>
          )}
          </>
        )}
        </div>
      </div>
    </>
  );
}

export default BotTable;