
import {api_key,access_Key} from './keys.js'

const inputValue = document.querySelector(".input-value");
const cityName = document.querySelector(".city-list");
const currentTemp = document.querySelector(".current-temp");
const weatherDesc = document.querySelector(".weather-desc");
let button = document.querySelector(".button");
const city = document.querySelector('.city');
const lowTemp = document.querySelector(".low-temp");
const weatherBg = document.querySelector(".city-details");
let displayIcon = document.querySelector('.display-icon');
let forecastDate = document.querySelector('.forecast-date');
let forecastTime = document.querySelector('.forecast-time');
let forecastTempElement = document.querySelector('.forecast-temp');
let forecastWrapper = document.querySelector('.forecast-wrapper');
let weatherNow = document.querySelector('.weather-now');
let feelsLike = document.querySelector('.feels-like');
let windSpeed = document.querySelector('.wind-speed');



async function fetchBackgroundImg(city) {
    try {
        let response = await fetch(`https://api.unsplash.com/search/photos?client_id=${access_Key}&query=${city}`);
        let data = await response.json();
        
        let randNum = Math.floor(Math.random() * 10);
        let imgSrc = data.results[randNum].urls.raw;
        
        weatherBg.style.backgroundImage = `url(${imgSrc})`;
    } catch (error) {
        console.error("Unsplash not fetching the data");
    }
}

function getBackgroundImg(currentTemp) {
    if (currentTemp < 1) {
        weatherBg.style.backgroundImage = "url('img/snow.jpg')";
    } else if (currentTemp > 1 && currentTemp < 5) {
        weatherBg.style.backgroundImage = "url('img/mist.jpg')";
    } else if (currentTemp > 5 && currentTemp < 20) {
        weatherBg.style.backgroundImage = "url('img/mist.jpg')";
    } else if (currentTemp > 20) {
        weatherBg.style.backgroundImage = "url('img/sunny.jpg')";
    }
}

function getCurrentPosition() {
    // Using the navigator to access the user's current location 
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error); // success and error functions for the geolocation
    }
    function success(position) {
        let lat = Number(position.coords.latitude);
        let long = Number(position.coords.longitude);


        weatherNow.style.display = 'none';


        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`)
        .then(response => response.json())
        .then(data => {
            
            city.innerHTML = data.name;
            currentTemp.innerHTML = Math.round(data.main.temp);
            weatherDesc.innerHTML = data.weather[0].description;
            feelsLike.innerHTML = Math.round (data.main.feels_like) + " °C";
            windSpeed.innerHTML = data.wind.speed + " m/s"
            //highTemp.innerHTML = data.main.temp_max;
            // lowTemp.innerHTML = data.main.temp_min;
            getBackgroundImg(currentTemp.innerHTML);

        }).catch(error => {
            console.error(`Asem Aba ${error}`);
        });
    }
    function error(position) {
        alert("Geolocation Failed");
    }
}

function getWeatherConditionIcon(currentTemp){
    let src
    if (currentTemp < 1) {
        src= "img/conditions/snow.svg"
    } else if (currentTemp > 1 && currentTemp < 5) {
        src = "img/conditions/cloudy.svg"
    } else if (currentTemp > 5 && currentTemp < 20) {
        src = "img/conditions/mostly.svg"
    } else if (currentTemp > 20) {
        src = "img/conditions/sunny.svg"
    }
    return src;
}

async function getWeatherForecast() {
    try {
        forecastWrapper.innerHTML = "";
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${inputValue.value}&units=metric&appid=${api_key}`);
        let data = await response.json();

        let forecastArray = data.list;        

            for(let i=0;i<4;i++){
                let dateTime = forecastArray[i].dt_txt;
                let forecastTemp = forecastArray[i].main.temp;
                let time = dateTime.split(" ")[1];
                let date = dateTime.split(" ")[0];

                let formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });


                let formattedTime = new Date(dateTime).toLocaleTimeString('en-US', {hour:'numeric'})

                
                let forecastWrapper = document.querySelector('.forecast-wrapper');
                let forecastList = document.createElement('li');

                let forecastContentDate = document.createElement('span');
                let forecastContentTemp = document.createElement('span');
                let forecastContentTime = document.createElement('span');
                let forecastImg = document.createElement('img');
                let forecastImgWrapper = document.createElement('div');


                forecastContentDate.textContent = `${formattedDate}`;
                forecastContentTemp.textContent = `${forecastTemp}`;
                forecastContentTime.textContent = `${formattedTime}`;
                forecastImg.src = getWeatherConditionIcon(forecastTemp);

                forecastList.classList.add('forecast-card')
                forecastContentDate.classList.add('forecast-date')
                forecastContentTemp.classList.add('forecast-temp')
                forecastContentTime.classList.add('forecast-time')
                forecastImg.classList.add('forecast-img')
                forecastImgWrapper.classList.add('forecast-img-wrapper')

                forecastList.appendChild(forecastContentDate);
                forecastImgWrapper.appendChild(forecastImg);
                forecastImgWrapper.appendChild(forecastContentTemp);
                forecastList.appendChild(forecastImgWrapper)
                forecastList.appendChild(forecastContentTime);

                forecastWrapper.appendChild(forecastList);
                
                
                
            }

    } 
    catch (error) {
        console.error(`Forecast Error: ${error}`);
    }
}


getCurrentPosition();


button.addEventListener('click', getCurrentWeather);
    
function getCurrentWeather() {
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&units=metric&appid=${api_key}`)
    .then(response => response.json())
    .then(data => {
        fetchBackgroundImg(inputValue.value);
        getWeatherForecast();

        city.innerHTML = data.name;
        currentTemp.innerHTML = Math.round(data.main.temp);
        weatherDesc.innerHTML = data.weather[0].description;
        feelsLike.innerHTML = Math.round (data.main.feels_like) + " °C";
        windSpeed.innerHTML = data.wind.speed + " m/s"

        weatherNow.style.display = 'block';

        const weatherDescription = data.weather[0].description.toLowerCase();
        inputValue.value = "";
    })
    .catch(error => console.error('Error fetching weather data:', error));
}
