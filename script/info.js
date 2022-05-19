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
    let recommendationsURL

    

    

    if(mediaType === 'movie'){
        apiURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-UK`

        ccURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-UK`

        videoURL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-UK`

        recommendationsURL = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=en-UK&page=1`
    } else {
        apiURL = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-UK`

        ccURL = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}&language=en-UK`

        videoURL = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-UK`

        recommendationsURL = `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}&language=en-UK&page=1`
    }

    

    fetch(apiURL)
    .then(res => res.json())
    .then(item => {
        //console.log(item)
        
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
        castCrewList(ccURL, 'director')
        castCrewList(ccURL, 'cast')
        

        //Fetch similiar movies / tv series
        recommendations()
       
    })
    .catch(err => console.log(err))



    function backdrop(item){
        fetch(imgApi)
        .then(res => res.json())
        .then(data => {

            //console.log(data)
            const baseURL = data.images.base_url;
            const backdropSize = data.images.backdrop_sizes[2];
            const backdropPath = item.backdrop_path;
            const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;

            
            $('#hero-bg').css('background-image', `url(${uniqueURL})`)
        })
    }

    function trailer(url){
        fetch(url)
        .then(res => res.json())
        .then(data =>{
            //console.log(data)
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
            //console.log($('iframe'))
        })
    }

    function castCrewList(castCrewUrl, placement){
        fetch(castCrewUrl)
        .then(res => res.json())
        .then(data => {
           // console.log(data, placement, 'castCrewList')


            let profileName;
            let profileId;
            let appendTo;
            if(placement === 'director'){
                appendTo = placement
                //If the crew length is 0 = Directors doesn't exist
                if(data.crew.length === 0){
                    profileName = 'No Directors'
                    $(`#${placement}-list`).append(profileName)
                    //alert('hh')
                } else{
                    for(let i = 0; i < data.crew.length; i++){
                        //If crew length is > 0 = Possibility director exists
                        if(data.crew[i].job != 'Director'){
                            if(i === data.crew.length - 1){
                                //Having looped thru every item and director still doesn't exist, do this v
                                $(`#${placement}-list`).append('No Directors')
                            } else{
                                //Continue iteration
                                continue
                            }
                        } else{
                            profileName = data.crew[i].name
                            profileId = data.crew[i].id
                            appendTo = placement
                            personImg(appendTo, data, profileId, profileName)
                            break
                        }
                    }
                }
            } else{
                appendTo = placement;
                for(let i = 0; i < 5; i++){
                    profileName = data.cast[i].name;
                    profileId = data.cast[i].id;
                    personImg(appendTo, data, profileId, profileName)
                }
            }

        })
    }

    function personImg(appendTo, castCrewList, profileId, profileName){
        //console.log(castCrewList, 'personImg')

        fetch(`https://api.themoviedb.org/3/person/${profileId}/images?api_key=${apiKey}`)
        .then(res => res.json())
        .then( data => {
            //console.log(data, 'personImg Fetch request')
            //console.log(castCrewList)

            if(data.profiles.length > 0){
                $(`#${appendTo}-list`).append(`
                <div class="profile">
                    <div id="${data.id}-img" class="img-container"></div>
                    <div id="${appendTo}-name">${profileName}</div>
                </div>
                `)

                $(`#${data.id}-img`).css('background-image', `url(https://image.tmdb.org/t/p/w185${data.profiles[0].file_path})`)
            } else{
                $(`#${appendTo}-list`).append('No image was found')
            }

        })
    }

    function recommendations(){
        fetch(recommendationsURL)
        .then(res => res.json())
        .then(data => {
            //console.log(data)

            let name;
            let id;
            let posterPath;
            const postAmount = 14;
            for(let i = 0; i < postAmount; i++){
                if(mediaType === 'movie'){
                    if(data.results.length === 0){
                        $('#recommendations__container').text('No recommendations were found') 
                    } else{
                        name = data.results[i].title
                        id = data.results[i].id
                        posterPath = data.results[i].poster_path
                        getPoster(id, posterPath, postAmount)
                    }
                } else{
                    name = data.results[i].name
                    id = data.results[i].id
                    posterPath = data.results[i].poster_path
                    getPoster(id, posterPath, postAmount)
                }
            }
        })
    }

    function getPoster(id, posterPath, postAmount){
        fetch(imgApi)
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            const baseURL = data.images.base_url;
            const posterSize = data.images.poster_sizes[1]
            
            function post(postAmount){
                let uniqueURL =`${baseURL}${posterSize}${posterPath}`;
                //console.log(uniqueURL)

                let element = $(`
                    <a href="info.html" id="${id}"class="item ${mediaType}">
                        <img class="overlay poster" src="${uniqueURL}">
                    </a>
                `);

                $('#recommendations__container').append(element)
            }

            post(postAmount)

            
            const poster = document.querySelectorAll('a[href="info.html"]');
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
        
        })
    }

    //When window loads
    function onLoad(){
        if(localStorage.getItem(`${mediaType}-${id}`)){
            $('#favourites').css('color', '#EB5353')
        } else{
            $('#favourites').css('color', '')
        }
    }

    onLoad()

    $('#favourites').click(() =>{
        const favourited = localStorage.getItem(`${mediaType}-${id}`);
        if(favourited){
            localStorage.removeItem(`${mediaType}-${id}`)
            $('#favourites').css('color', '')
            $('#favourites').removeClass('favourites-animation')
        } else{
            localStorage.setItem(`${mediaType}-${id}`, `${id}`)
            $('#favourites').css('color', '#EB5353')
            $('#favourites').addClass('favourites-animation')
        }
    })

    //Trailer
    function trailer(videoUrl) {
        fetch(videoUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let key;
            
            for(let i = 0; i < data.results.length; i++){
                if(data.results[i].type === 'Trailer' && data.results[i].site === 'YouTube'){
                    key = data.results[i].key;
                    break
                } else {
                    continue
                    // key = data.results[i].key;
                }
            }
    
            const link = `https://www.youtube.com/embed/${key}`;
            document.querySelector('iframe').src = link;

            $('#trailer').css('display', 'grid')
            $('body').css('overflow', 'hidden')
    
        })
    }

    //Open trailer
    $('#trailer-button').click(() => {
        trailer(videoURL)
    })

    //Close trailer
    $('#close-trailer-button').click(() =>{
        $('#trailer').hide()
        $('body').css('overflow', 'initial')
        $('iframe').attr('src', '')
    })

    // trailer(videoURL)
    

})