// src/App.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Welcome to Snake and Ladder</h1>
      <Link to="/settings">Game Settings</Link>
    </div>
  );
}

export default App;
