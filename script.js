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
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";
    console.log(weatherUrl);

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(getWeather)
}

// Takes the requested weather data and inserts it into the html for the current day and the next 5 days 
function getWeather(data){
    console.log(data);

        // Get the city name, wind speed, uv index for the current day
        var city = data.city.name;
        $(".cityName").text(city);

        var windSpeed = data.list[0].wind.speed;
        $("#windSpeed").text(windSpeed + " mph")


        // Get the tempurature and humidity for current day and next 5 days
        for(var i = 0; i < 2; i++){
            var temp = Math.round(data.list[i].main.temp);
            $("#temp" + i).text(temp + " F");

            var humidity = data.list[i].main.humidity;
            $("#humid" + i).text(humidity + "%");
        }
}