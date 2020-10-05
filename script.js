// Get array of last 8 cities searched from local storage and if none, use default array
var searchedCities = JSON.parse(localStorage.getItem("cities")) || ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Los Angeles"];

// Call requestWeather to insert a default (last searched) city into the dashboard on page load
requestWeather(searchedCities[0]);

// Call getDates function to get dates
getDates();

// Call createList to insert city search history into the list side-bar
createList();


// When a user enters in a city and clicks search, it calls the requestWeather function
$("#btnSearch").on("click", function(){
    var cityInput = $("#cityInput").val();
    if(cityInput !== ""){
        requestWeather(cityInput);
    } else {
        return;
    }
});
// When a user presses the enter key with a city in the input, it calls the requestWeather function
$("#cityInput").on("keypress", function(e){
    if(e.which === 13){
        var cityEnter = $(this).val();
        if(cityEnter !== ""){
            requestWeather(cityEnter);
        } else {
            return;
        }
    }     
});
// When a user clicks on a city in the history list, it calls the requestWeather function 
$("ul").on("click", "li", function(){
    var cityList = $(this).text();
   
    requestWeather(cityList);
});

// Request CURRENT weather data (from openweather api) for the city parameter passed in
function requestWeather(city){
    var cityName = city;
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

    // Clear input
    $("#cityInput").val("");

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getWeather)


    // Save searched city into searchedCities array and remove last item in array if it is a new city not already in array
    if(!searchedCities.includes(cityName)){
        searchedCities.unshift(cityName);
        searchedCities.pop();
        localStorage.setItem("cities", JSON.stringify(searchedCities));
    }
    
    // Call create list function to insert city array names into the list 
    createList();
}

// Takes the requested weather data and inserts it into the html for the current day
function getWeather(data){
    console.log(data);

    // Get the city name, wind speed, uv index for the current day
    var cityName = data.name;
    $(".cityName").text(cityName);

    var temp = Math.round(data.main.temp);
    $("#currentTemp").text(temp + " \xB0F");

    var humidity = data.main.humidity;
    $("#currentHumidity").text(humidity + "%");

    var windSpeed = data.wind.speed;
    $("#currentWind").text(windSpeed + " mph");

    // Get latitude and longitude to use to find UV Index
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    getUVIndex(lat, lon);


    // Call requestForecast function to request the data for future weather forecast
    requestForecast(cityName);
        
}


// Get UV Index from OpenWeather map's uv api
function getUVIndex(lat, lon){
    var url = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=b007a7abea7f47541c213f81d9379014";

    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data){
        var uvIndex = data.value;
        $("#currentUv").text(uvIndex);

        if(uvIndex < 4){
            $("#currentUv").css("background-color", "#289500");
        } else if(uvIndex >= 4 && uvIndex <= 6){
            $("#currentUv").css("background-color", "#F85900");
        } else {
            $("#currentUv").css("background-color", "#D80010");
        }
    })
}


// Request FORECASTED weather data (from openweather api) for the city parameter passed in
function requestForecast(city){
    var cityName = city;
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getForecast)
}

// Takes the requested weather data and inserts it into the html for the next 5 days
function getForecast(data){
    // console.log(data);

    var x = 0;
    // Get the forecasted temperature as well as the humidity and chance of rain
    for(var i = 7; i < 40; i+= 8){
        // Temperature
        var temp = Math.floor(data.list[i].main.temp);
        $("#day" + x + " .temp").text(temp + " \xB0F");

        // Humidity
        var humidity = data.list[i].main.humidity;
        $("#day" + x + " .humid").text(humidity + "%");

        x++;
    }
}


// Get the dates for today and the next 5 days
function getDates(){
    var now = moment().format("dddd, MMMM Do YYYY");
    $("#currentDate").text(now);

    // Get next five days (name and date) and insert them into the weather forecast cards
    for(var i = 0; i < 5; i++){
        var dayName = moment().add(i + 1, 'days').format("dddd");
        var date = moment().add(i + 1, 'days').format("MMM D, YYYY");
        
        $("#day" + i + " .dayName").text(dayName);
        $("#day" + i + " .date").text(date);
    }
}

// Insert city search history into the list side-bar
function createList(){
    var items = $("li");
    var cities = Array.from(items);

    for(var i = 0; i < searchedCities.length; i++){
        var city = cities[i];

        $(city).text(searchedCities[i]);   
    }
}