import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
  const defaultBoardSize = 10;
  const defaultPlayers = 2;

  const [boardSize] = useState(defaultBoardSize);
  const [snakes, setSnakes] = useState({});
  const [ladders, setLadders] = useState({});
  const [players] = useState(defaultPlayers);
  const [playerPositions, setPlayerPositions] = useState(Array(defaultPlayers).fill(1));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [boardCharacters, setBoardCharacters] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate();

  const playerColors = ['red', 'blue', 'green', 'purple'];

  useEffect(() => {
    const characters = [];
    for (let i = 0; i < boardSize * boardSize; i++) {
      characters.push(getRandomChineseCharacter());
    }
    setBoardCharacters(characters);
    generateSnakesAndLadders();
  }, [boardSize]);

  const getRandomChineseCharacter = () => {
    const code = Math.floor(Math.random() * (0x9FFF - 0x4E00 + 1)) + 0x4E00;
    return String.fromCharCode(code);
  };

  const generateSnakesAndLadders = () => {
    const newSnakes = {};
    const newLadders = {};
    const totalCells = boardSize * boardSize;
    const occupiedPositions = new Set();

    while (Object.keys(newSnakes).length < 5) {
      const start = Math.floor(Math.random() * (totalCells - 2)) + 2;
      const end = Math.floor(Math.random() * (start - 1)) + 1;
      if (start !== totalCells && !occupiedPositions.has(start) && !occupiedPositions.has(end)) {
        newSnakes[start] = end;
        occupiedPositions.add(start);
        occupiedPositions.add(end);
      }
    }

    while (Object.keys(newLadders).length < 5) {
      const start = Math.floor(Math.random() * (totalCells - 2)) + 2;
      const end = Math.floor(Math.random() * (totalCells - start)) + start + 1;
      if (start !== 1 && !occupiedPositions.has(start) && !occupiedPositions.has(end)) {
        newLadders[start] = end;
        occupiedPositions.add(start);
        occupiedPositions.add(end);
      }
    }

    setSnakes(newSnakes);
    setLadders(newLadders);
  };

  const rollDice = () => {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(dice);
    let newPosition = playerPositions[currentPlayer] + dice;

    if (newPosition >= boardSize * boardSize) {
      newPosition = boardSize * boardSize;
      setGameOver(true);
    }

    if (snakes[newPosition]) {
      newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
      newPosition = ladders[newPosition];
    }

    const newPositions = [...playerPositions];
    newPositions[currentPlayer] = newPosition;
    setPlayerPositions(newPositions);

    if (newPosition === boardSize * boardSize) {
      setGameOver(true);
    } else {
      setCurrentPlayer((currentPlayer + 1) % players);
    }
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        const cellNumber = i * boardSize + j + 1;
        const playerInCell = playerPositions.findIndex(position => position === cellNumber);
        row.push(
          <div key={cellNumber} className={`cell ${playerInCell !== -1 ? 'active' : ''}`} style={{ backgroundColor: playerInCell !== -1 ? playerColors[playerInCell] : '' }}>
            {cellNumber !== 1 && boardCharacters[cellNumber - 1]}
            <span className="number">{cellNumber}</span>
          </div>
        );
      }
      board.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }
    return board;
  };

  const renderSnakesAndLadders = () => {
    const cells = [];
    for (let i = 0; i < boardSize * boardSize; i++) {
      const x = (i % boardSize) * 50 + 25;
      const y = Math.floor(i / boardSize) * 50 + 25;
      cells.push({ x, y });
    }

    return (
      <svg className="snakes-ladders" width={boardSize * 50} height={boardSize * 50}>
        {Object.entries(snakes).map(([start, end]) => (
          <line
            key={`snake-${start}-${end}`}
            x1={cells[start - 1].x}
            y1={cells[start - 1].y}
            x2={cells[end - 1].x}
            y2={cells[end - 1].y}
            stroke="red"
            strokeWidth="2"
          />
        ))}
        {Object.entries(ladders).map(([start, end]) => (
          <line
            key={`ladder-${start}-${end}`}
            x1={cells[start - 1].x}
            y1={cells[start - 1].y}
            x2={cells[end - 1].x}
            y2={cells[end - 1].y}
            stroke="green"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Snake and Ladder Game</h1>
      <div className="board">
        {renderSnakesAndLadders()}
        {renderBoard()}
      </div>
      <button onClick={rollDice} disabled={gameOver}>Roll Dice</button>
      {diceRoll !== null && <p>Dice Roll: {diceRoll}</p>}
      <div>
        {playerPositions.map((pos, index) => (
          <p key={index} style={{ color: playerColors[index] }}>
            Player {index + 1} Position: {pos}
          </p>
        ))}
      </div>
      {gameOver && <p>Game Over! Player {currentPlayer + 1} wins!</p>}
      <button onClick={handleRestart}>Restart Game</button>
    </div>
  );
};

export default GamePage;
