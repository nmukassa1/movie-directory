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


///////////////////////

//FETCH API

const year = new Date().getFullYear();
const apiKey = '335228310c6b751750199c1a453b7347';
//Api to get image details like sizes and logos
const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
const discoverMovieApi = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&year=${year}&sort_by=vote_count.desc`;
const discoverTvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1&year=${year}&sort_by=vote_count.desc`;


window.addEventListener('DOMContentLoaded', function() {
    getMovies(discoverMovieApi)
    getTv(discoverTvApi)
})

const getMovies = function(url) {
    fetch(url)
    .then(res => res.json())
    .then(details => {
        /*
        Movie data will be appended to function
        to append certain information to the page
        */
        getImg(details, getBackdropImg, getMoviePosterImg)

    })
    .catch(err => console.error(err))
}

function getImg(details, backdropImg, posterImg) {
    //Fetch api to get image details like sizes and logos
    fetch(imgApi)
    .then(res => res.json())
    .then(img => {
        // console.log(`from img api`, img)
        // console.log(`from discover api`, details)
        // console.log(backdropImg)
        
        backdropImg(img, details)
        posterImg(img, details)

    })
    .catch(err => console.error(err))
}

function getBackdropImg(img, details) {
    //Data from api to append to <img> src
    //Base url is coming from getImg() function
    const windowWidth = document.querySelector('body').clientWidth;
    let backdropSize = img.images.backdrop_sizes[1];
    // if(windowWidth <= 768) {
    //     backdropSize = img.images.backdrop_sizes[0]
    // } else {
    //    backdropSize = img.images.backdrop_sizes[1]
    // }

    const imgBaseUrl = img.images.secure_base_url;

    //Array and loop to get and store movie poster path & titles
    let imgPath = [];
    let titles = [];
    for(let i = 0; i < 3; i++) {
        imgPath.push(details.results[i].backdrop_path)
        titles.push(details.results[i].title)
    }

    //Loop slides elements and append movie poster and title
    const slides = document.querySelectorAll('#slideshow a img');
    const movieTitle = document.querySelectorAll('#slideshow a h1');
    const slideLink = document.querySelectorAll('#carousel a');
    
    for(let i = 0; i < slides.length; i++){
        slides[i].src = `${imgBaseUrl}${backdropSize}${imgPath[i]}`
        movieTitle[i].textContent = `${titles[i]}`
        slideLink[i].id = `${details.results[i].id}`
    }

    /*
    Counter to mulitiply width and keep track of when to make carousel go back to the beginning
    */
    let counter = 1;
    setInterval(function() {
        //Grab carousel div
        const carousel = document.getElementById('carousel')
        //Get slides width
        let posterLength = -slides[0].clientWidth * counter;
        //Move carousel
        carousel.style.transform = `translateX(${posterLength}px)`
        counter++ 
        if(counter === slides.length + 1) {
            carousel.style.transform = 'translateX(0)'
            counter = 1
        }
    }, 4000)

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

function getMoviePosterImg(img, details) {
    //Base url is coming from getImg() function
    const imgBaseUrl = img.images.secure_base_url;

    let moviePosterPath = [];
    let movieTitles = [];
    let movieReleaseDateArray = [];
    for(let i = 0; i < 10; i++) {
        //const random = Math.floor(Math.random() * 19);
        moviePosterPath.push(details.results[i].poster_path)
        movieTitles.push(details.results[i].title)
        movieReleaseDateArray.push(details.results[i].release_date)
    }


    const posterSize = img.images.poster_sizes[1];
    
    for(let i = 0; i < moviePosterPath.length; i++){
        const item = document.createElement('a');
        item.setAttribute('id', `${details.results[i].id}`)
        item.setAttribute('class', `movie`)
        //item.setAttribute('data', 'movie')
        item.setAttribute('href', `info.html`)

        item.innerHTML = `
            <div class="image">
                <img class="movies__slide--poster" src="${imgBaseUrl}${posterSize}${moviePosterPath[i]}" alt="">
            </div>
            <div class="info">
                <h2 class="movies__slide--title">${movieTitles[i]}</h2>
                <p class="movies__slide--release-date">${movieReleaseDateArray[i]}</p>
            </div>
        `
        document.getElementById('movies__slide--container').prepend(item)
        //console.log(item.getAttribute('data'))
    }


    //Append movie id to local storage
    const posterAncor = document.querySelectorAll('.movie');

    //alert(`${posterAncor[0].getAttribute('data')}`)
    posterAncor.forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id;
            let type = item.className;
            //let type = item.getAttribute('data');
            localStorage.setItem('id', `${id}`)
            localStorage.setItem('type', `${type}`)
        })
    })
}


//DUPLICATE


const getTv = function(url) {
    fetch(url)
    .then(res => res.json())
    .then(details => {
        /*
        Movie data will be appended to function
        to append certain information to the page
        */
        getTvImg(details, getTvPosterImg)

    })
    .catch(err => console.error(err))
}

function getTvImg(details, posterImg) {
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

function getTvPosterImg(img, details) {
    //Base url is coming from getImg() function
    const imgBaseUrl = img.images.secure_base_url;

    let tvPosterPath = [];
    let tvTitles = [];
    let tvReleaseDateArray = [];
    for(let i = 0; i < 10; i++) {
        //const random = Math.floor(Math.random() * 19);
        tvPosterPath.push(details.results[i].poster_path)
        tvTitles.push(details.results[i].name)
        tvReleaseDateArray.push(details.results[i].first_air_date)
    }

    const tvPoster = document.getElementsByClassName('tv--poster');
    const moviePosterTitle = document.getElementsByClassName('tv__slide--title');
    const movieReleaseDate = document.getElementsByClassName('tv__slide--release-date');

    const posterSize = img.images.poster_sizes[1];
    
    for(let i = 0; i < tvPosterPath.length; i++){
        const item = document.createElement('a');
        item.setAttribute('id', `${details.results[i].id}`)
        item.setAttribute('class', 'tv')
        item.setAttribute('href', `info.html`)

        item.innerHTML = `
            <div class="image">
                <img class="tv__slide--poster" src="${imgBaseUrl}${posterSize}${tvPosterPath[i]}" alt="">
            </div>
            <div class="info">
                <h2 class="tv__slide--title">${tvTitles[i]}</h2>
                <p class="tv__slide--release-date">${tvReleaseDateArray[i]}</p>
            </div>
        `
        document.getElementById('tv__slide--container').appendChild(item)
    }

    const posterAncor = document.querySelectorAll('.tv');

    posterAncor.forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id;
            let type = item.className;
            localStorage.setItem('id', `${id}`)
            localStorage.setItem('type', `${type}`)
        })
    })

}





//SEARCH QUERY
const searchBtn = document.querySelector('#header__container--search button');
const searchQueryContainer = document.getElementById('search__query');

searchBtn.addEventListener('click', () => {
    searchQueryContainer.classList.toggle('search__query--toggle');
})

//FETCH BOTH API
//LOOP THROUGH EVERY PAGE AND GRAB & STORE EVERY TITLE INTO AN ARRAY
let a = [];

function initiation() {
    for(let i = 0; i <= 1; i++) {
       fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${i}&year=${year}&sort_by=vote_count.desc`)
        .then(res => res.json())
        .then(movies => {
            //console.log(movies)
            getInfo(movies, `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=${i}&year=${year}&sort_by=vote_count.desc`)
        })
    }
}
//initiation()



function getInfo(movies, url) {
    fetch(url)
    .then(res => res.json())
    .then(tv => {
        for(let i = 0; i < tv.results.length; i++) {
            let obj = {
                name: `${tv.results[i].name}`
            }
            let obj2 = {
                name: `${movies.results[i].title}`
            }
            a.push(obj, obj2)
        }
        console.log(a)
    })
}