import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip, Grid, SvgIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LocationIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 384 512">
    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
  </SvgIcon>
);

const MovieTicket = ({ movieData }) => {
  return (
    <Box sx={{ padding: 2, backgroundColor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ArrowBackIcon sx={{ mr: 1, color: '#1c508d' }} />
      </Box>
      <Card sx={{ display: 'flex', mb: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={movieData.posterUrl}
          alt={movieData.title}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {movieData.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Título en español: {movieData.spanishTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movieData.rating} - {movieData.duration} min
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LocationIcon sx={{fontSize: '0.75rem' ,mr: 0.5, color: '#1c508d' }} />
            <Typography variant="body2">{movieData.theater}</Typography>
          </Box>
          <Typography variant="body2">
            {movieData.date} {movieData.time}
          </Typography>
          <Typography variant="body2">
            {movieData.format} - {movieData.language}
          </Typography>
          <Typography variant="body2">
            Sala {movieData.hall}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            General {movieData.seats} sillas
          </Typography>
          <Chip label={movieData.seatNumber} color="success" size="small" sx={{ mt: 1 }} />
        </CardContent>
      </Card>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
        <img 
          src="https://boletas.cinecolombia.com/images/qr/YoJoHlhqentBU9RXxC0lB.png" 
          alt="QR Code"
          style={{ width: '250px', height: '250px' }}
        />
      </Box>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <img 
          src="/logo_cineco.svg" 
          alt="Cine Colombia Logo" 
          style={{ width: '250px', height: 'auto' }}
        />
      </Box>
      <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            Información Legal
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            Contáctanos PQRS
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieTicket;