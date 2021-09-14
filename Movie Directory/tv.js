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
const discoverTvApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1&year=${year}&sort_by=vote_count.desc`;




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

function getTvPosterImg(img, details) {
    //Base url is coming from getImg() function
    const imgBaseUrl = img.images.secure_base_url;
    
    let tvPosterPath = [];
    let tvTitles = [];
    let tvReleaseDateArray = [];
    let tvSynopsis = [];
    for(let i = 0; i < details.results.length; i++) {
        tvPosterPath.push(details.results[i].poster_path)
        tvTitles.push(details.results[i].name)
        tvReleaseDateArray.push(details.results[i].first_air_date)
        tvSynopsis.push(details.results[i].overview)
    }
    
    
    const posterSize = img.images.poster_sizes[1];
    
    for(let i = 0; i < tvPosterPath.length; i++){
        const item = document.createElement('a');
        item.setAttribute('id', `${details.results[i].id}`)
        item.setAttribute('class', `tv`)
        item.setAttribute('href', `info.html`)
        
        item.innerHTML = `
        <div class="image">
        <img class="tv__poster" src="${imgBaseUrl}${posterSize}${tvPosterPath[i]}" alt="">
        </div>
        <div class="info">
        <h2 class="tv__title">${tvTitles[i]}</h2>
        <p class="tv__release-date">${tvReleaseDateArray[i]}</p>
        <p class="tv__synopsis">${tvSynopsis[i].slice(0, 64)}</p>
        </div>
        `
        
        document.getElementById('tv__container').appendChild(item)
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

class GetTvFilter {
    constructor(url){
        this.url = url;
    }
    getTv() {
        fetch(this.url)
        .then(res => res.json())
        .then(details => {
            /*
            Movie data will be appended to function
            to append certain information to the page
            */
            getImg(details, getTvPosterImg)

        })
        .catch(err => console.error(err))
    }

    // getImg(details, posterImg) {
    //     //Fetch api to get image details like sizes and logos
    //     fetch(imgApi)
    //     .then(res => res.json())
    //     .then(img => {
    //     // console.log(`from img api`, img)
    //         // console.log(`from discover api`, details)
            
    //         posterImg(img, details)
            
    //     })
    //     .catch(err => console.error(err))
    // }

    getTvPosterImg(img, details) {
        //Base url is coming from getImg() function
        const imgBaseUrl = img.images.secure_base_url;
        
        let tvPosterPath = [];
        let tvTitles = [];
        let tvReleaseDateArray = [];
        let tvSynopsis = [];
        for(let i = 0; i < details.results.length; i++) {
            tvPosterPath.push(details.results[i].poster_path)
            tvTitles.push(details.results[i].name)
            tvReleaseDateArray.push(details.results[i].first_air_date)
            tvSynopsis.push(details.results[i].overview)
        }
        
        
        const posterSize = img.images.poster_sizes[0];
        
        for(let i = 0; i < tvPosterPath.length; i++){
            const item = document.createElement('a');
            item.setAttribute('id', `${details.results[i].id}`)
            item.setAttribute('class', `tv`)
            item.setAttribute('href', `/pages/info.html`)
            
            item.innerHTML = `
            <div class="image">
            <img class="tv__poster" src="${imgBaseUrl}${posterSize}${tvPosterPath[i]}" alt="">
            </div>
            <div class="info">
            <h2 class="movies__title">${tvTitles[i]}</h2>
            <p class="movies__release-date">${tvReleaseDateArray[i]}</p>
            <p class="movie__synopsis">${tvSynopsis[i].slice(0, 64)}</p>
            </div>
            `
            
            document.getElementById('movies__container').appendChild(item);
        }
        
        const posterAncor = document.querySelectorAll('.tv');
        
        posterAncor.forEach((item) => {
            item.addEventListener('click', (e) => {
                let id = item.id;
                let type = item.className;
                localStorage.setItem('id', `${id}`)
                localStorage.setItem('type', `${type}`)
            })
        })

        
    }
} 

//window.addEventListener('DOMContendLoaded', getTv(discoverTvApi))
const onLoad = new GetTvFilter(discoverTvApi);
window.addEventListener('DOMContendLoaded', onLoad.getTv())


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
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => {
        console.log(data, data.genres[0].name)
        const genre = data.genres;
        
        const ul = document.querySelector('#genres ul');
        
        for(let i = 0; i < genre.length; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', `${genre[i].id}`)
            li.textContent = `${genre[i].name}`
            ul.appendChild(li)

        }

        const genreBtn = document.querySelectorAll('#genres li');
        

        let arr = [];
        genreBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                btn.classList.toggle('select')

                //Steps to create fetch api

                const id = e.target.id;

                if(btn.classList.contains('select')) {
                    arr.push(id)
                    console.log(arr)
                } else {
                    const index = arr.indexOf(id)
                    arr.splice(index, 1)
                    console.log(arr)
                }
                
            })
        })
        search(arr) 
        loadMoreTv(arr)
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

        
        

        document.querySelector('.arrow').classList.remove('arrow--toggle')
        
        const getTvByGenre = new GetTvFilter(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1&sort_by=vote_count.desc&year=${year}&with_genres=${genreIdStr}`)

        document.getElementById('tv__container').innerHTML = ``

        getTvByGenre.getTv();
        
        //Empty array
        //genreId.splice(0, genreId.length);
        console.log(genreId)

    })
}

createGenreBtns()


//Function is being ran inside createGenreBtn() ^
const loadMoreTv = function(arr) {
    let i = 2;

    document.getElementById('load__more').addEventListener('click', () => {
        const genre = arr.join(',');

        const loadMore = new GetTvFilter(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=${i}&sort_by=vote_count.desc&year=${year}&with_genres=${genre}`)
        loadMore.getTv();

        i++
    })
}

