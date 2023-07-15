// React App code
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import SquareTable from './componant/maintictactoe/SquareTable';
import GameReplay from './componant/replay/GameReplay';
import BotTable from './componant/bot/GameBot';

function App() {
  const [data, setData] = useState('');
  const [humanShow, setHumanShow] = useState(true); // Updated state for Human Display
  const [replayShow, setReplayShow] = useState(false);
  const [botShow, setBotShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setData(response.data);
        console.log(response.data); // Log the received data from the server
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleTestData = () => {
    console.log(data);
  };

  const handleHumanDisplay = () => {
    setHumanShow(true); // Set humanShow state to true
    setReplayShow(false);
    setBotShow(false);
  };

  const ReplayDisplay = () => {
    setHumanShow(false);
    setReplayShow(true);
    setBotShow(false);
  };

  const BotDisplay = () => {
    setHumanShow(false);
    setReplayShow(false);
    setBotShow(true);
  };

  return (
    <>
    <body>
    <div>
        <button className ='selectButton' onClick={handleHumanDisplay}>Play With Human</button>
        <button className ='selectButton' onClick={ReplayDisplay}>Replay</button>
        <button className ='selectButton' onClick={BotDisplay}>Play With Bot</button>
      </div>
      {humanShow && <SquareTable data={data} />} {/* Render SquareTable when humanShow is true */}
      {replayShow && <GameReplay />}
      {botShow && <BotTable />} 
    </body>
    </>
  );
}

export default App;
