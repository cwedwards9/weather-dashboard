// b007a7abea7f47541c213f81d9379014

// When a user enters in a city and clicks search, a GET request is made and gets the weather data from openweathermap api
$("#btnSearch").on("click", function(){
    var city = $("#cityInput").val();
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=b007a7abea7f47541c213f81d9379014";
    console.log(weatherUrl);

    // Make ajax call
    $.ajax({
        method: "GET",
        url: weatherUrl
    })
    .done(function(data){
        console.log(data);
        console.log(data.city.name);
        var city = data.city.name;
        $(".cityName").text(city);
    })
});