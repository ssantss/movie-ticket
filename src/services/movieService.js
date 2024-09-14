import axios from 'axios';
import { format, parseISO, addHours, isWithinInterval } from 'date-fns';
import { supabase } from '../utils/supabaseClient';

const API_KEY = "c4caa58d";
const BASE_URL = "http://www.omdbapi.com/";

export async function fetchAndUpdateMovies() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const url = `https://funciones.cinecolombia.com/cineco/get-performances-by-params?cinemaId=702&date=${today}&deviceOS=Linux&browserName=Chrome+128`;

  try {
    // Verificar si ya tenemos datos actualizados para hoy en Supabase
    const { data: existingData, error } = await supabase
      .from('movies')
      .select('id')
      .eq('last_updated', today)
      .limit(1);

    if (error) {
      console.error('Error checking existing data:', error);
      return null;
    }

    if (existingData.length === 0) {
      // Si no hay datos para hoy, obtenerlos de la API y actualizar Supabase
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      const moviesWithPosters = await Promise.all(response.data.showtimes.map(fetchPoster));
      console.log('Movies with posters (movies service):', moviesWithPosters);

      // Actualizar Supabase con los nuevos datos
      await updateSupabaseWithMovies(moviesWithPosters, today);

      return moviesWithPosters;
    } else {
      // Si ya hay datos para hoy, obtenerlos de Supabase
      console.log("YA EXISTEN DATOSSS")
      return await getMoviesFromSupabase(today);
    }
  } catch (err) {
    console.error('Error fetching movies:', err);
    throw new Error('Error al cargar las películas. Por favor, intenta de nuevo más tarde.');
  }
}

async function fetchPoster(movie) {
  try {
    const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(movie.name)}`);
    return { ...movie, poster: response.data.Poster };
  } catch (err) {
    console.error('Error fetching poster:', err);
    return { ...movie, poster: 'https://via.placeholder.com/300x450?text=No+Poster' };
  }
}

async function updateSupabaseWithMovies(movies, date) {
  for (const movie of movies) {
    // Insertar o actualizar la película
    const { data, error } = await supabase
      .from('movies')
      .upsert({
        name: movie.name,
        machine_name: movie.machine_name,
        duration: movie.duration,
        classification: movie.classification,
        poster: movie.poster,
        last_updated: date
      }, { onConflict: 'name' })
      .select();

    if (error) {
      console.error('Error upserting movie:', error);
      continue;
    }

    const movieId = data[0].id;

    // Eliminar showtimes antiguos para esta película y fecha
    await supabase
      .from('showtimes')
      .delete()
      .eq('movie_id', movieId)
      .eq('date', date);

    // Crear un conjunto para almacenar PerformanceIds únicos
    const uniquePerformances = new Set();

    // Insertar nuevos showtimes
    for (const showtime of movie.showtimes) {
      for (const performance of showtime.performances) {
        // Verificar si ya hemos procesado este performance
        if (uniquePerformances.has(performance.PerformanceId)) {
          continue;
        }
        
        uniquePerformances.add(performance.PerformanceId);

        const { error: insertError } = await supabase
          .from('showtimes')
          .insert({
            movie_id: movieId,
            date: date,
            datetime: performance.DateTime,
            format: showtime.attributes.format,
            language: showtime.attributes.language,
            hall: performance.Hall,
            performance_id: performance.PerformanceId // Añadimos este campo para referencia futura
          });

        if (insertError) {
          console.error(`Error insertando showtime para ${movie.name}:`, insertError);
        }
      }
    }
  }
}

async function getMoviesFromSupabase(date) {
  const { data, error } = await supabase
    .from('movies')
    .select(`
      *,
      showtimes (*)
    `)
    .eq('last_updated', date)
    .order('name');

  if (error) {
    console.error('Error fetching movies from Supabase:', error);
    return null;
  }

  return data;
}

export function formatShowtime(dateTimeString) {
  return format(parseISO(dateTimeString), 'h:mm a');
}

export function isShowtimeWithinNextThreeHours(dateTimeString) {
  const showtimeDate = parseISO(dateTimeString);
  const now = new Date();
  const threeHoursLater = addHours(showtimeDate, 3);
  return isWithinInterval(now, { start: showtimeDate, end: threeHoursLater });
}

export function sortMovies(movies) {
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
}

export function seatNumberRandom() {
  const letters = 'ABCDEFGHIJKL';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  return `${randomLetter}${randomNumber}`;
}