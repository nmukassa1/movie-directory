"use strict";

$('document').ready(function () {
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var mediaType = localStorage.getItem('mediaType');
  var id = localStorage.getItem('id');
  var apiURL;
  var videoURL;

  if (mediaType === 'movie') {
    apiURL = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(apiKey, "&language=en-US");
  } else {
    apiURL = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(apiKey, "&language=en-US");
  }

  if (mediaType === 'movie') {
    videoURL = "https://api.themoviedb.org/3/movie/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-US");
  } else {
    videoURL = "https://api.themoviedb.org/3/tv/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-US");
  }

  fetch(apiURL).then(function (res) {
    return res.json();
  }).then(function (item) {
    console.log(item);
    backdrop(item);
    videos(videoURL);
  })["catch"](function (err) {
    return console.log(err);
  });

  function backdrop(item) {
    fetch(imgApi).then(function (res) {
      return res.json();
    }).then(function (data) {
      var baseURL = data.images.base_url;
      var backdropSize = data.images.backdrop_sizes[1];
      var backdropPath = item.backdrop_path;
      var uniqueURL = "".concat(baseURL).concat(backdropSize).concat(backdropPath);
      $('img').attr('src', uniqueURL);
    });
  }

  function videos(url) {
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var key;

      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].site === "YouTube" && data.results[i].type === "Trailer") {
          key = data.results[i].key;
          break;
        } else {
          continue;
        }
      }

      var link = "https://www.youtube.com/embed/".concat(key, "?autoplay=1");
      $('iframe').attr('src', link);
      console.log($('iframe'));
    });
  }
});