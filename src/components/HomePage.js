import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Card, CardMedia, CardContent, Chip, LinearProgress } from '@mui/material';
import { format, parseISO, addMinutes, addHours , isAfter, isBefore, differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { fetchAndUpdateMovies } from '../services/movieService';
import { PlayArrow, Stop, Schedule } from '@mui/icons-material';

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
  
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  const fetchMovies = async () => {
    try {

      const result = await fetchAndUpdateMovies();
      setMovies(result);
      setLoading(false);
    } catch (err) {
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

  const isShowtimePulsating = (dateTimeString) => {
    const showtimeDate = parseISO(dateTimeString);
    const now = new Date();
    const threeHoursLater = addHours(showtimeDate, 3);
    return isAfter(now, showtimeDate) && isBefore(now, threeHoursLater);
  };

  const sortMovies = (movies) => {
    return movies.sort((a, b) => {
      const aHasPulsating = a.showtimes.some(showtime => isShowtimePulsating(showtime.datetime));
      const bHasPulsating = b.showtimes.some(showtime => isShowtimePulsating(showtime.datetime));
      
      if (aHasPulsating && !bHasPulsating) return -1;
      if (!aHasPulsating && bHasPulsating) return 1;
      return 0;
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
      duration: parseInt(movie.duration),
      theater: "Victoria", 
      date: format(parseISO(showtime.datetime), 'dd MMMM yyyy'),
      time: format(parseISO(showtime.datetime), 'h:mm a'),
      format: showtime.format,
      language: showtime.language,
      hall: showtime.hall,
      seats: 1, 
      seatNumber: seatNumberRandom(),
      posterUrl: movie.poster
    };

    navigate('/ticket', { state: { movieData } });
  };

  const getMovieProgress = (showtime, duration) => {
    const now = new Date();
    const startTime = parseISO(showtime.datetime);
    const endTime = addMinutes(startTime, duration);

    if (isBefore(now, startTime)) {
      return (
        <Box display="flex" alignItems="center">
          <Schedule color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">Comienza {formatDistanceToNow(startTime, { addSuffix: true, locale: es })}</Typography>
        </Box>
      );
    } else if (isAfter(now, endTime)) {
      return (
        <Box display="flex" alignItems="center">
          <Stop color="error" sx={{ mr: 1 }} />
          <Typography variant="body2">Finalizada</Typography>
        </Box>
      );
    } else {
      const elapsedMinutes = differenceInMinutes(now, startTime);
      const progress = (elapsedMinutes / duration) * 100;
      return (
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <PlayArrow color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">En progreso</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 5 }} />
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption">{elapsedMinutes} min</Typography>
            <Typography variant="caption">{duration - elapsedMinutes} min restantes</Typography>
          </Box>
        </Box>
      );
    }
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
                  {getMovieProgress(movie.showtimes[0], parseInt(movie.duration))}
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle2">Horarios:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {movie.showtimes.map((showtime) => (
                      <Chip 
                        key={showtime.id}
                        label={formatShowtime(showtime.datetime)} 
                        size="small"
                        color={isShowtimePulsating(showtime.datetime) ? "error" : "primary"}
                        variant="outlined"
                        onClick={() => handleChipClick(movie, showtime)}
                        sx={isShowtimePulsating(showtime.datetime) ? {
                          animation: `${pulseAnimation} 1s infinite`,
                          fontWeight: 'bold'
                        } : {}}
                      />
                    ))}
                  </Box>
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