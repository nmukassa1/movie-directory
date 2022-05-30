$(document).ready(function(){

    //FETCH API

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    const discoverMovieApi = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&year=${year}&sort_by=popularity.desc&with_original_language=en`;
    const discoverTvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1&year=${year}&sort_by=popularity.desc&with_original_language=en`;

    const trendingMovieApi = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
    const trendingTvApi = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;

    const popularMoviesApi = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    const popularTvApi = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`

    class Get {
        constructor(url, place, mediaType){
            this.url = url;
            this.place = place;
            this.mediaType = mediaType
        }
        getItems(){
            fetch(this.url)
            .then(res => res.json())
            .then(data => {
                const items = data;
                //console.log(items)
                

                fetch(imgApi)
                .then(res => res.json())
                .then(data => {
                    //console.log(data)
                    const baseURL = data.images.base_url;
                    const backdropSize = data.images.backdrop_sizes[0];
                    //const backdropPath = items.results[8].backdrop_path;
                    let posterPath;

                    // const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;
                    //console.log(uniqueURL)

                    const mediaType = this.mediaType;
                    const locationContainer = $(`#${this.place}`);
                    function post(){
                        let loopCount = 10;
                        for(let i = 0; i < loopCount; i++){
                            if(items.results[i].poster_path == null){
                                loopCount++
                                continue

                            } else{
                                posterPath = items.results[i].poster_path;
                                const uniqueURL =`${baseURL}${backdropSize}${posterPath}`;
        
                                let element = $(`
                                    <a href="page/info.html" id="${items.results[i].id}"class="item ${mediaType}">
                                        <img class="overlay poster" src="${uniqueURL}">
                                    </a>
                                `);
        
                                locationContainer.append(element)
                            }
                        }
                    }

                    post()

                    
                    const poster = document.querySelectorAll('a[href="page/info.html"]');
                    poster.forEach(item => {
                        item.addEventListener('click', function(){
                            if(item.classList.contains('movie')){
                                localStorage.setItem('mediaType', `movie`)
                            } else{
                                localStorage.setItem('mediaType', `tv`)
                            }
                            localStorage.setItem('id', `${item.id}`)
                            //localStorage.setItem('mediaType', `${item.id}`)
                        })
                    })
                
                }) //SECOND FETCH END
            }) //FIRST GETCH END
            .catch(err => console.log(err))
        } //FUNCTION END


    }

    const movieTrending = new Get(trendingMovieApi, 'trending-movie-container', 'movie');
    movieTrending.getItems()

    
    

    const tvContainer = new Get(trendingTvApi, 'trending-tv-container', 'tv');
    //tvContainer.getItems()

    




}) //END