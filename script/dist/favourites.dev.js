"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  //FETCH API
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey); //Obkect to hold localstorage 

  var obj = _objectSpread({}, localStorage); //Delete items i don't need


  delete obj.id;
  delete obj.mediaType; //Arry holding id values, so I can use to find out how long loop should last
  //& split tv and movie id

  var arr = Object.keys(obj);
  var id = Object.values(obj); //Empty array to hold all movie and tv id's so I know what api to run

  var movieId = [];
  var tvId = [];

  for (var i = 0; i < arr.length; i++) {
    if (arr.includes("movie-".concat(id[i]))) {
      movieId.push(id[i]);
    } else {
      tvId.push(id[i]);
    }
  }

  if (movieId[0] != null) {
    movieId.forEach(function (item) {
      getInfo("https://api.themoviedb.org/3/movie/".concat(item, "?api_key=").concat(apiKey, "&language=en-UK"));
    });
  }

  if (tvId[0] != null) {
    tvId.forEach(function (item) {
      getInfo("https://api.themoviedb.org/3/tv/".concat(item, "?api_key=").concat(apiKey, "&language=en-UK"));
    });
  }

  function getInfo(url) {
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var posterPath = data.poster_path;
      poster(posterPath);
    });
  }

  function poster(posterPath) {
    fetch(imgApi).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var baseURL = data.images.base_url;
      var size = data.images.poster_sizes[1];
      var link = "".concat(baseURL).concat(size).concat(posterPath);
      $('#poster-container').append("\n                <a href=\"info.html\" ><img src=\"".concat(link, "\"></a>\n            "));
    });
  }
});