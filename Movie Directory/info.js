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


//ON PAGE LOAD
window.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('id');
    const type = localStorage.getItem('type');

    let url;
    let videoUrl;

    if(type === 'tv'){
       url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`;
       videoUrl = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}&language=en-US`
    } else {
       url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
       videoUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
    }
    
    getInfo(url, videoUrl)


    const favouritesBtn = document.querySelector('main button');
    
    let key = localStorage.getItem(`${type}-${id}`)

    setTimeout(() => {
        if(`${favouritesBtn.id}` === `${key}`) {
            favouritesBtn.classList.add('favourites__toggle')
            favouritesBtn.textContent = 'Remove from favourites'
            //alert('yes')
        } else {
            //alert('no')
        }
    }, 500)

})




function getInfo(url, videoUrl) {
    fetch(url)
    .then(res => res.json())
    .then(details => {
        console.log(details)
        getImg(details, create, videoUrl)
    })
    .catch(err => console.error(err))
}


function getImg(details, posterImg, videoUrl) {
    //Fetch api to get image details like sizes and logos
    fetch(imgApi)
    .then(res => res.json())
    .then(img => {
       console.log(img)
        
        posterImg(img, details, videoUrl)
        
    })
    .catch(err => console.error(err))
}

function create(img, details, videoUrl) {

    //GET AND APPEND TITLE

    let title;
    if(!details.name) {
        title = details.title
    }   else {
        title = details.name
    }
    document.querySelector('#title h1').textContent = title



    //GET AND APPEND RELEASTE DATE & DURATION

    let releaseDate;
    let duration;
    let hr;
    let min;

    if(!details.first_air_date){
        releaseDate = details.release_date
    } else {
        releaseDate = details.first_air_date
    }
    
    if(!details.episode_run_time){
        if(Math.floor(details.runtime / 60) <= 0){
            min = `${details.runtime % 60}m`;
            duration = `${min}`;
        } else {
            hr = `${Math.floor(details.runtime / 60)}h`;
            min = `${details.runtime % 60}m`;

            duration = `${hr} ${min}`;
        }
    } else {
        if(Math.floor(details.episode_run_time[0] / 60) <= 0){
            min = `${details.episode_run_time[0] % 60}m`;
            duration = `${min}`;
        } else {
            hr = `${Math.floor(details.episode_run_time[0] / 60)}h`;
            min = `${details.episode_run_time[0] % 60}m`;

            duration = `${hr} ${min}`;
        }
    }

    document.getElementById('release').textContent = releaseDate;
    document.getElementById('duration').textContent = duration;
    


    //GET AND APPEND TRAILER
    trailer(videoUrl)
    

    //GET AND APPEND IMG, GENRES & OVERVIEW
    const imgBaseUrl = img.images.secure_base_url;
    const posterSize = img.images.poster_sizes[2];
    const posterPath = details.poster_path;

    const poster = imgBaseUrl + posterSize + posterPath;
    
    document.querySelector('img.poster').src = poster;

    const overview = details.overview;
    document.querySelector('#overview p').textContent = overview;

    const genreContainer = document.querySelector('#genre ul');

    for(let i = 0; i < details.genres.length; i++) {
        const li = document.createElement('li');
        li.textContent = details.genres[i].name;
        genreContainer.appendChild(li)
    }


    const favouritesBtn = document.querySelector('main button');
    favouritesBtn.id = `${details.id}`;

}

function trailer(videoUrl) {
    fetch(videoUrl)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        let key;
        
        for(let i = 0; i < data.results.length; i++){
            if(data.results[i].type === 'Trailer' && data.results[i].site === 'YouTube'){
                key = data.results[i].key;
                break
            } else {
                key = data.results[i].key;
            }
        }

        const link = `https://www.youtube.com/embed/${key}`;
        document.querySelector('iframe').src = link;

    })
}


//FAVOURITES CTA
const favouritesBtn = document.querySelector('main button');

favouritesBtn.addEventListener('click', () => {
    favouritesBtn.classList.toggle('favourites__toggle');

    let cta;
    let key = `${localStorage.getItem('type')}-${favouritesBtn.id}`;
    let value = `${favouritesBtn.id}`;
    if(favouritesBtn.classList.contains('favourites__toggle')) {
        cta = 'Remove from favourites'
        localStorage.setItem(`${key}`, `${value}`)
    } else {
        cta = 'Add to favourites'
        localStorage.removeItem(`${key}`, `${value}`)
    }
    favouritesBtn.textContent = cta;
    
})



