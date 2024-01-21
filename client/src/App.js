import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './LandingPage/home';
import Service from './Services/main';
import Career from './Career/main';
import Application from './Career/application';
import Meeting from './Schedule Meeting/main';
import Api from './API/main';

import Navbar from './constants/navbar';
import Footer from './constants/footer';

function App() {

  
  return (
    <>
    <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Main/>} />
          <Route path='/services' element={<Service/>} />
          <Route path='/career' element={<Career/>} />
          <Route path='/api' element={<Api/>} />
          <Route path='/application' element={<Application/>} />
          <Route path='/schedule-Meeting' element={<Meeting/>} />
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
