"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var pageNumber = 1;
  var movieApi = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(pageNumber);
  var genreId = "https://api.themoviedb.org/3/genre/movie/list?api_key=".concat(apiKey, "&language=en-UK");

  function genreList() {
    fetch(genreId).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data.genres);
      var ul = $("#genre-selection > ul");

      for (var i = 0; i < data.genres.length; i++) {
        var item = document.createElement('li');
        item.innerHTML = "\n                <button class=\"genre-item\" id=".concat(data.genres[i].id, ">").concat(data.genres[i].name, "</button>\n                ");
        ul.append(item);
      }

      var genreBtn = document.querySelectorAll('.genre-item');
      var genreArr = [];
      genreBtn.forEach(function (item) {
        item.addEventListener('click', function () {
          if (item.classList.contains('genre-list-toggle')) {
            item.classList.remove('genre-list-toggle');
            var genreIndex = genreArr.indexOf(item.id);
            genreArr.splice(genreIndex, 1);
            console.log(genreArr);
          } else {
            item.classList.add('genre-list-toggle');
            genreArr.push(item.id);
            console.log(genreArr);
          }
        });
      });
      $('#genre-search').click(function () {
        pageNumber = 1;
        var genreJoined = genreArr.join(',');
        movieApi = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=1&with_genres=").concat(genreJoined);
        var getMovieByGenre = new getMovie(movieApi, 'movie-container', 'movie');
        $('#movie-container').html('');
        getMovieByGenre.getItems();
      });

      function loadMoreMovieOnScroll(genreArr) {
        $(window).scroll(function () {
          var scrollable = document.documentElement.scrollHeight - window.innerHeight;
          var scrolled = window.scrollY;

          if (scrolled === scrollable) {
            var genreJoined = genreArr.join(',');
            pageNumber++;
            movieApi = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(pageNumber, "&with_genres=").concat(genreJoined); //console.log(pageNumber, movieApi)

            var load = new getMovie(movieApi, 'movie-container', 'movie');
            load.getItems();
          }
        });
      }

      loadMoreMovieOnScroll(genreArr);

      function loadMoreMovieOnTouchMove(genreArr) {
        $(window).touchmove(function () {
          var scrollable = document.documentElement.scrollHeight - window.innerHeight;
          var scrolled = window.scrollY;

          if (scrolled === scrollable) {
            var genreJoined = genreArr.join(',');
            pageNumber++;
            movieApi = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&language=en-UK&sort_by=popularity.desc&include_adult=true&page=").concat(pageNumber, "&with_genres=").concat(genreJoined); //console.log(pageNumber, movieApi)

            var load = new getMovie(movieApi, 'movie-container', 'movie');
            load.getItems();
          }
        });
      }

      loadMoreMovieOnTouchMove(genreArr);
    });
  }

  genreList();

  var getMovie =
  /*#__PURE__*/
  function () {
    function getMovie(url, place, mediaType) {
      _classCallCheck(this, getMovie);

      this.url = url;
      this.place = place;
      this.mediaType = mediaType;
    }

    _createClass(getMovie, [{
      key: "getItems",
      value: function getItems() {
        var _this = this;

        fetch(this.url).then(function (res) {
          return res.json();
        }).then(function (data) {
          var items = data;
          console.log(items);
          fetch(imgApi).then(function (res) {
            return res.json();
          }).then(function (data) {
            console.log(data);
            var baseURL = data.images.base_url;
            var backdropSize = data.images.poster_sizes[1]; //const backdropPath = items.results[8].backdrop_path;

            var posterPath; // const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;
            //console.log(uniqueURL)

            var mediaType = _this.mediaType;
            var locationContainer = $("#".concat(_this.place));

            function post() {
              var loopCount = 20;

              for (var i = 0; i < loopCount; i++) {
                if (items.results[i].poster_path == null) {
                  loopCount++;
                  continue;
                } else {
                  posterPath = items.results[i].poster_path;
                  var uniqueURL = "".concat(baseURL).concat(backdropSize).concat(posterPath);
                  var element = $("\n                                    <a href=\"./info.html\" id=\"".concat(items.results[i].id, "\"class=\"item ").concat(mediaType, "\">\n                                        <img class=\"overlay poster\" src=\"").concat(uniqueURL, "\">\n                                    </a>\n                                "));
                  locationContainer.append(element);
                }
              }
            }

            post();
            var poster = document.querySelectorAll('a[href="./info.html"]');
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
          }); //SECOND FETCH END
        }) //FIRST GETCH END
        ["catch"](function (err) {
          return console.log(err);
        });
      } //FUNCTION END

    }]);

    return getMovie;
  }();

  var movieTrending = new getMovie(movieApi, 'movie-container', 'movie');
  movieTrending.getItems();
});