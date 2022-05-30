"use strict";

$(document).ready(function () {
  //FETCH API
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var trendingMovieApi = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey);
  var trendingTvApi = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey);

  var getData = function getData(url, appendTo) {
    var startPoint, data, i, posterPath, fetchImgData, imgData, baseUrl, backdropSize, imgSrcLink;
    return regeneratorRuntime.async(function getData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(fetch(url));

          case 2:
            startPoint = _context.sent;

            if (!(startPoint.status === 404)) {
              _context.next = 5;
              break;
            }

            throw "Page doesn't exist";

          case 5:
            _context.next = 7;
            return regeneratorRuntime.awrap(startPoint.json());

          case 7:
            data = _context.sent;
            i = 0;

          case 9:
            if (!(i < data.results.length)) {
              _context.next = 24;
              break;
            }

            posterPath = data.results[i].poster_path; //Fecth img base-url & img-size

            _context.next = 13;
            return regeneratorRuntime.awrap(fetch(imgApi));

          case 13:
            fetchImgData = _context.sent;
            _context.next = 16;
            return regeneratorRuntime.awrap(fetchImgData.json());

          case 16:
            imgData = _context.sent;
            baseUrl = imgData.images.base_url;
            backdropSize = imgData.images.poster_sizes[4];
            imgSrcLink = baseUrl + backdropSize + posterPath; //console.log(imgSrcLink)

            $(appendTo).append("\n                <a class=\"poster\" id=\"".concat(data.results[i].id, "\" href=\"page/info.html\"><img src=\"").concat(imgSrcLink, "\"/></a>\n            "));

          case 21:
            i++;
            _context.next = 9;
            break;

          case 24:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  function get() {
    return regeneratorRuntime.async(function get$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(getData(trendingMovieApi, '.directory'));

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            alert(_context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 5]]);
  }

  get(); // class Get {
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
});