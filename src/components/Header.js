import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <img src="/logo_cineco.svg" alt="Cine Colombia Logo" style={{ height: '30px', cursor: 'pointer' }} onClick={handleLogoClick} />
          </Box>
          <Box sx={{ backgroundColor: '#1976d2', borderRadius: '20px', padding: '4px 12px' }}>
            <Typography variant="button" sx={{ color: 'white' }}>sj</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' },
        backgroundColor: 'white', 
        padding: '8px 16px', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 'bold' }}>Pereira</Typography>
        <LocationOnIcon fontSize="small" sx={{ color: '#1c508d' }} />
      </Box>
      <Box sx={{ 
        backgroundColor: 'white', 
        padding: '16px',
        pt: '4px',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', pl: { md: '23%' }, }}>
          Mis Compras
        </Typography>
      </Box>
    </>
  );
};

export default Header;