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
const suggestionsElement = document.getElementById('suggestions');

const iconUrlBase = 'https://openweathermap.org/img/wn/';

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        hideSuggestions();
        showLoading();
        fetchWeather(location);
    }
});

locationInput.addEventListener('keydown', async (event) => {
    const suggestions = document.querySelectorAll('.suggestion-item');
    let selectedIndex = Array.from(suggestions).findIndex(item => item.classList.contains('selected'));

    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão do Enter
        if (suggestions.length > 0) {
            // Seleciona a primeira sugestão automaticamente
            const firstSuggestion = suggestions[0];
            locationInput.value = firstSuggestion.textContent;
            hideSuggestions();
            showLoading();
            fetchWeather({
                lat: firstSuggestion.dataset.lat,
                lon: firstSuggestion.dataset.lon,
                name: firstSuggestion.dataset.name
            });
        } else if (locationInput.value.trim()) {
            // Caso não haja sugestões, mas o input não esteja vazio, faz a busca com o texto digitado
            hideSuggestions();
            showLoading();
            fetchWeather(locationInput.value.trim());
        }
    } else if (event.key === 'Escape') {
        hideSuggestions();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        suggestions.forEach(item => item.classList.remove('selected'));

        if (event.key === 'ArrowDown') {
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        } else if (event.key === 'ArrowUp') {
            selectedIndex = Math.max(selectedIndex - 1, 0);
        }

        if (selectedIndex >= 0) {
            suggestions[selectedIndex].classList.add('selected');
            locationInput.value = suggestions[selectedIndex].textContent;
        }
    }
});

locationInput.addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length < 3) {
        hideSuggestions();
        return;
    }

    try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('No suggestions');

        const suggestions = await response.json();
        displaySuggestions(suggestions);
    } catch (error) {
        hideSuggestions();
    }
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.input-group')) {
        hideSuggestions();
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
    errorMessageElement.classList.add('loading');
    weatherInfo.classList.add('show');
}

async function fetchWeather(locationOrCoords) {
    let apiUrl;
    try {
        if (typeof locationOrCoords === 'object' && locationOrCoords.lat && locationOrCoords.lon) {
            apiUrl = `/api/weather?lat=${locationOrCoords.lat}&lon=${locationOrCoords.lon}`;
        } else {
            apiUrl = `/api/weather?city=${encodeURIComponent(locationOrCoords)}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Oops! Location not found');

        const data = await response.json();

        locationElement.textContent = data.name;
        const temp = Math.round(data.main.temp);
        temperatureElement.textContent = `${temp}°C`;
        descriptionElement.textContent = capitalize(data.weather[0].description);
        setWeatherIcon(data.weather[0].icon);
        changeBackground(data.weather[0].main, data.timezone);
        displayLocalTime(data.timezone);
        displayAdditionalInfo(data);
        updateFaviconWithAPIIcon(data.weather[0].icon);

        errorMessageElement.textContent = '';
        errorMessageElement.classList.remove('loading');
        weatherInfo.classList.add('show');
        locationInput.value = '';
        locationInput.blur();
    } catch (error) {
        temperatureElement.textContent = '';
        descriptionElement.textContent = '';
        weatherIconElement.innerHTML = '';
        timeElement.textContent = '';
        humidityElement.textContent = '';
        feelsLikeElement.textContent = '';
        errorMessageElement.classList.remove('loading');
        errorMessageElement.textContent = error.message;
        weatherInfo.classList.add('show');
    }
}

function displaySuggestions(suggestions) {
    suggestionsElement.innerHTML = '';
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }

    const ul = document.createElement('ul');
    suggestions.forEach((suggestion, index) => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.textContent = suggestion.fullName;
        li.dataset.lat = suggestion.lat;
        li.dataset.lon = suggestion.lon;
        li.dataset.name = suggestion.name;
        li.addEventListener('click', () => {
            locationInput.value = suggestion.fullName;
            hideSuggestions();
            showLoading();
            fetchWeather({ lat: suggestion.lat, lon: suggestion.lon, name: suggestion.name });
        });
        li.addEventListener('mouseenter', () => {
            document.querySelectorAll('.suggestion-item').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
        });
        ul.appendChild(li);
    });
    suggestionsElement.appendChild(ul);
    suggestionsElement.classList.add('show');
}

function hideSuggestions() {
    suggestionsElement.classList.remove('show');
    suggestionsElement.innerHTML = '';
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