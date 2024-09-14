import React from 'react';
import { useLocation } from 'react-router-dom';
import MovieTicket from './MovieTicket';

function TicketPage() {
  const location = useLocation();
  const { movieData } = location.state;

  return (
    <div>
      <MovieTicket movieData={movieData} />
    </div>
  );
}

export default TicketPage;