// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [boardSize, setBoardSize] = useState(10);
  const [players, setPlayers] = useState(1);

  const navigate = useNavigate();

  const startGame = () => {
    // 将设置传递给游戏页面（可以通过URL参数或上下文API）
    navigate('/game', { state: { boardSize, players } });
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
        <select value={players} onChange={(e) => setPlayers(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </label>
      <br />
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default SettingsPage;
