import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DBProvider } from './context/dbContext';
import { useTranslation } from "react-i18next";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const languages = [
  { value: "en", text: "Langauge" },
  { value: "en", text: "English" },
  { value: "ja", text: "Japanese" },
  { value: "zh", text: "Chinese" },
  { value: 'ko', text: 'Korean'},
  { value: 'fr', text: 'French'},
  { value: "hi", text: "Hindi" }
];

function App() {
  const { t } = useTranslation();

  return (
    <>
    <AuthProvider>
      <DBProvider>
      <Router>
        <div className='App'>
        
          <Routes>
            <Route path="/" element={<LandingPage languages={languages} t={t} />} />
            <Route path='/Dashboard' element={<Home t={t} />}/>
            <Route path='/LoginPage' element={<LoginPage t={t} languages={languages}/>}/>
            <Route path='/SignupPage' element={<SignupPage t={t} languages={languages} />}/>
          </Routes>
          
        </div>
      </Router>
      </DBProvider>
    </AuthProvider>
    </>
  );
}

export default App;
