import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Listings } from './components/Listings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Listings />} />
    </Routes>
  );
}

export default App;
