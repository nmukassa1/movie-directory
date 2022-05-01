$('document').ready(function(){

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
  
    const mediaType = localStorage.getItem('mediaType');
    const id = localStorage.getItem('id');
    let apiURL;

    let videoURL;

    if(mediaType === 'movie'){
        apiURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    } else {
        apiURL = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
    }

    if(mediaType === 'movie'){
        videoURL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
    } else {
        videoURL = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`
    }

    fetch(apiURL)
    .then(res => res.json())
    .then(item => {
        console.log(item)
        

        backdrop(item)
        videos(videoURL)
        
       
    })
    .catch(err => console.log(err))



    function backdrop(item){
        fetch(imgApi)
        .then(res => res.json())
        .then(data => {

            
            const baseURL = data.images.base_url;
            const backdropSize = data.images.backdrop_sizes[1];
            const backdropPath = item.backdrop_path;
            const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;

            $('img').attr('src', uniqueURL)
        })
    }

    function videos(url){
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
})