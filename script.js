// Call getDates function to get dates
getDates();


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
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getWeather)
}

// Takes the requested weather data and inserts it into the html for the current day
function getWeather(data){

    // Get the city name, wind speed, uv index for the current day
    var cityName = data.name;
    $(".cityName").text(cityName);

    var temp = Math.round(data.main.temp);
    $("#currentTemp").text(temp + "F");

    var humidity = data.main.humidity;
    $("#currentHumidity").text(humidity + "%");

    var windSpeed = data.wind.speed;
    $("#currentWind").text(windSpeed + " mph");

    // var uvIndex = data.


    // Call requestForecast function to request the data for future weather forecast
    requestForecast(cityName);
        
}


// Request FORECASTED weather data (from openweather api) for the city parameter passed in
function requestForecast(city){
    var cityName = city;
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getForecast)

}

// Takes the requested weather data and inserts it into the html for the next 5 days
function getForecast(data){
    console.log(data);

    var x = 0;
    // Get the date and its forecasted high and low as well as the humidity and chance of rain
    for(var i = 7; i < 40; i+= 8){
        // Date
        var date = data.list[i].dt_txt;
        console.log(date);
        $("#day" + x + " .date").text(date);

        // Temperature
        var temp = Math.floor(data.list[i].main.temp);
        $("#day" + x + " .temp").text(temp + " F");

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

    // Get next five days and insert them into the weather forecast cards
    // for(var i = 1; i < 2; i++){
    //     var day = moment().add(1, 'days');
        
    //     $("#day" + i + " .date").text(day);
    // }
}