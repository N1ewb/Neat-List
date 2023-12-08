import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <>
    <AuthProvider>
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
    </AuthProvider>
    </>
  );
}

export default App;
