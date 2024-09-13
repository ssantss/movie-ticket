import React from 'react';
import Header from './components/Header';
import MovieTicket from './components/MovieTicket';

const movieData = {
  title: "Harold and The Purple Crayon",
  spanishTitle: "Harold Y Su Crayon Magico",
  rating: "Para todo el Público",
  duration: 92,
  theater: "Victoria",
  date: "2 de agosto 2024",
  time: "8:40 PM",
  format: "2D",
  language: "Doblado",
  hall: "03",
  seats: 1,
  seatNumber: "H13",
  posterUrl: "https://archivos-cms.cinecolombia.com/images/8/2/0/3/63028-1-esl-CO/85c52d9743d5-hrld-cine-colombia-banner-web-480x670px-ctafecha.jpg" // Asegúrese de tener una URL válida para el póster
};

function App() {
  return (
    <div className="App">
      <Header />
      <MovieTicket movieData={movieData} />
    </div>
  );
}

export default App;