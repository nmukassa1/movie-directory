$('document').ready(function(){

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
  
    const mediaType = localStorage.getItem('mediaType');
    const id = localStorage.getItem('id');
    let apiURL;

    //VIDEO URL CONDITIONAL

    let ccURL;
    let videoURL;

    if(mediaType === 'movie'){
        apiURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-UK`

        ccURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-UK`

        videoURL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-UK`
    } else {
        apiURL = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-UK`

        ccURL = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-UK`

        videoURL = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-UK`
    }

    

    fetch(apiURL)
    .then(res => res.json())
    .then(item => {
        console.log(item)
        
        $('#title').text(item.title || item.name)



        let releaseDateArr;
        if(item.release_date){
            releaseDateArr = item.release_date.split('-')
        } else{
            releaseDateArr = item.first_air_date.split('-')
        }
        const releaseDate = [releaseDateArr[2], releaseDateArr[1], releaseDateArr[0]].join('-');
        $('#release').text(releaseDate)




        let genresArr = [];
        item.genres.forEach(gn =>{
            genresArr.push(gn.name)
        })
        $('#genre').text(genresArr.join(', '))

        $('#bio').text(item.overview)
        
        let runtime;
        if(item.runtime){
            runtime = item.runtime
        } else{
            runtime = item.episode_run_time
        }
        let hr;
        const min = `${runtime % 60}m`;
        
        if(runtime > 60){
            hr = `${Math.floor(runtime / 60)}h`;
        }
        
        $('#hr').text(hr);
        $('#min').text(min);
        backdrop(item)
        //trailer(videoURL)






        //CAST & CREW REQUEST
        castCrew(ccURL)
        
       
    })
    .catch(err => console.log(err))



    function backdrop(item){
        fetch(imgApi)
        .then(res => res.json())
        .then(data => {

            console.log(data)
            const baseURL = data.images.base_url;
            const backdropSize = data.images.backdrop_sizes[1];
            const backdropPath = item.backdrop_path;
            const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;

            $('#hero').css('background-image', `url(${uniqueURL})`)
        })
    }

    function trailer(url){
        fetch(url)
        .then(res => res.json())
        .then(data =>{
            console.log(data)
            let key;
            for(let i = 0; i < data.results.length; i++){
                if(data.results[i].site === `YouTube` && data.results[i].type === `Trailer`){
                    key = data.results[i].key;
                    break
                } else{
                    continue
                }
            }
            const link = `https://www.youtube.com/embed/${key}?autoplay=1`;

            $('iframe').attr('src', link)
            console.log($('iframe'))
        })
    }

    function castCrew(castCrewUrl){
        fetch(castCrewUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const crewArr = data.crew;

            let director;
            let directorId;
            for(let i = 0; i < crewArr.length; i++){
                if(crewArr[i].job != 'Director'){
                    continue
                } else{
                    director = crewArr[i].name
                    directorId = crewArr[i].id
                    break
                }
            }
            $('#director-name').text(director)

            personImg(directorId)

        })
    }

    function personImg(id){
        fetch(`https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`)
        .then(res => res.json())
        .then( data => {
            console.log(data)

            if(data.profiles.length >! 1){
                $("#director-img").css('background-image', `url(https://image.tmdb.org/t/p/w45${data.profiles[0].file_path})`)
            } else{
                $('#director-img').text('No image was found')
            }

        })
    }

    
})