function startTime() {
    var date = new Date();
    var todaysDate = date.toDateString();
    var currentTime = date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit"
    });

    var fullDate = todaysDate;
    var digitalClock = currentTime;

    document.getElementById("date").innerHTML = fullDate;
    document.getElementById("time").innerHTML = digitalClock;

    var t = setTimeout(startTime, 500);
}

function getQuote() {
    $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=",
    function(data) {
        $("#quote").append(data[0].content + "<p>&mdash; " + data[0].title + "</p>")
    });
}

function getTrend() {
    var $trending = $("#twitter-section ul");

    var trendURL = "http://api.whatthetrend.com/api/v2/trends.json"
    $.getJSON(trendURL, function(data) {
        for (var i = 0; i < 6; i++) {
            $trending.append('<li>' + '<a href="'+'https://twitter.com/search?q='+data.trends[i].name+'" target="_blank">'+data.trends[i].name+'</a>' + '</li>');
        };
    })
    return false;
}

function weatherCheck() {
    $("#weather-section form").hide();
    $("#clear-zip").hide();

    if (localStorage.getItem('cacheZip') != null) {
        var zip = localStorage.getItem('cacheZip');
        loadWeather(zip);
    } else {
        navigator.geolocation.getCurrentPosition(function(position) {
            loadWeather(position.coords.latitude+','+position.coords.longitude);
        });
    }

    if ((!navigator.geolocation.getCurrentPosition.position) && (localStorage.getItem('cacheZip') == null)) {
        $("#weather-section form").show();
    }
}

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'f',
        success: function(weather) {
            html = '<h2><i id="main-weather" class="icon-'+ weather.code+'"></i>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
            html += '<li> <i class="icon-'+ weather.forecast[1].code+'"></i>'+weather.forecast[1].day+': '+weather.forecast[1].high+ '&#8457'+ '</li>';
            html += '<li> <i class="icon-'+ weather.forecast[2].code+'"></i>'+weather.forecast[2].day+': '+weather.forecast[2].high+ '&#8457'+ '</li>';
            html += '<li> <i class="icon-'+ weather.forecast[3].code+'"></i>'+weather.forecast[3].day+': '+weather.forecast[3].high+ '&#8457'+ '</li>';
            html += '<p>'+weather.city+', '+weather.region+'</p>';
            $("#weather-section").html(html);
            $("#clear-zip").show();
        },
        fail: function error() {
            $("#weather-section").html('<p>ERROR</p>');
        }
    });
}

$("#weather-section form").submit(function(event) {
    event.preventDefault();
    var zipcode = $("#weather-section form input").val();
    loadWeather(zipcode);
    saveZipLocally(zipcode);
});

function saveZipLocally(zip) {
    localStorage.setItem('cacheZip', zip);
}

$("#clear-zip").on("click", function() {
    localStorage.clear();
    location.reload();
});

$(document).ready(function() {
    startTime();
    getQuote();
    getTrend();
    weatherCheck();
});
