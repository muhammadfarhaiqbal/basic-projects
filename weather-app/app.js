// Weather app using the free Open-Meteo APIs (no API key needed).
// 1) Geocoding API turns a city name into latitude/longitude.
// 2) Forecast API returns the current weather for those coordinates.
const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const message = document.getElementById('message');
const result = document.getElementById('result');

const WEATHER_NAMES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
  56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
  61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Light freezing rain', 67: 'Heavy freezing rain',
  71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Slight rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
  85: 'Slight snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
};

function showError(text) {
  message.textContent = text;
  result.hidden = true;
}

async function getWeather(city) {
  message.textContent = 'Loading...';
  result.hidden = true;

  const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name='
    + encodeURIComponent(city) + '&count=1';
  let geo;
  try {
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error('Geocoding request failed');
    geo = await geoRes.json();
  } catch (e) {
    showError('Network error — please check your internet connection and try again.');
    return;
  }
  if (!geo.results || geo.results.length === 0) {
    showError('City not found. Please check the spelling and try again.');
    return;
  }
  const place = geo.results[0];
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + place.latitude
    + '&longitude=' + place.longitude
    + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m';
  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather request failed');
    data = await res.json();
  } catch (e) {
    showError('Network error — could not load the weather. Please try again.');
    return;
  }
  const current = data.current;
  document.getElementById('city-name').textContent =
    place.name + (place.country ? ', ' + place.country : '');
  document.getElementById('temp').textContent = Math.round(current.temperature_2m);
  document.getElementById('condition').textContent =
    WEATHER_NAMES[current.weather_code] || 'Unknown conditions';
  document.getElementById('humidity').textContent = current.relative_humidity_2m;
  document.getElementById('wind').textContent = current.wind_speed_10m;
  message.textContent = '';
  result.hidden = false;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = input.value.trim();
  if (city === '') {
    showError('Please type a city name first.');
    return;
  }
  getWeather(city);
});

// Load a default city on first open.
getWeather('Lahore');
