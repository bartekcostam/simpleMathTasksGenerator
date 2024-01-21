import './App.css';
import {Routes, Route} from 'react-router-dom'
import {useState} from 'react'
import NumberList from './pages/NumberList';
import GenerateCalculations from './pages/GenerateCalculations';
import Home from './pages/Home';
import MissingNumbers from './pages/MissingNumbers';
import NumberCompare from './pages/NumberCompare';
import Substraction from './pages/Substraction';
import Set from './pages/Set';
import Clock from './pages/Clock';

function App() {


  return (
    <div className="App">
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/numberlist" element={<NumberList />} />
      <Route path="/generatecalculations" element={<GenerateCalculations />} />
      <Route path="/missingnumbers" element={<MissingNumbers />} />
      <Route path="/numbercompare" element={<NumberCompare />} />
      <Route path="/substraction" element={<Substraction />} />
      <Route path="/set" element={<Set />} />
      <Route path="/clock" element={<Clock />} />
    </Routes>
    
    
      
    </div>
  );
}

export default App;
