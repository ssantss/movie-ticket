import React from 'react';
import { Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#f6f6f6', py: 2, mt: 'auto' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <img src="/logo_cineco_blue.svg" alt="Cine Colombia" style={{ height: '32px' }} />
      </Container>
    </Box>
  );
};

export default Footer;