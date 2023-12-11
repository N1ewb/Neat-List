import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Header from "./components/Header";

function App() {
 
    
    return (
      <>
      <BrowserRouter>
      <Header />
      <Routes>
          <Route path="/" index element={<Home />}/>
          <Route path='Login' element={<LoginPage />} />
          <Route path="Signup" element={<SignupPage />} />
      </Routes>
      </BrowserRouter>
    </>
    );
}
export default App;