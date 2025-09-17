# How's the Weather

**How's the Weather** is a sleek and interactive weather web application that allows users to check real-time weather conditions for any city. The app displays temperature, humidity, local time, and a brief description of the weather, along with dynamic backgrounds and favicon updates that reflect the current weather conditions. Built with HTML, CSS, and JavaScript, it fetches data from the OpenWeatherMap API.

---

## Features

- Search for any city to get current weather data.
- Displays:
  - Temperature
  - Humidity
  - "Feels like" temperature
  - Weather description
  - Local time
- Dynamic background changes based on weather conditions:
  - Sunny
  - Cloudy
  - Rainy
  - Thunderstorm
  - Snowy
  - Night
- Favicon updates according to weather.
- Responsive design for both desktop and mobile devices.
- Loading feedback while fetching data.
- Handles errors gracefully (e.g., city not found).

---

## Technologies Used

- **HTML5**
- **CSS3** (with responsive design and animated backgrounds)
- **JavaScript** (ES6+)
- **OpenWeatherMap API** for real-time weather data.

---

## Installation & Usage

1. **Clone the repository:**

```git clone https://github.com/DevFabioBarros/hows-the-weather.git```

2. **Navigate to the project folder:**

```cd hows-the-weather```


3. **Open ```index.html``` in your browser:**

No server is required; the app runs locally in any modern browser.

4. **Search for a city:**

Enter the city name in the input field and click "Search" or press Enter.

---
## API Setup

The app uses the OpenWeatherMap API. To use it, you need an API key:

1. Sign up at OpenWeatherMap

2. Generate an API key.

3. Replace the API_KEY value in script.js with your own key:
```const API_KEY = 'your_api_key_here';```

---
## Contributing
Contributions are welcome! You can help by:

- Reporting bugs

- Suggesting new features

- Improving the UI or code
