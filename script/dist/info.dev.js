"use strict";

$('document').ready(function () {
  var year = new Date().getFullYear();
  var apiKey = '335228310c6b751750199c1a453b7347'; //Api to get image details like sizes and logos

  var imgApi = "https://api.themoviedb.org/3/configuration?api_key=".concat(apiKey);
  var mediaType = localStorage.getItem('mediaType');
  var id = localStorage.getItem('id');
  var apiURL; //VIDEO URL CONDITIONAL

  var ccURL;
  var videoURL;

  if (mediaType === 'movie') {
    apiURL = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
    ccURL = "https://api.themoviedb.org/3/movie/".concat(id, "/credits?api_key=").concat(apiKey, "&language=en-UK");
    videoURL = "https://api.themoviedb.org/3/movie/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-UK");
  } else {
    apiURL = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
    ccURL = "https://api.themoviedb.org/3/tv/".concat(id, "/credits?api_key=").concat(apiKey, "&language=en-UK");
    videoURL = "https://api.themoviedb.org/3/tv/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-UK");
  }

  fetch(apiURL).then(function (res) {
    return res.json();
  }).then(function (item) {
    console.log(item);
    $('#title').text(item.title || item.name);
    var releaseDateArr;

    if (item.release_date) {
      releaseDateArr = item.release_date.split('-');
    } else {
      releaseDateArr = item.first_air_date.split('-');
    }

    var releaseDate = [releaseDateArr[2], releaseDateArr[1], releaseDateArr[0]].join('-');
    $('#release').text(releaseDate);
    var genresArr = [];
    item.genres.forEach(function (gn) {
      genresArr.push(gn.name);
    });
    $('#genre').text(genresArr.join(', '));
    $('#bio').text(item.overview);
    var runtime;

    if (item.runtime) {
      runtime = item.runtime;
    } else {
      runtime = item.episode_run_time;
    }

    var hr;
    var min = "".concat(runtime % 60, "m");

    if (runtime > 60) {
      hr = "".concat(Math.floor(runtime / 60), "h");
    }

    $('#hr').text(hr);
    $('#min').text(min);
    backdrop(item); //trailer(videoURL)
    //CAST & CREW REQUEST

    castCrew(ccURL);
  })["catch"](function (err) {
    return console.log(err);
  });

  function backdrop(item) {
    fetch(imgApi).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var baseURL = data.images.base_url;
      var backdropSize = data.images.backdrop_sizes[1];
      var backdropPath = item.backdrop_path;
      var uniqueURL = "".concat(baseURL).concat(backdropSize).concat(backdropPath);
      $('#hero').css('background-image', "url(".concat(uniqueURL, ")"));
    });
  }

  function trailer(url) {
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

  function castCrew(castCrewUrl) {
    fetch(castCrewUrl).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var crewArr = data.crew;
      var director;
      var directorId;

      for (var i = 0; i < crewArr.length; i++) {
        if (crewArr[i].job != 'Director') {
          continue;
        } else {
          director = crewArr[i].name;
          directorId = crewArr[i].id;
          break;
        }
      }

      $('#director-name').text(director);
      personImg(directorId);
    });
  }

  function personImg(id) {
    fetch("https://api.themoviedb.org/3/person/".concat(id, "/images?api_key=").concat(apiKey)).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);

      if (data.profiles.length > !1) {
        $("#director-img").css('background-image', "url(https://image.tmdb.org/t/p/w45".concat(data.profiles[0].file_path, ")"));
      } else {
        $('#director-img').text('No image was found');
      }
    });
  }
});