import React from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#f6f6f6', py: 2, mt: 'auto' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/logo_cineco_blue.svg" 
          alt="Cine Colombia" 
          style={{ height: '32px', cursor: 'pointer' }}  
          onClick={handleLogoClick}
        />
      </Container>
    </Box>
  );
};

export default Footer;