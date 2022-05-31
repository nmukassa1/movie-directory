"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  //FETCH API
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var page = 1;
  var movieUrl = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey, "&page=").concat(page);
  var tvUrl = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey, "&page=").concat(page);

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

            $(appendTo).append("\n                <a class=\"poster ".concat(mediaType, "\" id=\"").concat(data.results[i].id, "\" href=\"page/info.html\"><img src=\"").concat(imgSrcLink, "\"/></a>\n            "));

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
  }

  function openItemModal() {
    return new Promise(function (res) {
      var poster = document.querySelectorAll('a[href="page/info.html"]');
      poster.forEach(function (item) {
        item.addEventListener('click', function () {
          if (item.classList.contains('movie')) {
            localStorage.setItem('mediaType', "movie");
          } else {
            localStorage.setItem('mediaType', "tv");
          }

          localStorage.setItem('id', "".concat(item.id)); //localStorage.setItem('mediaType', `${item.id}`)
        });
      });
      res();
    });
  } //DEAFULT SETUP WHEN PAGE IS LOADED


  get(movieUrl, '.directory', 'movie');
  localStorage.setItem('mediaType', 'movie');
  $('nav button').click(function (e) {
    //WHAT BUTTON AM I CLICKING ON?
    var buttonType = e.target.id;
    if (buttonType === 'movie') return loadMedia(movieUrl, '.directory', 'movie');
    if (buttonType === 'tv') return loadMedia(tvUrl, '.directory', 'tv');
    if (buttonType === 'watchlist') return watchlist();
    if (buttonType === 'filter') return toggle();
  });

  var loadMedia = function loadMedia(url, appendTo, mediaType) {
    //EMPTY DIRECTORY
    $('.directory').empty(); // page = 1
    // if(mediaType === 'movie') movieUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${page}`;
    // if(mediaType === 'tv') tvUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${page}`
    //UPDATE DIRECTORY

    get(url, appendTo, mediaType);
    localStorage.setItem('mediaType', mediaType);
  };

  var loadMoreItems = function loadMoreItems() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = window.scrollY;
    var url;
    var media = localStorage.getItem('mediaType');

    if (scrolled === scrollable) {
      page += 1;

      if (media === 'movie') {
        url = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey, "&page=").concat(page);
      } else {
        url = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey, "&page=").concat(page);
      }

      get(url, '.directory', media);
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
    return regeneratorRuntime.async(function ridMediaType$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
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

            _context3.next = 5;
            return regeneratorRuntime.awrap(fetch(watchlistUrl));

          case 5:
            getPosterPath = _context3.sent;
            _context3.next = 8;
            return regeneratorRuntime.awrap(getPosterPath.json());

          case 8:
            res = _context3.sent;
            posterPath = res.poster_path; //Fecth img base-url & img-size

            _context3.next = 12;
            return regeneratorRuntime.awrap(fetch(imgApi));

          case 12:
            fetchImgData = _context3.sent;
            _context3.next = 15;
            return regeneratorRuntime.awrap(fetchImgData.json());

          case 15:
            imgData = _context3.sent;
            baseUrl = imgData.images.base_url;
            backdropSize = imgData.images.poster_sizes[4];
            imgSrcLink = baseUrl + backdropSize + posterPath; //console.log(imgSrcLink)

            $('.directory').append("\n            <a class=\"poster ".concat(mediaType, "\" id=\"").concat(id, "\" href=\"page/info.html\"><img src=\"").concat(imgSrcLink, "\"/></a>\n        ")); //RETRIVE POSTER ID SO I CAN OPEN CORRECT
            //INFO ON NEW PAGE

            _context3.next = 22;
            return regeneratorRuntime.awrap(openItemModal());

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    });
  }; //GENRE SELECTION SECTION


  function getGenreList() {
    var mediaType, genreUrl, genreFetch, genreData, genreContainer;
    return regeneratorRuntime.async(function getGenreList$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mediaType = localStorage.getItem('mediaType');
            genreUrl = "https://api.themoviedb.org/3/genre/".concat(mediaType, "/list?api_key=").concat(apiKey, "&language=en-UK");
            _context4.next = 4;
            return regeneratorRuntime.awrap(fetch(genreUrl));

          case 4:
            genreFetch = _context4.sent;
            _context4.next = 7;
            return regeneratorRuntime.awrap(genreFetch.json());

          case 7:
            genreData = _context4.sent;
            genreContainer = $('.genre ul');
            genreData.genres.forEach(function (item) {
              var li = document.createElement('li');
              li.innerHTML = "\n                <button class=\"genre-item\" id=".concat(item.id, ">").concat(item.name, "</button>\n            ");
              genreContainer.append(li);
            }); //UPDATE DIRECTORY FUNCTION WITH GENRE SEARCH

            selectGnere();

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    });
  }

  function toggle() {
    $('.genre').toggleClass('genre-appear');
  }

  getGenreList();

  function selectGnere() {
    var genreArr = [];
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
      var genreUrl = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=1&with_genres=").concat(genreStr);
      $('.directory').empty();
      get(genreUrl, '.directory', 'movie');
    });
  }
});