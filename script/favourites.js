$(document).ready(function(){
    //FETCH API

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

    

    //Obkect to hold localstorage 
    const obj = {...localStorage};

    //Delete items i don't need
    delete obj.id
    delete obj.mediaType

    
    
    //Arry holding id values, so I can use to find out how long loop should last
    //& split tv and movie id
    const arr = Object.keys(obj)
    const id = Object.values(obj);

    //Empty array to hold all movie and tv id's so I know what api to run
    let movieId = [];
    let tvId = [];
    for(let i = 0; i < arr.length; i++){
        if(arr.includes(`movie-${id[i]}`)){
            movieId.push(id[i])
        } else{
            tvId.push(id[i])
        }
    }
    
   
    if(movieId[0] != null ){
        movieId.forEach(item => {
            getInfo(`https://api.themoviedb.org/3/movie/${item}?api_key=${apiKey}&language=en-UK`, 'movie')
        })
    } 
    
    if(tvId[0] != null ){
        tvId.forEach(item => {
            getInfo(`https://api.themoviedb.org/3/tv/${item}?api_key=${apiKey}&language=en-UK`, 'tv')
        })
    } 

    
    function getInfo(url, mediaType){
        fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const posterPath = data.poster_path;
            const id = data.id
            
            poster(posterPath, id, mediaType)
            
        })
    }

    function poster(posterPath, id, mediaType){
        fetch(imgApi)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            const baseURL= data.images.base_url;
            const size = data.images.poster_sizes[1];

            const link = `${baseURL}${size}${posterPath}`;

            $('#poster-container').append(`
                <a href="info.html" id="${id}" class="${mediaType}"><img src="${link}"></a>
            `)            


            document.querySelectorAll('#poster-container a').forEach(item => {
                item.addEventListener('click', () => {
                    localStorage.setItem('id', `${item.id}`)
                    localStorage.setItem('mediaType', `${item.className}`)
                })
            })
        })
    }

 
})