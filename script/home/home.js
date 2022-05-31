$(document).ready(function(){

    //FETCH API

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    let page = 1;
    let movieUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
    let tvUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;

    const getData = async (url, appendTo, mediaType) =>{
        const startPoint = await fetch(url);   
        //HANDLE 404 ERRORS
       // if(startPoint.status === 404) throw `Page doesn't exist`

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

            $(appendTo).append(`
                <a class="poster ${mediaType}" id="${data.results[i].id}" href="page/info.html"><img src="${imgSrcLink}"/></a>
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

    function openItemModal(){
        return new Promise((res) => {
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
            res()
        })
    }

    //DEAFULT SETUP WHEN PAGE IS LOADED
    get(movieUrl, '.directory', 'movie')
    localStorage.setItem('mediaType', 'movie')

                 
    $('nav button').click((e) => {
        //WHAT BUTTON AM I CLICKING ON?
        const buttonType = e.target.id;

        if(buttonType === 'movie') return loadMedia(movieUrl, '.directory', 'movie')
        if(buttonType === 'tv') return loadMedia(tvUrl, '.directory', 'tv')
        if(buttonType === 'watchlist') return watchlist()
        if(buttonType === 'filter') return console.log('filter')
    })

    const loadMedia = (url, appendTo, mediaType) =>{
        //EMPTY DIRECTORY
        $('.directory').empty();
        // page = 1

        // if(mediaType === 'movie') movieUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;

        // if(mediaType === 'tv') tvUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`
        //UPDATE DIRECTORY
        get(url, appendTo, mediaType)
        localStorage.setItem('mediaType', mediaType)
    }
                
   
    const loadMoreItems = () =>{
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;

        const scrolled = window.scrollY;

        let url;
        const media = localStorage.getItem('mediaType');
        
        if(scrolled === scrollable) {
            page += 1
            if(media === 'movie'){
                url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
            } else{
                url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;
            }
            get(url, '.directory', media)
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

    
    // const obj = {...localStorage};

    // delete obj.id
    // delete obj.mediaType

    // const arr = Object.keys(obj)
    // arr.reverse()

    // if(arr === null) return

    // let watchlistUrl;
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
        console.log(imgSrcLink)

        $('.directory').append(`
            <a class="poster ${mediaType}" id="${id}" href="page/info.html"><img src="${imgSrcLink}"/></a>
        `)

        //RETRIVE POSTER ID SO I CAN OPEN CORRECT
        //INFO ON NEW PAGE
        await openItemModal()

        //console.log(posterPath)

    }
    
    // let x = ['movie-1234', 'tv-1234']
    // let f = ['movie-1234', 'tv-1234']
    // let a = x[0].indexOf('-') + 1
    // let b = x[1].indexOf('-') + 1
    // ridMediaType(arr, 1)
    // ridMediaType(arr, 0)
    // //ridMediaType(x, 1)
    

})