"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  //FETCH API
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var page = 1; // let movieUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
  // let tvUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`;
  //DEAFULT URL WHEN PAGE IS LOADED

  var url = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey, "&page=").concat(page);
  var genreArr = [];

  var getData = function getData(url, appendTo, mediaType) {
    var startPoint, data, i, posterPath, fetchImgData, imgData, baseUrl, backdropSize, imgSrcLink;
    return regeneratorRuntime.async(function getData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(fetch(url));

          case 2:
            startPoint = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(startPoint.json());

          case 5:
            data = _context.sent;
            i = 0;

          case 7:
            if (!(i < data.results.length)) {
              _context.next = 22;
              break;
            }

            posterPath = data.results[i].poster_path; //Fecth img base-url & img-size

            _context.next = 11;
            return regeneratorRuntime.awrap(fetch(imgApi));

          case 11:
            fetchImgData = _context.sent;
            _context.next = 14;
            return regeneratorRuntime.awrap(fetchImgData.json());

          case 14:
            imgData = _context.sent;
            baseUrl = imgData.images.base_url;
            backdropSize = imgData.images.poster_sizes[4];
            imgSrcLink = baseUrl + backdropSize + posterPath; //console.log(imgSrcLink)
            // <a class="poster ${mediaType}" id="${data.results[i].id}" href="page/info.html"><img src="${imgSrcLink}"/></a>

            $(appendTo).append("\n                <button class=\"poster ".concat(mediaType, "\" id=\"").concat(data.results[i].id, "\"><img src=\"").concat(imgSrcLink, "\"/></button>\n            "));

          case 19:
            i++;
            _context.next = 7;
            break;

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(openItemModal());

          case 24:
          case "end":
            return _context.stop();
        }
      }
    });
  }; //TRY CATCH FUNCTION


  function get(url, appendTo, mediaType) {
    return regeneratorRuntime.async(function get$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(getData(url, appendTo, mediaType));

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 5]]);
  } //DEAFULT SETUP WHEN PAGE IS LOADED
  //get(movieUrl, '.directory', 'movie')


  get(url, '.directory', 'movie');
  localStorage.setItem('mediaType', 'movie'); //MODAL FUNCTION

  function openItemModal() {
    return new Promise(function (res) {
      var poster = document.querySelectorAll('.poster');
      poster.forEach(function (item) {
        item.addEventListener('click', function () {
          var id = item.id;

          if (item.classList.contains('movie')) {
            localStorage.setItem('mediaType', "movie");
          } else {
            localStorage.setItem('mediaType', "tv");
          }

          localStorage.setItem('id', "".concat(item.id));
          $('.modal').css({
            'height': '90vh'
          });
          $('main').css({
            'overflow': 'hidden'
          });

          try {
            openModalFetch(id);
          } catch (e) {
            console.log(e);
          }
        });
      });
      res();
    });
  }

  $('body').keypress(function (e) {
    if (e.key === 'Enter') {
      $('.modal').css('height', '0');
      $('main').css({
        'overflow': 'initial'
      });
    }
  });

  function openModalFetch(id) {
    var url, initiation, data, backdropPath, fetchImgData, imgData, baseUrl, backdropSize, imgSrcLink, runtime, hr, min, genresArr, releaseDateArr, releaseDate;
    return regeneratorRuntime.async(function openModalFetch$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (localStorage.getItem('mediaType') === 'movie') {
              url = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
            } else {
              url = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
            }

            _context3.next = 3;
            return regeneratorRuntime.awrap(fetch(url));

          case 3:
            initiation = _context3.sent;
            _context3.next = 6;
            return regeneratorRuntime.awrap(initiation.json());

          case 6:
            data = _context3.sent;
            console.log(data);
            backdropPath = data.backdrop_path; //Fecth img base-url & img-size

            _context3.next = 11;
            return regeneratorRuntime.awrap(fetch(imgApi));

          case 11:
            fetchImgData = _context3.sent;
            _context3.next = 14;
            return regeneratorRuntime.awrap(fetchImgData.json());

          case 14:
            imgData = _context3.sent;
            baseUrl = imgData.images.base_url;
            backdropSize = imgData.images.backdrop_sizes[2];
            imgSrcLink = baseUrl + backdropSize + backdropPath; //APPEND DATA   

            $('#hero-bg').css('background-image', "url(".concat(imgSrcLink, ")"));
            $('#title').text(data.title || data.name);
            $('#bio').text(data.overview); //RUNTIME

            if (data.runtime) {
              runtime = data.runtime;
            } else {
              runtime = data.episode_run_time;
            }

            min = "".concat(runtime % 60, "m");

            if (runtime > 60) {
              hr = "".concat(Math.floor(runtime / 60), "h");
            }

            $('#hr').text(hr);
            $('#min').text(min); //GENRES

            genresArr = [];
            data.genres.forEach(function (genreName) {
              genresArr.push(genreName.name);
            });
            $('#genre').text(genresArr.join(', ')); //RELEASE DATE

            if (data.release_date) {
              releaseDateArr = data.release_date.split('-');
            } else {
              releaseDateArr = data.first_air_date.split('-');
            }

            releaseDate = [releaseDateArr[2], releaseDateArr[1], releaseDateArr[0]].join('-');
            $('#release').text(releaseDate);

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    });
  } //ADD TO WATCHLIST


  $('#favourites').click(function () {
    var id = localStorage.getItem('id');
    var mediaType = localStorage.getItem('mediaType');
    var favourited = localStorage.getItem("".concat(mediaType, "-").concat(id));

    if (favourited) {
      localStorage.removeItem("".concat(mediaType, "-").concat(id));
      $('#favourites').css('color', '');
      $('#favourites').removeClass('favourites-animation');
    } else {
      localStorage.setItem("".concat(mediaType, "-").concat(id), "".concat(id));
      $('#favourites').css('color', '#EB5353');
      $('#favourites').addClass('favourites-animation');
    }
  }); //When window loads
  // function onLoad(){
  //     if(localStorage.getItem(`${mediaType}-${id}`)){
  //         $('#favourites').css('color', '#EB5353')
  //     } else{
  //         $('#favourites').css('color', '')
  //     }
  // }
  // onLoad()

  $('nav button').click(function (e) {
    //WHAT BUTTON AM I CLICKING ON?
    var buttonType = e.target.id;

    if (buttonType === 'movie') {
      loadMedia('.directory', 'movie', buttonType);
      getGenreList('movie');
    }

    if (buttonType === 'tv') {
      loadMedia('.directory', 'tv', buttonType);
      getGenreList('tv');
    }

    if (buttonType === 'watchlist') return watchlist();
    if (buttonType === 'filter') return toggle();
  });

  var loadMedia = function loadMedia(appendTo, mediaType, buttonType) {
    //EMPTY DIRECTORY
    $('.directory').empty();
    page = 1;
    genreArr = [];
    console.log(genreArr); //console.log(url)

    if (buttonType === 'movie') url = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey, "&page=").concat(page);
    if (buttonType === 'tv') url = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey, "&page=").concat(page); //console.log(url)

    get(url, appendTo, mediaType);
    localStorage.setItem('mediaType', mediaType);
  };

  var loadMoreItems = function loadMoreItems() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = window.scrollY; //let url;

    var media = localStorage.getItem('mediaType');

    if (scrolled === scrollable) {
      page += 1;
      var genreStr = genreArr.join(',');

      if (genreArr.length === 0) {
        if (media === 'movie') {
          url = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey, "&page=").concat(page);
        } else {
          url = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey, "&page=").concat(page);
        }
      } else {
        if (media === 'movie') {
          url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(page, "&with_genres=").concat(genreStr);
        } else {
          url = "https://api.themoviedb.org/3/discover/tv?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(page, "&with_genres=").concat(genreStr);
        }
      }

      get(url, '.directory', media); //console.log(page, url)
    }
  };

  $(window).scroll(loadMoreItems);
  $(window).on('touchmove', function () {
    loadMoreItems();
  }); //FUNCTION TO APPEND FAVOURITES

  function watchlist() {
    $('.directory').empty(); //Obkect to hold localstorage 

    var obj = _objectSpread({}, localStorage); //Delete items i don't need


    delete obj.id;
    delete obj.mediaType; //Arry holding id values, so I can use to find out how long loop should last
    //& split tv and movie id

    var arr = Object.keys(obj); //REVERSE ARRAY SO I CAN SORT BY RECENT ADDED

    arr.reverse();

    if (arr.length === 0) {
      // $('.directory').css('grid-template-columns', '1fr');
      $('.directory').append("\n                <h1>You have nothing in your watch list. Why not add something?</h1>\n            ");
    }

    var watchlistUrl; //let mediaType;

    for (var i = 0; i < arr.length; i++) {
      ridMediaType(arr, i);
    }
  }

  var ridMediaType = function ridMediaType(array, i) {
    var mediaType, cutFrom, id, getPosterPath, res, posterPath, fetchImgData, imgData, baseUrl, backdropSize, imgSrcLink;
    return regeneratorRuntime.async(function ridMediaType$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            cutFrom = array[i].indexOf('-') + 1;
            id = array[i].slice(cutFrom, array[i].length); //console.log(arr)

            if (array[i].includes('movie')) {
              watchlistUrl = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
              mediaType = 'movie';
            } else {
              watchlistUrl = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
              mediaType = 'tv';
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(fetch(watchlistUrl));

          case 5:
            getPosterPath = _context4.sent;
            _context4.next = 8;
            return regeneratorRuntime.awrap(getPosterPath.json());

          case 8:
            res = _context4.sent;
            posterPath = res.poster_path; //Fecth img base-url & img-size

            _context4.next = 12;
            return regeneratorRuntime.awrap(fetch(imgApi));

          case 12:
            fetchImgData = _context4.sent;
            _context4.next = 15;
            return regeneratorRuntime.awrap(fetchImgData.json());

          case 15:
            imgData = _context4.sent;
            baseUrl = imgData.images.base_url;
            backdropSize = imgData.images.poster_sizes[4];
            imgSrcLink = baseUrl + backdropSize + posterPath; //console.log(imgSrcLink)

            $('.directory').append("\n            <a class=\"poster ".concat(mediaType, "\" id=\"").concat(id, "\" href=\"page/info.html\"><img src=\"").concat(imgSrcLink, "\"/></a>\n        ")); //RETRIVE POSTER ID SO I CAN OPEN CORRECT
            //INFO ON NEW PAGE

            _context4.next = 22;
            return regeneratorRuntime.awrap(openItemModal());

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    });
  }; //GENRE SELECTION SECTION


  function getGenreList(mediaType) {
    var genreUrl, genreFetch, genreData, genreContainer;
    return regeneratorRuntime.async(function getGenreList$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            //const mediaType = localStorage.getItem('mediaType');
            genreUrl = "https://api.themoviedb.org/3/genre/".concat(mediaType, "/list?api_key=").concat(apiKey, "&language=en-UK");
            _context5.next = 3;
            return regeneratorRuntime.awrap(fetch(genreUrl));

          case 3:
            genreFetch = _context5.sent;
            _context5.next = 6;
            return regeneratorRuntime.awrap(genreFetch.json());

          case 6:
            genreData = _context5.sent;
            genreContainer = $('.genre ul');
            genreContainer.html('');
            genreData.genres.forEach(function (item) {
              var li = document.createElement('li');
              li.innerHTML = "\n                <button class=\"genre-item\" id=".concat(item.id, ">").concat(item.name, "</button>\n            ");
              genreContainer.append(li);
            }); //UPDATE DIRECTORY FUNCTION WITH GENRE SEARCH

            selectGnere(mediaType);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    });
  }

  function toggle() {
    $('.genre').toggleClass('genre-appear');
  }

  getGenreList('movie');

  function selectGnere(mediaType) {
    // let genreArr = [];
    var genreBtn = document.querySelectorAll('.genre-item');
    genreBtn.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.classList.contains('genre-button-toggle')) {
          item.classList.remove('genre-button-toggle');
          var genreIndex = genreArr.indexOf(item.id);
          genreArr.splice(genreIndex, 1);
          console.log(genreArr);
        } else {
          item.classList.add('genre-button-toggle');
          genreArr.push(item.id);
          console.log(genreArr);
        }
      });
    }); //SEARCH GENRE

    var searchGenreButton = $('#genre-search');
    searchGenreButton.click(function () {
      var genreStr = genreArr.join(',');
      page = 1;

      if (mediaType === 'movie') {
        url = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(page, "&with_genres=").concat(genreStr);
      } else {
        url = "https://api.themoviedb.org/3/discover/tv?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(page, "&with_genres=").concat(genreStr);
      }

      $('.directory').empty();
      get(url, '.directory', 'movie');
    });
  }
});