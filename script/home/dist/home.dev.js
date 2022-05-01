"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  //FETCH API
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var discoverMovieApi = "https://api.themoviedb.org/3/discover/movie?api_key=".concat(apiKey, "&page=1&year=").concat(year, "&sort_by=popularity.desc&with_original_language=en");
  var discoverTvApi = "https://api.themoviedb.org/3/discover/tv?api_key=".concat(apiKey, "&page=1&year=").concat(year, "&sort_by=popularity.desc&with_original_language=en");
  var trendingMovieApi = "https://api.themoviedb.org/3/trending/movie/day?api_key=".concat(apiKey);
  var trendingTvApi = "https://api.themoviedb.org/3/trending/tv/day?api_key=".concat(apiKey);
  var popularMoviesApi = "https://api.themoviedb.org/3/movie/popular?api_key=".concat(apiKey, "&language=en-US&page=1");
  var popularTvApi = "https://api.themoviedb.org/3/tv/popular?api_key=".concat(apiKey, "&language=en-US&page=1");

  var Get =
  /*#__PURE__*/
  function () {
    function Get(url, place, mediaType) {
      _classCallCheck(this, Get);

      this.url = url;
      this.place = place;
      this.mediaType = mediaType;
    }

    _createClass(Get, [{
      key: "getItems",
      value: function getItems() {
        var _this = this;

        fetch(this.url).then(function (res) {
          return res.json();
        }).then(function (data) {
          var items = data; //console.log(items)

          fetch(imgApi).then(function (res) {
            return res.json();
          }).then(function (data) {
            //console.log(data)
            var baseURL = data.images.base_url;
            var backdropSize = data.images.backdrop_sizes[0]; //const backdropPath = items.results[8].backdrop_path;

            var posterPath; // const uniqueURL =`${baseURL}${backdropSize}${backdropPath}`;
            //console.log(uniqueURL)

            var mediaType = _this.mediaType;
            var locationContainer = $("#".concat(_this.place));

            function post() {
              var loopCount = 10;

              for (var i = 0; i < loopCount; i++) {
                if (items.results[i].poster_path == null) {
                  loopCount++;
                  continue;
                } else {
                  posterPath = items.results[i].poster_path;
                  var uniqueURL = "".concat(baseURL).concat(backdropSize).concat(posterPath);
                  var element = $("\n                                    <a href=\"page/info.html\" id=\"".concat(items.results[i].id, "\"class=\"item ").concat(mediaType, "\">\n                                        <img class=\"overlay poster\" src=\"").concat(uniqueURL, "\">\n                                    </a>\n                                "));
                  locationContainer.append(element);
                }
              }
            }

            post();
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
          }); //SECOND FETCH END
        }) //FIRST GETCH END
        ["catch"](function (err) {
          return console.log(err);
        });
      } //FUNCTION END

    }]);

    return Get;
  }();

  var movieTrending = new Get(trendingMovieApi, 'trending-movie-container', 'movie');
  movieTrending.getItems();
  var moviePopularContainer = new Get(popularMoviesApi, 'popular-movie-container', 'movie');
  moviePopularContainer.getItems();
  var tvContainer = new Get(trendingTvApi, 'trending-tv-container', 'tv');
  tvContainer.getItems();
  var tvPopularContainer = new Get(popularTvApi, 'popular-tv-container', 'tv');
  tvPopularContainer.getItems();
}); //END