$(document).ready(() =>{

    const year = new Date().getFullYear();
    const apiKey = '335228310c6b751750199c1a453b7347';
    //Api to get image details like sizes and logos
    const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

    let pageNumber = 1;
    let tvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${pageNumber}`;

    const genreId = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-UK`;

    function genreList(){
        fetch(genreId)
        .then(res => res.json())
        .then(data => {
            console.log(data.genres)
            const ul = $(`#genre-selection > ul`);
            for(let i = 0; i < data.genres.length; i++){
                const item = document.createElement('li');
                item.innerHTML = `
                <button class="genre-item" id=${data.genres[i].id}>${data.genres[i].name}</button>
                `;
                ul.append(item)
            }

           const genreBtn = document.querySelectorAll('.genre-item');
           let genreArr = [];
           genreBtn.forEach(item => {
               item.addEventListener('click', () =>{
                   if(item.classList.contains('genre-list-toggle')){
                       item.classList.remove('genre-list-toggle')
                       const genreIndex = genreArr.indexOf(item.id)
                       genreArr.splice(genreIndex, 1)
                       console.log(genreArr)
                   } else{
                    item.classList.add('genre-list-toggle')
                    genreArr.push(item.id)
                    console.log(genreArr)
                   }
               })
           })

           $('#genre-search').click(() =>{
            pageNumber = 1;
            const genreJoined = genreArr.join(',');
            tvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=1&with_genres=${genreJoined}`;
            const getTvByGenre = new getTv(tvApi, 'tv-container', 'tv');
            $('#tv-container').html('')
            getTvByGenre.getItems()
           })

           function loadMoreTv(genreArr){
            //    $('#more').click(() => {
            //         const genreJoined = genreArr.join(',');
            //         pageNumber++
            //         tvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${pageNumber}&with_genres=${genreJoined}`
            //         console.log(pageNumber, tvApi)
            //         const load = new getTv(tvApi, 'tv-container', 'tv')
            //         load.getItems()
            //     })
            $(window).scroll(() => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
        
                if(scrolled === scrollable){
                    const genreJoined = genreArr.join(',');
                    pageNumber++
                    tvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-UK&sort_by=popularity.desc&include_adult=true&page=${pageNumber}&with_genres=${genreJoined}`
                    //console.log(pageNumber, tvApi)
                    const load = new getTv(tvApi, 'tv-container', 'tv')
                    load.getItems()
                }
           })
           }
           loadMoreTv(genreArr)
        })
    }

    genreList()
    

    class getTv {
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
                console.log(items)
                

                fetch(imgApi)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const baseURL = data.images.base_url;
                    const backdropSize = data.images.poster_sizes[1];
                    //const backdropPath = items.results[8].backdrop_path;
                    let posterPath;

                    // const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;
                    //console.log(uniqueURL)

                    const mediaType = this.mediaType;
                    const locationContainer = $(`#${this.place}`);
                    function post(){
                        let loopCount = 20;
                        for(let i = 0; i < loopCount; i++){
                            if(items.results[i].poster_path == null){
                                loopCount++
                                continue

                            } else{
                                posterPath = items.results[i].poster_path;
                                const uniqueURL =`${baseURL}${backdropSize}${posterPath}`;
        
                                let element = $(`
                                    <a href="./info.html" id="${items.results[i].id}"class="item ${mediaType}">
                                        <img class="overlay poster" src="${uniqueURL}">
                                    </a>
                                `);
        
                                locationContainer.append(element)
                            }
                        }
                    }

                    post()

                    
                    const poster = document.querySelectorAll('a[href="./info.html"]');
                    poster.forEach(item => {
                        item.addEventListener('click', function(){
                            if(item.classList.contains('tv')){
                                localStorage.setItem('mediaType', `tv`)
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

    const tvTrending = new getTv(tvApi, 'tv-container', 'tv');
    tvTrending.getItems()

   
})