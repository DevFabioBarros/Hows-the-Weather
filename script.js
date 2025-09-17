const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.querySelector('.weather-icon');
const weatherInfo = document.querySelector('.weather-info');
const timeElement = document.getElementById('time');
const humidityElement = document.getElementById('humidity');
const feelsLikeElement = document.getElementById('feels-like');
const errorMessageElement = document.getElementById('errorMessage');

const iconUrlBase = 'https://openweathermap.org/img/wn/';

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        showLoading();
        fetchWeather(location);
    }
});

locationInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            showLoading();
            fetchWeather(location);
        }
    }
});

function showLoading() {
    weatherInfo.classList.remove('show');
    locationElement.textContent = '';
    temperatureElement.textContent = '';
    descriptionElement.textContent = '';
    weatherIconElement.innerHTML = '';
    timeElement.textContent = '';
    humidityElement.textContent = '';
    feelsLikeElement.textContent = '';
    errorMessageElement.textContent = 'Loading...';
    weatherInfo.classList.add('show');
}

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Oops! City not found');
            return response.json();
        })
        .then(data => {
            locationElement.textContent = data.name;
            const temp = Math.round(data.main.temp);
            temperatureElement.textContent = `${temp}°C`;
            descriptionElement.textContent = capitalize(data.weather[0].description);
            setWeatherIcon(data.weather[0].icon);
            changeBackground(data.weather[0].main, data.timezone);
            displayLocalTime(data.timezone);
            displayAdditionalInfo(data);
            errorMessageElement.textContent = '';
            updateFaviconWithAPIIcon(data.weather[0].icon);
            weatherInfo.classList.add('show');
            locationInput.value = '';
            locationInput.focus();
        })
        .catch(error => {
            temperatureElement.textContent = '';
            descriptionElement.textContent = '';
            weatherIconElement.innerHTML = '';
            timeElement.textContent = '';
            humidityElement.textContent = '';
            feelsLikeElement.textContent = '';
            errorMessageElement.textContent = error.message;
            weatherInfo.classList.add('show');
        });
}

function setWeatherIcon(iconCode) {
    const iconUrl = `${iconUrlBase}${iconCode}@2x.png`;
    weatherIconElement.innerHTML = `<img src="${iconUrl}" alt="weather icon" />`;
}

function changeBackground(condition, timezone) {
    const body = document.body;
    condition = condition.toLowerCase();

    const localTime = new Date((Date.now() + (timezone * 1000)));
    const hour = localTime.getUTCHours();
    const isDaytime = (hour >= 6 && hour < 18);

    body.classList.remove('sunny', 'cloudy', 'rainy', 'thunderstorm', 'snowy', 'night');

    if (condition === 'clear') {
        body.classList.add(isDaytime ? 'sunny' : 'night');
    } else if (condition === 'clouds') {
        body.classList.add('cloudy');
    } else if (condition === 'rain' || condition === 'drizzle') {
        body.classList.add('rainy');
    } else if (condition === 'thunderstorm') {
        body.classList.add('thunderstorm');
    } else if (condition === 'snow') {
        body.classList.add('snowy');
    } else {
        body.classList.add('cloudy');
    }
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function displayLocalTime(timezone) {
    const localTime = new Date((Date.now() + (timezone * 1000)));
    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `Local Time: ${hours}:${minutes}`;
}

function displayAdditionalInfo(data) {
    const humidity = data.main.humidity;
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const feelsLike = Math.round(data.main.feels_like);
    feelsLikeElement.textContent = `Feels Like: ${feelsLike}°C`;
}

function updateFaviconWithAPIIcon(iconCode) {
    const favicon = document.getElementById('favicon');
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    favicon.href = iconUrl;
}