// MENU
const menuBtn = document.querySelector('#header__container--menu button');
const line1 = document.getElementsByClassName('line-1')[0];
const line2 = document.getElementsByClassName('line-2')[0];
const line3 = document.getElementsByClassName('line-3')[0];
const nav = document.getElementsByClassName("header__container--nav")[0];
const body = document.querySelector('body');

menuBtn.addEventListener('click', (e) => {
    line1.classList.toggle('line-1-toggle')
    line2.classList.toggle('line-2-toggle')
    line3.classList.toggle('line-3-toggle')
    nav.classList.toggle('header__container--nav-toggle')
    body.classList.toggle('body-toggle')
})



//API

const year = new Date().getFullYear();
const apiKey = '335228310c6b751750199c1a453b7347';
//Api to get image details like sizes and logos
const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
const discoverMovieApi = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&sort_by=vote_count.desc&year=${year}`;


function getImg(details, posterImg) {
    //Fetch api to get image details like sizes and logos
    fetch(imgApi)
    .then(res => res.json())
    .then(img => {
       // console.log(`from img api`, img)
        // console.log(`from discover api`, details)
        
        posterImg(img, details)
        
    })
    .catch(err => console.error(err))
}

function getMoviePosterImg(img, details) {
    //Base url is coming from getImg() function
    const imgBaseUrl = img.images.secure_base_url;
    
    let moviePosterPath = [];
    let movieTitles = [];
    let movieReleaseDateArray = [];
    let movieSynopsis = [];
    for(let i = 0; i < details.results.length; i++) {
        moviePosterPath.push(details.results[i].poster_path)
        movieTitles.push(details.results[i].title)
        movieReleaseDateArray.push(details.results[i].release_date)
        movieSynopsis.push(details.results[i].overview)
    }
    
    
    let posterSize = img.images.poster_sizes[1];
    let windowWidth = document.querySelector('body').clientWidth;
    
    // if(windowWidth <= '768') {
    //     posterSize = img.images.poster_sizes[0];
    // } else {
    //     posterSize = img.images.poster_sizes[1]
    // }
    
    for(let i = 0; i < moviePosterPath.length; i++){
        const item = document.createElement('a');
        item.setAttribute('id', `${details.results[i].id}`)
        item.setAttribute('class', `movie`)
        item.setAttribute('href', `info.html`)
        
        item.innerHTML = `
        <div class="image">
            <img class="movies__poster" src="${imgBaseUrl}${posterSize}${moviePosterPath[i]}" alt="">
        </div>
        <div class="info">
            <h2 class="movies__title">${movieTitles[i]}</h2>
            <p class="movies__release-date">${movieReleaseDateArray[i]}</p>
            <p class="movie__synopsis">${movieSynopsis[i].slice(0, 64)}</p>
        </div>
        `
        
        document.getElementById('movies__container').appendChild(item)
    }
    
    const posterAncor = document.querySelectorAll('.movie');
    
    posterAncor.forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id;
            let type = item.className;
            localStorage.setItem('id', `${id}`)
            localStorage.setItem('type', `${type}`)
        })
    })
}

class GetMovieFilter {
    constructor(url){
        this.url = url;
    }
    getMovies() {
        fetch(this.url)
        .then(res => res.json())
        .then(details => {
            /*
            Movie data will be appended to function
            to append certain information to the page
            */
            getImg(details, getMoviePosterImg)

        })
        .catch(err => console.error(err))
    }
} 

const onLoad = new GetMovieFilter(discoverMovieApi)

window.addEventListener('DOMContendLoaded', onLoad.getMovies())


////////////////////////////////////


//CUSTOM FILTERS
const btn = document.querySelectorAll('.custom__mode--name');


btn.forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.nextElementSibling.classList.toggle('custom__mode--options--toggle');

        btn.lastElementChild.classList.toggle('arrow--toggle')
    })
})

//Function to create genre buttons
const createGenreBtns = function() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => {
        const genre = data.genres;
        
        const ul = document.querySelector('#genres ul');
        
        for(let i = 0; i < genre.length; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', `${genre[i].id}`)
            li.textContent = `${genre[i].name}`
            ul.appendChild(li)

        }


        //STORE GENRE ID INTO ARRAY SO I CAN USE IT TO SEARCH FOR GENRE SPECIFIC FILMS

        const genreBtn = document.querySelectorAll('#genres li');
        
        let arr = [];
        genreBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                //TOGGLE CLASS SELECT TO KEEP TRACK OF WHAT NEEDS TO GO INTO ARRAY OR NOT SINCE I CANT TOGGLE PUSH() OR POP()
                btn.classList.toggle('select')

                const id = e.target.id;

                if(btn.classList.contains('select')) {
                    arr.push(id)
                    console.log(arr)
                } else {
                    //Delete id from array
                    const index = arr.indexOf(id)
                    arr.splice(index, 1)
                    console.log(arr)
                }
                
            })
        })
        search(arr) 
        loadMoreMovies(arr)
    })
};


function search(genreId) {
    const search = document.getElementById('search');

    search.addEventListener('click', () => {
        console.log(genreId.join(','))
        const genreIdStr = genreId.join(',');


        //Close genre options
        const genreOptions = document.getElementById('genres');
        if(genreOptions.classList.contains('custom__mode--options--toggle')) {
            genreOptions.classList.remove('custom__mode--options--toggle')   
        }

        
        //Remove button toggle
        // const genreBtn = document.querySelectorAll('#genres li');
        // genreBtn.forEach((btn) => {
        //     if(btn.classList.contains('select')) {
        //         btn.classList.remove('select')   
        //     }
        // })

        document.querySelector('.arrow').classList.remove('arrow--toggle')
        
        const getMovieByGenre = new GetMovieFilter(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&sort_by=vote_count.desc&year=${year}&with_genres=${genreIdStr}`)

        document.getElementById('movies__container').innerHTML = ``

        getMovieByGenre.getMovies();
        
        //Empty array
        //genreId.splice(0, genreId.length);
        console.log(genreId)

    })
}

createGenreBtns()








//Function is being ran inside createGenreBtn() ^
const loadMoreMovies = function(arr) {
    let i = 2;

    document.getElementById('load__more').addEventListener('click', () => {
        const genre = arr.join(',');

        const loadMore = new GetMovieFilter(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${i}&sort_by=vote_count.desc&year=${year}&with_genres=${genre}`)
        loadMore.getMovies();
        i++
    })
}




