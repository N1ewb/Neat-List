import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './pages/Search';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <>
      <Router>
        <div className='App'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/Home' element={<Home />}/>
          <Route path='/LoginPage' element={<LoginPage />}/>
          <Route path='/SignupPage' element={<SignupPage />}/>
        </Routes>
        </div>
    </Router>
    </>
  );
}

export default App;
