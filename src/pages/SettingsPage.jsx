// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const [boardSize, setBoardSize] = useState(10);
  const [players, setPlayers] = useState([
    { name: 'Player 1', color: 'red' },
    { name: 'Player 2', color: 'blue' }
  ]);
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [wordLibraries, setWordLibraries] = useState([]);
  const playerColors = ['red', 'blue', 'green', 'purple'];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWordLibraries = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/word-libraries');
        setWordLibraries(response.data);
        setSelectedLibrary(response.data[0]?._id || '');
      } catch (error) {
        console.error("Error fetching word libraries:", error);
      }
    };

    fetchWordLibraries();
  }, []);

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handlePlayerCountChange = (count) => {
    const newPlayers = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        name: players[i] ? players[i].name : `Player ${i + 1}`,
        color: playerColors[i]
      });
    }
    setPlayers(newPlayers);
  };

  const startGame = () => {
    navigate('/game', { state: { boardSize, players, selectedLibrary } });
  };

  return (
    <div>
      <h1>Game Settings</h1>
      <label>
        Board Size:
        <select value={boardSize} onChange={(e) => setBoardSize(Number(e.target.value))}>
          <option value={8}>8x8</option>
          <option value={9}>9x9</option>
          <option value={10}>10x10</option>
        </select>
      </label>
      <br />
      <label>
        Number of Players:
        <select value={players.length} onChange={(e) => handlePlayerCountChange(Number(e.target.value))}>
          {[1, 2, 3, 4].map(count => (
            <option key={count} value={count}>{count}</option>
          ))}
        </select>
      </label>
      <br />
      {players.map((player, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label>
            Player {index + 1} Name:
            <input
              type="text"
              value={player.name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              style={{ borderColor: player.color }}
            />
          </label>
          <span style={{ backgroundColor: player.color, color: 'white', padding: '2px 5px', marginLeft: '10px' }}>
            {player.color}
          </span>
        </div>
      ))}
      <br />
      <label>
        Select Word Library:
        <select value={selectedLibrary} onChange={(e) => setSelectedLibrary(e.target.value)}>
          {wordLibraries.map((library) => (
            <option key={library._id} value={library._id}>
              {library.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default SettingsPage;
