let apiKey = "255249ff881044e1962a8c1b6f06664b";
let vaule = document.querySelector(".search-bar")
let button = document.querySelector("#sökBtn")
//när jag klickar på sök så händer följade med denna function

button.addEventListener('click', function () {
    let cityName = vaule.value;

    let today = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${apiKey}&lang=sv`;
    
//hämtar och kollar så api funkar och har en stad att söka efter
    fetch(today).then((response) => {
        if (!response.ok) {

            throw "hitta inget väder.";
        }
        else {
            console.log(response);
            return response.json();
        }
        //hämtar den datan jag vill ha och sätter den i ett objekt
    }).then(function (data) {
        const todaysWeather = {};
        todaysWeather.temp = data.data[0].temp;
        todaysWeather.windSpeed = data.data[0].wind_spd;
        todaysWeather.timezone = data.timezone;
        todaysWeather.discription = data.data[0].weather.description;
        todaysWeather.fukt = data.data[0].rh;
        todaysWeather.city = data.city_name;
        setimg(data)
        //loopar fram resten av dagarna med en for-loop
        const forecastArray = [];
        for (let i = 1; i <= 5; i++) {


            const weather = {};
            weather.temp = data.data[i].temp;
            weather.fukt = data.data[i].rh;
            weather.discription = data.data[i].weather.description;
            weather.date = data.data[i].datetime;

            //pushar in mitt objekt i en array
            forecastArray.push(weather);
        } 
        //här skapas min animation
        document.body.appendChild(document.createElement("div")).classList.add("loader");
        animation("100");
        
        displayTodaysWeather(todaysWeather);
        logForecast(forecastArray);
        
    }).catch(function (error) {
        alert("skriv in en stad");
        console.log(error);})
        //tar mina h1 sen mina P och väljer vart jag ska skriva ut det
     function displayTodaysWeather(weatherObject) {
        const todayP = document.querySelectorAll('.today p');
        const todayH1 = document.querySelectorAll('.today h1');
        todayH1[0].innerText = weatherObject.city;
        todayP[0].innerHTML = weatherObject.icon;
        todayP[0].innerText = weatherObject.temp + "°C";
        todayP[1].innerText = weatherObject.windSpeed + "M/sec";
        todayP[2].innerText = weatherObject.discription + ".";
        todayP[3].innerText = weatherObject.fukt + "%";
        
        
    }
    //function för att få rätt icon. får fram vilket nummer med hjälp av 'data' 
    function setimg(data) {
        let y = 0;
        for (let i = 1; i < 6; i++) {
            document.querySelectorAll(".w-icon")[y].src = `icons/${data.data[y].weather.icon}.png`;
            y++

            console.log(data.data[y].weather.icon)
        }
        console.log(data.data[0].weather.icon)
        document.querySelector(".today-icon").src = `icons/${data.data[0].weather.icon}.png`;
    }
        //får mina 5 dagar med denna for-loopen som 
    function logForecast(array) {
        const forecastDivs = document.querySelectorAll('.forecast div');
            for (let i = 0; i < array.length; i++) {

            const children = forecastDivs[i].children;  
            children[0].innerText = array[i].date;
            children[2].innerText = array[i].temp + "°C";
            children[3].innerText = array[i].fukt + "%";
            children[4].innerText = array[i].discription;
           
         }

    }
})

// min animation som blir en loading-bar längst uppe på hemsidan.
function animation(width) {
    anime({
        targets: '.loader',
        width: width+"%", 
        easing: 'easeInOutQuad',
        duration: 1000
      });
     
        setTimeout(() => {
           document.querySelector(".loader").remove() 
        }, 2000);
      }
