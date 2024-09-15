import axios from 'axios';
import { format, parseISO, addHours,addDays,  isWithinInterval } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { supabase } from '../utils/supabaseClient';


const API_KEY = "c4caa58d";
const BASE_URL = "http://www.omdbapi.com/";

function convertToAPIFormat(supabaseDateTime) {
  // Parsea la fecha de Supabase
  const date = parseISO(supabaseDateTime);
  
  // Convierte a la zona horaria de Colombia (UTC-5)
  const colombiaTimeZone = 'America/Bogota';
  const dateInColombia = toZonedTime(date, colombiaTimeZone);
  
  // Formatea la fecha al formato de la API
  return format(dateInColombia, "yyyy-MM-dd'T'HH:mm:ssxxx");
}

export async function fetchAndUpdateMovies() {
  const today = format(new Date(), 'yyyy-MM-dd');
  // const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  const url = `https://funciones.cinecolombia.com/cineco/get-performances-by-params?cinemaId=702&date=${today}&deviceOS=Linux&browserName=Chrome+128`;

  try {
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

      return await getMoviesFromSupabase(today);
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

    // Preparar los showtimes para inserción masiva
    const showtimesToUpsert = movie.showtimes.flatMap(showtime => 
      showtime.performances.map(performance => ({
        movie_id: movieId,
        date: date,
        datetime: performance.DateTime, // Ya incluye la zona horaria correcta
        format: showtime.attributes.format,
        language: showtime.attributes.language,
        hall: performance.Hall,
        performance_id: performance.PerformanceId
      }))
    );

    // Realizar upsert masivo de showtimes
    const { error: showtimesError } = await supabase
      .from('showtimes')
      .upsert(showtimesToUpsert, {
        onConflict: 'movie_id,date,performance_id',
        ignoreDuplicates: false
      });

    if (showtimesError) {
      console.error('Error upserting showtimes:', showtimesError);
    } else {
      console.log(`Showtimes updated successfully for movie: ${movie.name}`);
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

  // Convertir las fechas de las funciones al formato de la API
  const formattedData = data.map(movie => ({
    ...movie,
    showtimes: movie.showtimes.map(showtime => ({
      ...showtime,
      datetime: convertToAPIFormat(showtime.datetime)
    }))
  }));

  return formattedData;
}

export function formatShowtime(dateTimeString) {
  return format(parseISO(dateTimeString), 'h:mm a');
}

