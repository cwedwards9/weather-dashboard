// Get array of last 8 cities searched from local storage and if none, use default array
const searchedCities = JSON.parse(localStorage.getItem("cities")) || ["Austin", "Chicago", "Dallas", "Houston", "Los Angeles", "New York", "Philadelphia", "Phoenix", "San Antonio", "San Diego"];

// Call requestWeather to insert a default (last searched) city into the dashboard on page load
requestWeather(searchedCities[0]);

// Call getDates function to get dates
getDates();

// Call createList to insert city search history into the list side-bar
createList();


// When a user enters in a city and clicks search, it calls the requestWeather function
$("#btnSearch").on("click", function(){
    let cityInput = $("#cityInput").val();
    if(cityInput !== ""){
        requestWeather(cityInput);
    } else {
        return;
    }
});
// When a user presses the enter key with a city in the input, it calls the requestWeather function
$("#cityInput").on("keypress", function(e){
    if(e.which === 13){
        let cityEnter = $(this).val();
        if(cityEnter !== ""){
            requestWeather(cityEnter);
        } else {
            return;
        }
    }     
});
// When a user clicks on a city in the history list, it calls the requestWeather function 
$("ul").on("click", "li", function(){
    let cityList = $(this).text();
   
    requestWeather(cityList);
});

// Request CURRENT weather data (from openweather api) for the city parameter passed in
function requestWeather(city){
    let cityName = city;
    let weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

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
    // Get the city name, weather condition, wind speed, uv index for the current day
    let cityName = data.name;
    $(".cityName").text(cityName);

    // Remove any active classes, set weather condition variable, call getIcon function to retrieve corresponding icon
    $("#weatherIcon").removeClass("fas fa-sun fas fa-cloud fas fa-cloud-showers-heavy fas fa-cloud-sun-rain");
    let weatherCondition = data.weather[0].main;
    let icon = getIcon(weatherCondition);
    $("#weatherIcon").addClass(icon);
    
    let temp = Math.round(data.main.temp);
    $("#currentTemp").text(temp + " \xB0F");

    let humidity = data.main.humidity;
    $("#currentHumidity").text(humidity + "%");

    let windSpeed = data.wind.speed;
    $("#currentWind").text(windSpeed + " mph");

    // Get latitude and longitude to use to find UV Index
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    getUVIndex(lat, lon);

    // Call requestForecast function to request the data for future weather forecast
    requestForecast(cityName);
}


// Get the weather icon for the current weather of the city
function getIcon(condition){
    var icon;
    switch(condition){
        case "Clear":
            icon = "fas fa-sun";
            break;
        case "Clouds":
            icon = "fas fa-cloud";
            break;
        case "Rain":
            icon = "fas fa-cloud-showers-heavy";
            break;
        case "Mist":
            icon = "fas fa-cloud-sun-rain";
            break;
        case "Fog":
            icon = "fas fa-smog";
            break;
        case "Haze":
            icon = "fas fa-smog";
            break;
        default:
            icon = "fas fa-cloud-sun";
            break;
    }
    return icon;
}


// Get UV Index from OpenWeather map's uv api
function getUVIndex(lat, lon){
    let url = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=b007a7abea7f47541c213f81d9379014";

    $.ajax({
        method: "GET",
        url: url
    })
    .done(function(data){
        let uvIndex = data.value;
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
    let cityName = city;
    let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getForecast)
}

// Takes the requested weather data and inserts it into the html for the next 5 days
function getForecast(data){
    let x = 0;
    // Get the forecasted temperature as well as the humidity and chance of rain
    for(let i = 7; i < 40; i+= 8){
        // Temperature
        let temp = Math.floor(data.list[i].main.temp);
        $("#day" + x + " .temp").text(temp + " \xB0F");

        // Humidity
        let humidity = data.list[i].main.humidity;
        $("#day" + x + " .humid").text(humidity + "%");

        // Weather Condition Icon
        $("#day" + x + " .icon").removeClass("fas fa-sun fas fa-cloud fas fa-cloud-showers-heavy fas fa-cloud-sun-rain");
        let condition = data.list[i].weather[0].main;
        let icon = getIcon(condition);
        $("#day" + x + " .icon").addClass(icon);

        x++;
    }
}


// Get the dates for today and the next 5 days
function getDates(){
    let now = moment().format("dddd, MMMM Do YYYY");
    $("#currentDate").text(now);

    // Get next five days (name and date) and insert them into the weather forecast cards
    for(let i = 0; i < 5; i++){
        let dayName = moment().add(i + 1, 'days').format("dddd");
        let date = moment().add(i + 1, 'days').format("MMM D, YYYY");
        
        $("#day" + i + " .dayName").text(dayName);
        $("#day" + i + " .date").text(date);
    }
}

// Insert city search history into the list side-bar
function createList(){
    let items = $("li");
    let cities = Array.from(items);

    for(let i = 0; i < searchedCities.length; i++){
        let city = cities[i];

        $(city).text(searchedCities[i]);   
    }
}