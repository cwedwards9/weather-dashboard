// b007a7abea7f47541c213f81d9379014

// When a user enters in a city and clicks search, a GET request is made and gets the weather data from openweathermap api
$("#btnSearch").on("click", function(){
    var city = $("#cityInput").val();
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=b007a7abea7f47541c213f81d9379014";
    console.log(weatherUrl);

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(function(data){
        console.log(data);

        // Get the city name, wind speed, uv index for the current day
        var city = data.city.name;
        $(".cityName").text(city);

        var windSpeed = data.list[0].wind.speed;
        $("#windSpeed").text(windSpeed + "mph")


        // Get the tempurature and humidity for current day and next 5 days
        for(var i = 0; i < 2; i++){
            var temp = Math.round(data.list[i].main.temp);
            $("#temp" + i).text(temp + " F");

            var humidity = data.list[i].main.humidity;
            $("#humid" + i).text(humidity + "%");
        }
        
    })
});