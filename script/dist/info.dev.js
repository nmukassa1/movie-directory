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
  var recommendationsURL;

  if (mediaType === 'movie') {
    apiURL = "https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
    ccURL = "https://api.themoviedb.org/3/movie/".concat(id, "/credits?api_key=").concat(apiKey, "&language=en-UK");
    videoURL = "https://api.themoviedb.org/3/movie/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-UK");
    recommendationsURL = "https://api.themoviedb.org/3/movie/".concat(id, "/recommendations?api_key=").concat(apiKey, "&language=en-UK&page=1");
  } else {
    apiURL = "https://api.themoviedb.org/3/tv/".concat(id, "?api_key=").concat(apiKey, "&language=en-UK");
    ccURL = "https://api.themoviedb.org/3/tv/".concat(id, "/credits?api_key=").concat(apiKey, "&language=en-UK");
    videoURL = "https://api.themoviedb.org/3/tv/".concat(id, "/videos?api_key=").concat(apiKey, "&language=en-UK");
    recommendationsURL = "https://api.themoviedb.org/3/tv/".concat(id, "/recommendations?api_key=").concat(apiKey, "&language=en-UK&page=1");
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

    castCrewList(ccURL, 'director');
    castCrewList(ccURL, 'cast'); //Fetch similiar movies / tv series

    recommendations();
  })["catch"](function (err) {
    return console.log(err);
  });

  function backdrop(item) {
    fetch(imgApi).then(function (res) {
      return res.json();
    }).then(function (data) {
      //console.log(data)
      var baseURL = data.images.base_url;
      var backdropSize = data.images.backdrop_sizes[1];
      var backdropPath = item.backdrop_path;
      var uniqueURL = "".concat(baseURL).concat(backdropSize).concat(backdropPath);
      $('#hero-bg').css('background-image', "url(".concat(uniqueURL, ")"));
    });
  }

  function trailer(url) {
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      //console.log(data)
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

  function castCrewList(castCrewUrl, placement) {
    fetch(castCrewUrl).then(function (res) {
      return res.json();
    }).then(function (data) {
      // console.log(data, placement, 'castCrewList')
      var profileName;
      var profileId;
      var appendTo;

      if (placement === 'director') {
        appendTo = placement; //If the crew length is 0 = Directors doesn't exist

        if (data.crew.length === 0) {
          profileName = 'No Directors';
          $("#".concat(placement, "-list")).append(profileName); //alert('hh')
        } else {
          for (var i = 0; i < data.crew.length; i++) {
            //If crew length is > 0 = Possibility director exists
            if (data.crew[i].job != 'Director') {
              if (i === data.crew.length - 1) {
                //Having looped thru every item and director still doesn't exist, do this v
                $("#".concat(placement, "-list")).append('No Directors');
              } else {
                //Continue iteration
                continue;
              }
            } else {
              profileName = data.crew[i].name;
              profileId = data.crew[i].id;
              appendTo = placement;
              personImg(appendTo, data, profileId, profileName);
              break;
            }
          }
        }
      } else {
        appendTo = placement;

        for (var _i = 0; _i < 5; _i++) {
          profileName = data.cast[_i].name;
          profileId = data.cast[_i].id;
          personImg(appendTo, data, profileId, profileName);
        }
      }
    });
  }

  function personImg(appendTo, castCrewList, profileId, profileName) {
    //console.log(castCrewList, 'personImg')
    fetch("https://api.themoviedb.org/3/person/".concat(profileId, "/images?api_key=").concat(apiKey)).then(function (res) {
      return res.json();
    }).then(function (data) {
      //console.log(data, 'personImg Fetch request')
      //console.log(castCrewList)
      if (data.profiles.length > 0) {
        $("#".concat(appendTo, "-list")).append("\n                <div class=\"profile\">\n                    <div id=\"".concat(data.id, "-img\" class=\"img-container\"></div>\n                    <div id=\"").concat(appendTo, "-name\">").concat(profileName, "</div>\n                </div>\n                "));
        $("#".concat(data.id, "-img")).css('background-image', "url(https://image.tmdb.org/t/p/w185".concat(data.profiles[0].file_path, ")"));
      } else {
        $("#".concat(appendTo, "-list")).append('No image was found');
      }
    });
  }

  function recommendations() {
    fetch(recommendationsURL).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var name;
      var id;
      var posterPath;
      var postAmount = 12;

      for (var i = 0; i < postAmount; i++) {
        if (mediaType === 'movie') {
          if (data.results.length === 0) {
            $('#recommendations__container').text('No recommendations were found');
          } else {
            name = data.results[i].title;
            id = data.results[i].id;
            posterPath = data.results[i].poster_path;
            getPoster(id, posterPath, postAmount);
          }
        } else {
          name = data.results[i].name;
          id = data.results[i].id;
          posterPath = data.results[i].poster_path;
          getPoster(id, posterPath, postAmount);
        }
      }
    });
  }

  function getPoster(id, posterPath, postAmount) {
    fetch(imgApi).then(function (res) {
      return res.json();
    }).then(function (data) {
      console.log(data);
      var baseURL = data.images.base_url;
      var posterSize = data.images.poster_sizes[1];

      function post(postAmount) {
        var uniqueURL = "".concat(baseURL).concat(posterSize).concat(posterPath);
        console.log(uniqueURL);
        var element = $("\n                    <a href=\"info.html\" id=\"".concat(id, "\"class=\"item ").concat(mediaType, "\">\n                        <img class=\"overlay poster\" src=\"").concat(uniqueURL, "\">\n                    </a>\n                "));
        $('#recommendations__container').append(element);
      }

      post(postAmount);
      var poster = document.querySelectorAll('a[href="info.html"]');
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
    });
  } //When window loads


  function onLoad() {
    if (localStorage.getItem("".concat(mediaType, "-").concat(id))) {
      $('#favourites').css('color', '#EB5353');
    } else {
      $('#favourites').css('color', '');
    }
  }

  onLoad();
  $('#favourites').click(function () {
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
  });
});