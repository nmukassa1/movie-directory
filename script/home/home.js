$(document).ready(function(){

    //FETCH API

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

    const trendingMovieApi = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
    const trendingTvApi = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;

    const getData = async (url, appendTo) =>{
        const startPoint = await fetch(url);   
        //HANDLE 404 ERRORS
        if(startPoint.status === 404) throw `Page doesn't exist`

        const data = await startPoint.json();
        //console.log(data)

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
                <a class="poster" id="${data.results[i].id}" href="page/info.html"><img src="${imgSrcLink}"/></a>
            `)
        }
            
    }

    async function get(){
        try{
            await getData(trendingMovieApi, '.directory')
        } catch (e){
            alert(e)
        }
    }

    get()

    // class Get {
    //     constructor(url, place, mediaType){
    //         this.url = url;
    //         this.place = place;
    //         this.mediaType = mediaType
    //     }
    //     getItems(){
    //         fetch(this.url)
    //         .then(res => res.json())
    //         .then(data => {
    //             const items = data;
    //             //console.log(items)
                

    //             fetch(imgApi)
    //             .then(res => res.json())
    //             .then(data => {
    //                 //console.log(data)
    //                 const baseURL = data.images.base_url;
    //                 const backdropSize = data.images.backdrop_sizes[0];
    //                 //const backdropPath = items.results[8].backdrop_path;
    //                 let posterPath;

    //                 // const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;
    //                 //console.log(uniqueURL)

    //                 const mediaType = this.mediaType;
    //                 const locationContainer = $(`.${this.place}`);
    //                 function post(){
    //                     let loopCount = 10;
    //                     for(let i = 0; i < loopCount; i++){
    //                         if(items.results[i].poster_path == null){
    //                             loopCount++
    //                             continue

    //                         } else{
    //                             posterPath = items.results[i].poster_path;
    //                             const uniqueURL =`${baseURL}${backdropSize}${posterPath}`;
        
    //                             let element = $(`
    //                                 <a href="page/info.html" id="${items.results[i].id}"class="item ${mediaType}">
    //                                     <img class="overlay poster" src="${uniqueURL}">
    //                                 </a>
    //                             `);
        
    //                             locationContainer.append(element)
    //                         }
    //                     }
    //                 }

    //                 post()

                    
    //                 const poster = document.querySelectorAll('a[href="page/info.html"]');
    //                 poster.forEach(item => {
    //                     item.addEventListener('click', function(){
    //                         if(item.classList.contains('movie')){
    //                             localStorage.setItem('mediaType', `movie`)
    //                         } else{
    //                             localStorage.setItem('mediaType', `tv`)
    //                         }
    //                         localStorage.setItem('id', `${item.id}`)
    //                         //localStorage.setItem('mediaType', `${item.id}`)
    //                     })
    //                 })
                
    //             }) //SECOND FETCH END
    //         }) //FIRST GETCH END
    //         .catch(err => console.log(err))
    //     } //FUNCTION END


    // }
    
    // const movieTrending = new Get(trendingMovieApi, 'directory', 'movie');
    // movieTrending.getItems()
    

    
    

    // const tvContainer = new Get(trendingTvApi, 'trending-tv-container', 'tv');
    //tvContainer.getItems()

})