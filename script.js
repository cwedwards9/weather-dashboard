// Call getDates function to get dates
getDates();


// When a user enters in a city and clicks search, it calls the makeRequest function
$("#btnSearch").on("click", function(){
    var cityInput = $("#cityInput").val();

    makeRequest(cityInput);
});

// When a user clicks on a city in the history list, it calls the makeRequest function 
$("ul").on("click", "li", function(){
    var cityList = $(this).text();

    makeRequest(cityList);
})

// A GET request is made and gets the weather data (from openweather api) for the city parameter passed in
function makeRequest(city){
    var cityName = city;
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";
    console.log(weatherUrl);

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getWeather)
}

// Takes the requested weather data and inserts it into the html for the current day
function getWeather(data){
    console.log(data);

    // Get the city name, wind speed, uv index for the current day
    var cityName = data.name;
    $(".cityName").text(cityName);

    var temp = data.main.temp;
    $("#currentTemp").text(temp);

    var humidity = data.main.humidity;
    $("#currentHumidity").text(humidity);

    var windSpeed = data.wind.speed;
    $("#currentWind").text(windSpeed);

    // var uvIndex = data.
        
}


// Get the dates for today and the next 5 days
function getDates(){
    var now = moment().format("dddd, MMMM Do YYYY");
    $("#currentDate").text(now);

    // Get next five days and insert them into the weather forecast cards
    for(var i = 1; i < 2; i++){
        var day = moment().add(1, 'days');
        console.log(day);
        
        // $("#day" + i + " .date").text(day);
    }
}