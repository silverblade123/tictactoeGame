import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gameplay.css';  

function SquareTable() {
  const [TheRow, setTheRow] = useState(1);
  const [ToColl, setToColl] = useState(1);
  const [Square, setSquare] = useState([]);
  const [isX, setisX] = useState(true);
  const [result, setresult] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isitRight, setisitRight] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reset, setReset] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [replay,setrepaly] = useState([]);

  useEffect(() => {
    setSquare(Array.from({ length: TheRow }, () => Array(ToColl).fill(null)));
  }, [TheRow, ToColl]);

  useEffect(() => {
    if (isDraw) {
      setWinner('Draw');
    }
  }, [isDraw]);

  const xsoros = (Rowth, Colth) => {
    const currentSquare = Square[Rowth][Colth];
    const disabled = currentSquare !== null || winner !== null || reset;

    return (
      <button className = 'Playbutton' onClick={() => handleclick(Rowth, Colth)} disabled={disabled}>
        {currentSquare}
      </button>
    );
  };

  // Helper function to create a deep copy of a nested array
const deepCopyArray = (arr) => {
  return arr.map((row) => [...row]);
};

const handleclick = (a, b) => {
  const currentSquare = Square[a][b];
  if (reset) {
    setSquare(Array.from({ length: TheRow }, () => Array(ToColl).fill(null)));
    setisX(true);
    setWinner(null);
    setReset(false);
    setIsDraw(false);
    return;
  }

  if (currentSquare === null) {
    const newSquare = deepCopyArray(Square); // Create a deep copy of the Square array
    newSquare[a][b] = isX ? 'X' : 'O';
    setSquare(newSquare);
    setisX(!isX);
    calculateWinner(newSquare);
    setrepaly(prevReplay => [...prevReplay, newSquare]); // Add the newSquare to the replay state
  }
};

  

  const toggleTable = () => {
    if (ToColl === NaN) {
      setShowTable(false);
      setInputDisabled(false);
    } else {
      setShowTable(true);
      setInputDisabled(true);
      setisitRight(!isitRight);
    }

  };

  const handleRowChange = (e) => {
    const value = parseInt(e.target.value);
    setTheRow(value >= 1 ? value : 1);
  };

  const handleColChange = (e) => {
    const value = parseInt(e.target.value);
    setToColl(value >= 1 ? value : 1);
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

  const calculateWinner = (board) => {
    let winrow = 1;
    if (TheRow < ToColl) {
      winrow = TheRow;
    }
    if (TheRow > ToColl) {
      winrow = ToColl;
    }
    if (TheRow === ToColl) {
      winrow = ToColl;
    }
    // Check rows
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j <= board[i].length - winrow; j++) {
        const row = [];
        for (let k = j; k < j + winrow; k++) {
          row.push(board[i][k]);
        }
        if (row.every((val) => val === 'X') || row.every((val) => val === 'O')) {
          console.log('Winner found in a row');
          setWinner(row[0]);
          console.log(winner);
          return;
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
        if (column.every((val) => val === 'X') || column.every((val) => val === 'O')) {
          console.log('Winner found in a column');
          setWinner(column[0]);
          console.log(winner);
          return;
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

    if (
      diagonal1.some((diagonal) => diagonal.every((val) => val === 'X') || diagonal.every((val) => val === 'O'))
    ) {
      console.log('Winner found in the first diagonal');
      setWinner(
        diagonal1.find((diagonal) => diagonal.every((val) => val === 'X') || diagonal.every((val) => val === 'O'))[0]
      );
      console.log(winner);
      return;
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

    if (
      diagonal2.some((diagonal) => diagonal.every((val) => val === 'X') || diagonal.every((val) => val === 'O'))
    ) {
      console.log('Winner found in the Second diagonal');
      setWinner(
        diagonal2.find((diagonal) => diagonal.every((val) => val === 'X') || diagonal.every((val) => val === 'O'))[0]
      );
      console.log(winner);
      return;
    }

    if (board.flat().every((val) => val !== null)) {
      setIsDraw(true);
    }

  }

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
    
    setrepaly([]);
  };

  return (
    <>
      <div className='MainGamepage'>
      <span>
        <h1>Square Table</h1>
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

export default SquareTable;