import React from 'react';
import './App.css';
import Home from './component/Home';
// import Ledger from './component/Ledger.jsx';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
//auth
import Login from './component/Login';
import Notfoundpage from './component/NotFound.jsx';




function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />       
        <Route exact path="/login" element={<Login />} />
        {/* <Route exact path="/Ledger" element={<Ledger />} /> */}
        <Route path='*' element = {<Notfoundpage/>} />
      </Routes>
    </Router>

  );
}

export default App;