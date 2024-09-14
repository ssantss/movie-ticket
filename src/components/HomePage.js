import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { format, parseISO, addHours, isWithinInterval } from 'date-fns';
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

    fetchMovies2();
    
  
    // Actualizar la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);


  const fetchMovies2 = async () => {
    try {
      console.log('Iniciando fetchAndUpdateMovies');
      const result = await fetchAndUpdateMovies();
      console.log('Resultado de fetchAndUpdateMovies:', result);
      setLoading(false);
    } catch (err) {
      console.error('Error en fetchAndUpdateMovies:', err);
      setError('Error al cargar las películas. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const url = `https://funciones.cinecolombia.com/cineco/get-performances-by-params?cinemaId=702&date=${today}&deviceOS=Linux&browserName=Chrome+128`;
    console.log(url)

    try {
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      const moviesWithPosters = await Promise.all(response.data.showtimes.map(fetchPoster));
      console.log('Movies with posters (1):', moviesWithPosters);
      setMovies(moviesWithPosters);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Error al cargar las películas. Por favor, intenta de nuevo más tarde.');
      setLoading(false);
    }
  };

  const fetchPoster = async (movie) => {
    try {
      const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(movie.name)}`);
      return { ...movie, poster: response.data.Poster };
    } catch (err) {
      console.error('Error fetching poster:', err);
      return { ...movie, poster: 'https://via.placeholder.com/300x450?text=No+Poster' };
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
    const threeHoursLater = addHours(showtimeDate, 3);
    return isWithinInterval(now, { start: showtimeDate, end: threeHoursLater });
  };

  const sortMovies = (movies) => {
    return movies.sort((a, b) => {
      const aHasUpcoming = a.showtimes.some(showtime => 
        showtime.performances.some(performance => 
          isShowtimeWithinNextThreeHours(performance.DateTime)
        )
      );
      const bHasUpcoming = b.showtimes.some(showtime => 
        showtime.performances.some(performance => 
          isShowtimeWithinNextThreeHours(performance.DateTime)
        )
      );
      
      if (aHasUpcoming && !bHasUpcoming) return -1;
      if (!aHasUpcoming && bHasUpcoming) return 1;
      return 0;
    });
  };

  const seatNumberRandom = () => {
    const letters = 'ABCDEFGHIJKL';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    return `${randomLetter}${randomNumber}`;
  };

  const handleChipClick = (movie, performance) => {
    const movieData = {
      title: movie.name,
      spanishTitle: movie.machine_name,
      rating: movie.classification,
      duration: parseInt(movie.duration),
      theater: "Victoria", // Asumiendo que es siempre Victoria, ajusta si es necesario
      date: format(parseISO(performance.DateTime), 'dd MMMM yyyy'),
      time: format(parseISO(performance.DateTime), 'h:mm a'),
      format: performance.attributes.format,
      language: performance.attributes.language,
      hall: performance.Hall,
      seats: 1, // Asumiendo 1 asiento, ajusta según necesidades
      seatNumber: seatNumberRandom(),
      posterUrl: movie.poster
    };

    navigate('/ticket', { state: { movieData } });
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
                sx={{ objectFit: 'contain', width: '100%', height: '100%',  }}
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
                        {showtime.attributes.format} - {showtime.attributes.language}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {showtime.performances.map((performance, perfIndex) => {
                          const isWithinThreeHours = isShowtimeWithinNextThreeHours(performance.DateTime);
                          return (
                            <Chip 
                              key={perfIndex} 
                              label={formatShowtime(performance.DateTime)} 
                              size="small"
                              color={isWithinThreeHours ? "error" : "primary"}
                              variant="outlined"
                              onClick={() => handleChipClick(movie, {...performance, attributes: showtime.attributes})}
                              sx={isWithinThreeHours ? {
                                animation: `${pulseAnimation} 2s infinite`,
                                fontWeight: 'bold'
                              } : {}}
                            />
                          );
                        })}
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