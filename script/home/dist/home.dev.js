"use strict";

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
            alert(_context2.t0);

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
  });
});