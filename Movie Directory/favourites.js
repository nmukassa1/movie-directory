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




const apiKey = '335228310c6b751750199c1a453b7347';
const imgApi = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;

window.addEventListener('DOMContentLoaded', () => {
    //Object that will hold all items in localstorage
    const arr = {...localStorage};
    //Next I need to delete the items I don't need
    delete arr.id;
    delete arr.type;
    
    //Object that will only hold the id values of localstorage so I can split the movie & tv id's into seperate arrays that will allow me to decide which api to run
    const id = Object.values(arr);
    //console.log(id)
    
    //Empty arry to hold all movid & tv id's
    let movieId = [];
    let tvId = [];
    for(let i = 0; i < id.length; i++) {
        movieId.push(localStorage.getItem(`movie-${id[i]}`))
        tvId.push(localStorage.getItem(`tv-${id[i]}`))
    }
   //console.log(movieId, 'it works', tvId)

    movieId.forEach((id) => {
        getInfo(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`)
    })

    tvId.forEach((id) => {
        getInfo(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`)
    })
    
})


function getInfo(url) {
    fetch(url)
    .then(res => res.json())
    .then(details => {
        console.log(details)
        getImg(details, create)
    })
    .catch(err => console.error(err))
}


function getImg(details, create) {
    //Fetch api to get image details like sizes and logos
    fetch(imgApi)
    .then(res => res.json())
    .then(img => {
       console.log(img)
        
        create(img, details)
        
    })
    .catch(err => console.error(err))
}


function create(img, details) {

    //GET TITLE & TYPE

    let title;
    let type;
    if(!details.name) {
        title = details.title
        type = 'movie'
    }   else {
        title = details.name
        type = 'tv'
    }

    //GET RELEASTE DATE

    let releaseDate;

    if(!details.first_air_date){
        releaseDate = details.release_date
    } else {
        releaseDate = details.first_air_date
    }


    //GET IMG & OVERVIEW
    const imgBaseUrl = img.images.secure_base_url;
    const posterSize = img.images.poster_sizes[1];
    const posterPath = details.poster_path;

    const poster = imgBaseUrl + posterSize + posterPath;

    const overview = details.overview;




    const item = document.createElement('li');

    //item.setAttribute('id', `${details.results[i].id}`)
    //item.setAttribute('class', `tv`)
    //item.setAttribute('href', `/pages/info.html`)
    
    item.innerHTML = `
    <a id='${details.id}' href='info.html' class="${type}">
        <div class="image">
            <img class="tv__poster" src="${poster}" alt="">
        </div>
        <div class="info">
            <h2 class="tv__title">${title}</h2>
            <p class="tv__release-date">${releaseDate}</p>
            <p class="tv__synopsis">${overview.slice(0, 64)}</p>
        </div>
    </a>
    `
    document.querySelector('main ul').appendChild(item)



    const posterAncor = document.querySelectorAll('main li a');
    
    posterAncor.forEach((item) => {
        item.addEventListener('click', () => {
            let id = item.id;
            let type = item.className;
            localStorage.setItem('id', `${id}`)
            localStorage.setItem('type', `${type}`)
        })
    })
}