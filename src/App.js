import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import TicketPage from './components/TicketPage';

function App() {
  return (
    <Router>
      <Box className="App" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
       
      }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ticket" element={<TicketPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;