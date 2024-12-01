import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Listings } from './components/Listings';
import { Listing } from 'components/Listing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Listings />} />
      <Route path="/listing/:lid" element={<Listing />} />
    </Routes>
  );
}

export default App;
