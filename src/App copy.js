import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRealMovies();
  }, []);

  const fetchRealMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://funciones.cinecolombia.com/cineco/get-performances-by-params?cinemaId=702&date=2024-09-12&deviceOS=Linux&browserName=Chrome+128');
      if (response.data && response.data.showtimes) {
        setMovies(response.data.showtimes);
        console.log('Películas extraídas:', response.data.showtimes);
      } else {
        setError('No se encontraron películas');
      }
    } catch (error) {
      console.error('Error fetching real movies:', error);
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const generateTicket = (movie) => {
    if (movie && movie.showtimes && movie.showtimes[0] && movie.showtimes[0].performances && movie.showtimes[0].performances[0]) {
      const performance = movie.showtimes[0].performances[0];
      setSelectedMovie({
        title: movie.name,
        spanishTitle: movie.name, // Asumiendo que el nombre ya está en español
        classification: movie.rating,
        duration: movie.duration,
        cinema: 'Victoria',
        date: new Date(performance.DateTime).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: new Date(performance.DateTime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        format: movie.showtimes[0].attributes.format,
        language: movie.showtimes[0].attributes.language,
        hall: performance.Hall,
        seat: 'H13'
      });
    } else {
      setError('Información de la película incompleta');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white' }}>
      <div style={{ backgroundColor: 'black', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>&lt;</span>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'gray', marginRight: '0.5rem' }}></div>
          <span style={{ fontWeight: 'bold' }}>CINE COLOMBIA</span>
        </div>
        <div style={{ backgroundColor: 'blue', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>sj</div>
      </div>
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Mis Compras</h2>
        {!selectedMovie ? (
          <div>
            {movies.map(movie => (
              <div key={movie.id} style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 'bold' }}>{movie.name}</h3>
                <p>{movie.rating} - {movie.duration} min</p>
                <button 
                  onClick={() => generateTicket(movie)}
                  style={{ backgroundColor: 'blue', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}
                >
                  Generar Ticket
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '33%', marginRight: '1rem', backgroundColor: 'gray', height: '150px' }}></div>
            <div style={{ width: '67%' }}>
              <h3 style={{ fontWeight: 'bold' }}>{selectedMovie.title}</h3>
              <p style={{ fontSize: '0.875rem' }}>Título en español: {selectedMovie.spanishTitle}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedMovie.classification} - {selectedMovie.duration} min</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedMovie.cinema}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedMovie.time} {selectedMovie.date}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedMovie.format} - {selectedMovie.language}</p>
              <p style={{ fontSize: '0.875rem' }}>Sala {selectedMovie.hall}</p>
              <p style={{ fontSize: '0.875rem' }}>General 1 sillas</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'green' }}>{selectedMovie.seat}</p>
            </div>
          </div>
        )}
        {selectedMovie && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div style={{ width: '200px', height: '200px', backgroundColor: 'gray', margin: '0 auto' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;