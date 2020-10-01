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
        $(".cityName").append(city);

        var windSpeed = data.list[0].wind.speed;
        $("#day0 .windSpeed").text(windSpeed + " mph");

        // var uvIndex = data.list[0].


        // Get the tempurature and humidity for current day and next 5 days
        for(var i = 0; i < 2; i++){
            var temp = Math.round(data.list[i].main.temp);
            $("#day" + i + " .temp").text(temp + " F");

            var humidity = data.list[i].main.humidity;
            $("#day" + i + " .humid").text(humidity + "%");
        }
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