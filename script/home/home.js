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
            alert(e)
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

    
    

    

})