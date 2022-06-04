$(document).ready(function(){

    //FETCH API

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    let page = 1;
    // let movieUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
    // let tvUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;

    //DEAFULT URL WHEN PAGE IS LOADED
    let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;

    let genreArr = [];

    

    const getData = async (url, appendTo, mediaType) =>{
        const startPoint = await fetch(url);   
        //HANDLE 404 ERRORS
    //    if(startPoint.status === 404) throw `Page doesn't exist`

        const data = await startPoint.json();
        //console.log(data)

        //APPEND MOVIE / TV POSTER
        for(let i = 0; i < data.results.length; i++){
            const posterPath = data.results[i].poster_path;
        
            //Fecth img base-url & img-size
            const fetchImgData = await fetch(imgApi);
            const imgData = await fetchImgData.json();

            const baseUrl = imgData.images.base_url;
            const backdropSize = imgData.images.poster_sizes[4];

            const imgSrcLink = baseUrl + backdropSize + posterPath;
            //console.log(imgSrcLink)

            // <a class="poster ${mediaType}" id="${data.results[i].id}" href="page/info.html"><img src="${imgSrcLink}"/></a>
            $(appendTo).append(`
                <button class="poster ${mediaType}" id="${data.results[i].id}"><img src="${imgSrcLink}"/></button>
            `)
        }

        //RETRIVE POSTER ID SO I CAN OPEN CORRECT
        //INFO ON NEW PAGE
        await openItemModal()
            
    }

    //TRY CATCH FUNCTION
    async function get(url, appendTo, mediaType){
        try{
            await getData(url, appendTo, mediaType)
        } catch (e){
            console.log(e)
        }
    }

    //DEAFULT SETUP WHEN PAGE IS LOADED
    //get(movieUrl, '.directory', 'movie')
    get(url, '.directory', 'movie')
    localStorage.setItem('mediaType', 'movie')








    //MODAL FUNCTION
    function openItemModal(){
        return new Promise((res) => {
            const poster = document.querySelectorAll('.poster');
            poster.forEach(item => {
                item.addEventListener('click', function(){

                    const id = item.id;

                    

                    if(item.classList.contains('movie')){
                        localStorage.setItem('mediaType', `movie`)
                    } else{
                        localStorage.setItem('mediaType', `tv`)
                    }
                    localStorage.setItem('id', `${item.id}`)
                    
                    $('.modal').css({'height':'90vh'})

                    $('main').css({'overflow':'hidden'})


                    try{
                        openModalFetch(id)
                    } catch(e){
                        console.log(e)
                    }



                })
            })


            



            res()
        })
    }

    $('body').keypress((e) =>{
        if(e.key === 'Enter'){
            $('.modal').css('height', '0')
            $('main').css({'overflow':'initial'})
        }
    })

    async function openModalFetch(id){

        let url;
        if(localStorage.getItem('mediaType') === 'movie'){
            url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-UK`
        } else{
            url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-UK`
        }

        const initiation = await fetch(url);
        const data = await initiation.json();
        console.log(data)

        const backdropPath = data.backdrop_path;

        //Fecth img base-url & img-size
        const fetchImgData = await fetch(imgApi);
        const imgData = await fetchImgData.json();

        
        const baseUrl = imgData.images.base_url;
        const backdropSize = imgData.images.backdrop_sizes[2];

        const imgSrcLink = baseUrl + backdropSize + backdropPath;




        //APPEND DATA   
        $('#hero-bg').css('background-image', `url(${imgSrcLink})`)

        $('#title').text(data.title || data.name)

        $('#bio').text(data.overview)


        //RUNTIME
        let runtime;
        if(data.runtime){
            runtime = data.runtime
        } else{
            runtime = data.episode_run_time
        }
        let hr;
        const min = `${runtime % 60}m`;
        
        if(runtime > 60){
            hr = `${Math.floor(runtime / 60)}h`;
        }
        
        $('#hr').text(hr);
        $('#min').text(min);



        //GENRES
        let genresArr = [];
        data.genres.forEach(genreName =>{
            genresArr.push(genreName.name)
        })
        $('#genre').text(genresArr.join(', '))


        //RELEASE DATE
        let releaseDateArr;
        if(data.release_date){
            releaseDateArr = data.release_date.split('-')
        } else{
            releaseDateArr = data.first_air_date.split('-')
        }
        const releaseDate = [releaseDateArr[2], releaseDateArr[1], releaseDateArr[0]].join('-');
        $('#release').text(releaseDate)



        



    }



    //ADD TO WATCHLIST
    $('#favourites').click(() =>{

        const id = localStorage.getItem('id')
        const mediaType = localStorage.getItem('mediaType')

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

    //When window loads
    // function onLoad(){
    //     if(localStorage.getItem(`${mediaType}-${id}`)){
    //         $('#favourites').css('color', '#EB5353')
    //     } else{
    //         $('#favourites').css('color', '')
    //     }
    // }

    // onLoad()





                 
    $('nav button').click((e) => {
        //WHAT BUTTON AM I CLICKING ON?
        const buttonType = e.target.id;

        if(buttonType === 'movie') {
            loadMedia('.directory', 'movie', buttonType)
            getGenreList('movie')
        }
        if(buttonType === 'tv'){
            loadMedia('.directory', 'tv', buttonType)
            getGenreList('tv')  
        } 
        if(buttonType === 'watchlist') return watchlist()
        if(buttonType === 'filter') return toggle()
    })








    const loadMedia = (appendTo, mediaType, buttonType) =>{
        //EMPTY DIRECTORY
        $('.directory').empty();
        page = 1
        genreArr = []
        console.log(genreArr)
        //console.log(url)
        if(buttonType === 'movie') url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
        
        if(buttonType === 'tv') url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;
        //console.log(url)
        get(url, appendTo, mediaType)
        localStorage.setItem('mediaType', mediaType)
    }
                





   
    const loadMoreItems = () =>{
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;

        const scrolled = window.scrollY;

        //let url;
        const media = localStorage.getItem('mediaType');
        
        if(scrolled === scrollable) {
            page += 1
            let genreStr = genreArr.join(',')
            if(genreArr.length === 0){
                if(media === 'movie'){
                    url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
                } else{
                    url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;
                }
            } else{
                if(media === 'movie'){
                    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${page}&with_genres=${genreStr}`;
                } else{
                    url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${page}&with_genres=${genreStr}`;
                }
            }
            get(url, '.directory', media)
            //console.log(page, url)
        }
    }
    $(window).scroll(loadMoreItems)
    $(window).on('touchmove', () =>{
        loadMoreItems()
    })

    




    //FUNCTION TO APPEND FAVOURITES
    function watchlist(){
        $('.directory').empty();
        
        //Obkect to hold localstorage 
        const obj = {...localStorage};

        //Delete items i don't need
        delete obj.id
        delete obj.mediaType

        //Arry holding id values, so I can use to find out how long loop should last
        //& split tv and movie id
        const arr = Object.keys(obj)
        
        //REVERSE ARRAY SO I CAN SORT BY RECENT ADDED
        arr.reverse()

        if(arr.length === 0) {
            // $('.directory').css('grid-template-columns', '1fr');
            $('.directory').append(`
                <h1>You have nothing in your watch list. Why not add something?</h1>
            `)
        }

        let watchlistUrl;
        //let mediaType;
        for(let i = 0; i < arr.length; i++){
            ridMediaType(arr, i)
        }


    }

   
    const ridMediaType = async (array, i) =>{
        let mediaType;
        const cutFrom = array[i].indexOf('-') + 1;
        const id = array[i].slice(cutFrom, array[i].length);
        //console.log(arr)

        if(array[i].includes('movie')){
            watchlistUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-UK`

            mediaType = 'movie'
        } else{
            watchlistUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-UK`

            mediaType = 'tv'
        }  

        const getPosterPath = await fetch(watchlistUrl);
        const res = await getPosterPath.json();
        const posterPath = res.poster_path;

        //Fecth img base-url & img-size
        const fetchImgData = await fetch(imgApi);
        const imgData = await fetchImgData.json();

        const baseUrl = imgData.images.base_url;
        const backdropSize = imgData.images.poster_sizes[4];

        const imgSrcLink = baseUrl + backdropSize + posterPath;
        //console.log(imgSrcLink)

        $('.directory').append(`
            <a class="poster ${mediaType}" id="${id}" href="page/info.html"><img src="${imgSrcLink}"/></a>
        `)

        //RETRIVE POSTER ID SO I CAN OPEN CORRECT
        //INFO ON NEW PAGE
        await openItemModal()

        //console.log(posterPath)

    }
    



    //GENRE SELECTION SECTION
    
    async function getGenreList(mediaType){
        //const mediaType = localStorage.getItem('mediaType');

        const genreUrl = `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=${apiKey}&language=en-UK`;
        
        const genreFetch = await fetch(genreUrl);
        const genreData = await genreFetch.json();
        const genreContainer = $('.genre ul');
        genreContainer.html('')

        genreData.genres.forEach(item =>{
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="genre-item" id=${item.id}>${item.name}</button>
            `;
            genreContainer.append(li)
        })
        
        //UPDATE DIRECTORY FUNCTION WITH GENRE SEARCH
        
        selectGnere(mediaType)
    }

    function toggle(){
        $('.genre').toggleClass('genre-appear')
    }
    getGenreList('movie')

    function selectGnere(mediaType){
        // let genreArr = [];
        const genreBtn = document.querySelectorAll('.genre-item');
        genreBtn.forEach(item => {
            item.addEventListener('click', () =>{
                if(item.classList.contains('genre-button-toggle')){
                    item.classList.remove('genre-button-toggle')
                    const genreIndex = genreArr.indexOf(item.id)
                    genreArr.splice(genreIndex, 1)
                    console.log(genreArr)
                } else{
                item.classList.add('genre-button-toggle')
                genreArr.push(item.id)
                console.log(genreArr)
                }
            })
        })

        //SEARCH GENRE
        const searchGenreButton = $('#genre-search');
        searchGenreButton.click(() =>{
            let genreStr = genreArr.join(',')
            page = 1;

            if(mediaType === 'movie'){
                url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${page}&with_genres=${genreStr}`;
            } else{
                url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${page}&with_genres=${genreStr}`;
            }


            $('.directory').empty()
            get(url, '.directory', 'movie')
        })
    }
    
})