//FETCH API

const year = new Date().getFullYear();
const apiKey = '335228310c6b751750199c1a453b7347';
//Api to get image details like sizes and logos
const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
const discoverMovieApi = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&year=${year}&sort_by=vote_count.desc`;
const discoverTvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1&year=${year}&sort_by=vote_count.desc`;


