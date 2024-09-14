import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip, Grid, SvgIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const LocationIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 384 512">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
  </SvgIcon>
);

const MovieTicket = ({ movieData }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white', maxWidth: '800px', width:'100%', margin: '0 auto' }}>
      <Box sx={{ 
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center', 
        mb: 2, 
        cursor: 'pointer' 
      }}>
        <ArrowBackIcon sx={{ mr: 1, color: '#1c508d' }} onClick={handleBackClick} />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        pt: '0',
      }}>
        <Card sx={{ 
          display: 'flex', 
          mb: { xs: 2, md: 0 }, 
          boxShadow: 'none',
          flexDirection: 'row',
          padding: '20px',
          flex: { md: '1' },
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: { xs: '35%', md: '100%' }, 
              objectFit: 'contain',
              borderRadius: '4px',
              maxHeight: { xs: 'auto', md: '450px' },
              alignSelf: 'flex-start'
            }}
            image={movieData.posterUrl}
            alt={movieData.title}
          />
          <CardContent sx={{ 
            flex: '1 0 auto', 
            p: 1,
            width: '70%',
            paddingTop: '0%'
          }}>
            <Typography 
              component="div" 
              variant="h6" 
              sx={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                mb: 0.5, 
                wordBreak: 'break-word'
              }}
            >
              {movieData.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: '500', color: 'black', fontSize: '0.75rem' }}>
              Título en español: {movieData.spanishTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black', fontSize: '0.75rem', fontWeight: '500' }}>
              {movieData.rating} - {movieData.duration} min
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationIcon sx={{fontSize: '0.75rem', mr: 0.5, color: '#1c508d' }} />
              <Typography variant="body2" sx={{ color: 'black', fontSize: '0.75rem', fontWeight: '500' }}>{movieData.theater}</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 0.5 , color: 'black', fontSize: '0.75rem', fontWeight: '500' }}>
              {movieData.date} {movieData.time}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 , color: 'black', fontSize: '0.75rem', fontWeight: '500' }}>
              {movieData.format} - {movieData.language}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 , color: 'black', fontSize: '0.75rem', fontWeight: '500' }}>
              Sala {movieData.hall}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              General <Box component="span" sx={{ fontWeight: 'bold', color: 'black' }}>{movieData.seats} sillas</Box>
            </Typography>
            <Chip 
              label={movieData.seatNumber} 
              size="small" 
              sx={{ 
                mt: 0.5,
                bgcolor: '#00e923',
                color: 'white', 
                '&:hover': {
                  bgcolor: '#00c91f', 
                },
              }} 
            />       
          </CardContent>
        </Card>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: { xs: 'center', md: 'flex-start' },
          flex: { md: '0 0 200px' },
        }}>
          <img 
            src="https://boletas.cinecolombia.com/images/qr/YoJoHlhqentBU9RXxC0lB.png" 
            alt="QR Code"
            style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MovieTicket;