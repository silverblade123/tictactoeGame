import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Replay.css'

function GameReplay() {
  const [data, setData] = useState([]);
  const [replayGame, setReplayGame] = useState([]);
  const [tableGame, setTableGame] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/')
      .then((response) => {
        setData(response.data);
        console.log(response.data); // Log the received data from the server
      })
      .catch((error) => {
        console.error(error);
      });

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsOpen(scrollTop > 100); // Adjust the scroll position threshold as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const displayReplay = (gameReplay) => {
    console.log('Item:', gameReplay);
    return (
      <div className="replay-container">
        <span>
          {gameReplay.map((item, index) => {
            return (
              <div key={index}>
                <button key={index} onClick={() => setTableGame(item)}>
                  รอบที่:{index+1}
                </button>
              </div>
            );
          })}
        </span>
      </div>
    );
  };

  const tableReplay = () => {
    console.log(tableGame);
    return (
      <>
        {tableGame.map((item, index) => {
          return (
            <tr key={index}>
              {item.map((item, index) => {
                return (
                  <td key={index}>
                    <button className='RepTabG'>{item}</button>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className='ReplayContainer'>
      <div className={`game-replay${isOpen ? ' open' : ''}`}>
        <h1>Square replay</h1>
        <div className="scroll-container">
          {data.map((item, index) => data[data.length - 1 - index]).map((item, index) => {
            let gameReplay = item.repaly;
            return (
              <div key={index}>
                <button key={index} onClick={() => setReplayGame(gameReplay)}>
                  Name: {item.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <span>
          <table className="table">
            <tbody>
              {tableReplay()}
            </tbody>
          </table>
        </span>
        <span>
          {displayReplay(replayGame)}
        </span>
      </div>
    </>
  );
}

export default GameReplay;
