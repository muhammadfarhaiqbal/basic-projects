# Weather App

A weather app in HTML, CSS and JavaScript using the **free Open-Meteo API** — no API key, no sign-up, no money.

## Features
- Search any city by name
- Shows temperature (°C), condition, humidity and wind speed
- Clear error message when the city is not found or the internet is down
- Loads Lahore weather by default

## How it works
1. The free geocoding API (`geocoding-api.open-meteo.com`) turns the city name into latitude/longitude.
2. The free forecast API (`api.open-meteo.com`) returns the current weather for those coordinates.

## How to run
Open `index.html` in a browser with an internet connection.

Note: `fetch()` to the Open-Meteo API needs internet access. If you open the file with the `file://` protocol in some browsers, the request still works because Open-Meteo sends CORS headers, but if your browser blocks it, serve the folder with `python -m http.server` and open `http://localhost:8000`.

## Files
- `index.html` — page structure
- `style.css` — styling
- `app.js` — API calls + display logic
