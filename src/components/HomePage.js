import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { format, parseISO, addHours, isWithinInterval, differenceInMinutes } from 'date-fns';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { fetchAndUpdateMovies } from '../services/movieService';
const API_KEY = "c4caa58d";
const BASE_URL = "http://www.omdbapi.com/";

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    
    // Actualizar la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetchAndUpdateMovies();
      console.log('API Response:', response);
      setMovies(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Error al cargar las películas. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  const formatShowtime = (dateTimeString) => {
    return format(parseISO(dateTimeString), 'h:mm a');
  };

  const formatCurrentTime = (date) => {
    return format(date, ' h:mm:ss a');
  };

  const isShowtimeWithinNextThreeHours = (dateTimeString) => {
    const showtimeDate = parseISO(dateTimeString);
    const now = new Date();
    const threeHoursLater = addHours(now, 3);
    return isWithinInterval(showtimeDate, { start: now, end: threeHoursLater });
  };

  const getNextShowtime = (showtimes) => {
    const now = new Date();
    return showtimes
      .map(showtime => ({
        ...showtime,
        minutesUntilShowtime: differenceInMinutes(parseISO(showtime.datetime), now)
      }))
      .filter(showtime => showtime.minutesUntilShowtime >= 0)
      .sort((a, b) => a.minutesUntilShowtime - b.minutesUntilShowtime)[0];
  };

  const sortMovies = (movies) => {
    return movies.sort((a, b) => {
      const aNextShowtime = getNextShowtime(a.showtimes);
      const bNextShowtime = getNextShowtime(b.showtimes);
      
      if (!aNextShowtime && !bNextShowtime) return 0;
      if (!aNextShowtime) return 1;
      if (!bNextShowtime) return -1;
      
      return aNextShowtime.minutesUntilShowtime - bNextShowtime.minutesUntilShowtime;
    });
  };

  const seatNumberRandom = () => {
    const letters = 'ABCDEFGHIJKL';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return `${randomLetter}${randomNumber}`;
  };

  const handleChipClick = (movie, showtime) => {
    const movieData = {
      title: movie.name,
      spanishTitle: movie.machine_name,
      rating: movie.classification,
      duration: movie.duration,
      theater: "Victoria", // Asumiendo que es siempre Victoria, ajusta si es necesario
      date: format(parseISO(showtime.datetime), 'dd MMMM yyyy'),
      time: format(parseISO(showtime.datetime), 'h:mm a'),
      format: showtime.format,
      language: showtime.language,
      hall: showtime.hall,
      seats: 1, // Asumiendo 1 asiento, ajusta según necesidades
      seatNumber: seatNumberRandom(),
      posterUrl: movie.poster
    };

    navigate('/ticket', { state: { movieData } });
  };

  const shouldPulse = (minutesUntilShowtime) => {
    return minutesUntilShowtime >= 0 && minutesUntilShowtime <= 180; // 3 hours = 180 minutes
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mt: 4 }}>
        Cartelera Cine Colombia - {formatCurrentTime(currentTime)}
      </Typography>
      <Grid container spacing={3}>
        {sortMovies(movies).map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                height="450"
                image={movie.poster}
                alt={movie.name}    
                sx={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {movie.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.machine_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duración: {movie.duration} minutos
                </Typography>
                <Box mt={2}>
                  <Typography variant="subtitle2">Horarios:</Typography>
                  {movie.showtimes.map((showtime, index) => (
                    <Box key={index} mt={1}>
                      <Typography variant="body2">
                        {showtime.format} - {showtime.language}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        <Chip 
                          key={showtime.id} 
                          label={formatShowtime(showtime.datetime)} 
                          size="small"
                          color={shouldPulse(differenceInMinutes(parseISO(showtime.datetime), new Date())) ? "error" : "primary"}
                          variant="outlined"
                          onClick={() => handleChipClick(movie, showtime)}
                          sx={shouldPulse(differenceInMinutes(parseISO(showtime.datetime), new Date())) ? {
                            animation: `${pulseAnimation} 2s infinite`,
                            fontWeight: 'bold'
                          } : {}}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;