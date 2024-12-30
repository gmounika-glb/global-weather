const apiKey = 'fcf6453d9b835d5676e6d7a222f5ec47';
const weatherIcons = {
  Clear: 'fas fa-sun',
  Clouds: 'fas fa-cloud',
  Rain: 'fas fa-cloud-showers-heavy',
  Snow: 'fas fa-snowflake',
  Thunderstorm: 'fas fa-bolt',
  Drizzle: 'fas fa-cloud-rain',
  Mist: 'fas fa-smog',
  Fog: 'fas fa-smog',
  Haze: 'fas fa-smog',
  Dust: 'fas fa-wind',
  Smoke: 'fas fa-smog',
  Default: 'fas fa-cloud-sun',
};
const weatherBackgroundColors = {
  Clear: './assets/clear.jpeg',
  Clouds: './assets/cloud.webp',
  Rain: './assets/rain.jpeg',
  Snow: './assets/snow.jpeg',
  Thunderstorm: './assets/thunderstrom.jpeg',
  Drizzle: './assets/drizzle.jpeg',
  Mist: './assets/mist.jpeg',
  Fog: './assets/fog.jpeg',
  Haze: './assets/haze.jpeg',
  Dust: './assets/dust.jpeg',
  Smoke: './assets/smoke.jpeg',
  Default: './assets/clear.jpeg',
};

document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value || 'Bengaluru';
  fetchWeather(city);
});

document.getElementById('resetButton').addEventListener('click', () => {
  document.getElementById('cityInput').value = 'Bengaluru';
  document.getElementById('additional-details').innerHTML = '';
  document.getElementById('forcast-more-details').innerHTML = '';
  fetchWeather('Bengaluru');
});

const toggleButton = document.getElementById('toggleModeButton');
const icon = toggleButton.querySelector('i');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if (document.body.classList.contains('light-mode')) {
    icon.classList.remove('bx-moon');
    icon.classList.add('bx-sun');
  } else {
    icon.classList.remove('bx-sun');
    icon.classList.add('bx-moon');
  }
});

async function fetchWeather(city) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();
    displayCurrentWeather(weatherData);
    displayAdditionalInfo(weatherData);
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastResponse.json();
    displayHourlyForecast(forecastData.list.slice(0, 8));
    displayWeeklyForecast(forecastData.list);
    fetchUVIndex(weatherData.coord.lat, weatherData.coord.lon);
  } catch (error) {
    console.error(error);
  }
}

async function fetchUVIndex(lat, lon) {
  try {
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    );
    const uvData = await uvResponse.json();
    displayUVIndex(uvData.value);
  } catch (error) {
    console.error('Error fetching UV Index:', error);
  }
}

function displayCurrentWeather(data) {
  const icon = weatherIcons[data.weather[0].main] || weatherIcons.Default;
  const weatherHTML = `
    <div id='current-weather'>
        <h2 class='current-weather-location'>${data.name}</h2>
        <p class='current-weather-temp'>${data.main.temp}°C</p>
        <i id='current-weather-icon'class="${icon} weather-icon"></i>
        <p class='current-weather-desc'>${data.weather[0].description}</p>
    </div>
  `;
  document.getElementById('weatherResult').innerHTML = weatherHTML;

  const moreHTML = `
    <div id='forcast-more-details'>
        <div class='cards'><i  id='add-title' class="fas fa-tint"> Humidity</i>  <br/> <span class='value'> ${data.main.humidity}%</span></div>
        <div class='cards'><i  id='add-title'class="fas fa-compress-arrows-alt"> Pressure</i>  <br/> <span class='value'> ${data.main.pressure} hPa</span></div>
        <div class='cards'><i  id='add-title' class="fas fa-eye"> Visibility</i>  <br/> <span class='value'> ${data.visibility} km</span></div>
    </div>
  `;
  document.getElementById('more-details').innerHTML = moreHTML;

  updateBackgroundColor(data.weather[0].main);
}

function displayAdditionalInfo(data) {
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const totalTimeInSeconds = data.sys.sunset - data.sys.sunrise;
  const randomFactor = Math.floor(Math.random() * 4) + 26;
  const moonriseSeconds = data.sys.sunset + randomFactor * 60;
  const moonsetSeconds = moonriseSeconds + totalTimeInSeconds;
  const moonrise = new Date(moonriseSeconds * 1000).toLocaleTimeString();
  const moonset = new Date(moonsetSeconds * 1000).toLocaleTimeString();

  const additionalHTML = `
    <div class="additional-info">
        <div class='cards'><i id='add-title' class="fas fa-sun"> Sunrise</i>  <br/> <span class='value'> ${sunrise.toLocaleTimeString()}</span></div>
        <div class='cards'><i id='add-title' class="fas fa-sun"> Sunset</i>  <br/> <span class='value'> ${sunset.toLocaleTimeString()}</span></div>
        <div class='cards'><i id='add-title' class="fas fa-moon"> Moonrise</i>  <br/> <span class='value'>  ${moonrise}</span></div>       
        <div class='cards'><i id='add-title' class="fas fa-moon"> Moonset</i>  <br/> <span class='value'>  ${moonset}</span></div>
    </div>
  `;
  document.getElementById('additional-details').innerHTML = additionalHTML;
}

function displayUVIndex(uvIndex) {
  const uvHTML = `<div class='cards'><i id='add-title' class="fas fa-sun"> UV Index </i>  <br/> <span class='value'> ${uvIndex}</span></div>`;
  document.getElementById('forcast-more-details').innerHTML += uvHTML;
}

function displayHourlyForecast(hourly) {
  let hourlyHTML = '';
  hourly.forEach(hour => {
    const icon = weatherIcons[hour.weather[0].main] || weatherIcons.Default;
    const time = new Date(hour.dt * 1000);
    const timeString = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    hourlyHTML += `
      <div class="forecast-card">
      <p id='title'>${timeString}</p>
          <i id='icon-forecast'class="${icon} weather-icon"></i>
          <p id='condition'> ${hour.weather[0].description}</p>
          <p id='temp'> ${hour.main.temp}°C</p>
      </div>
    `;
  });
  document.getElementById('hourly-forecast').innerHTML = hourlyHTML;
}

function displayWeeklyForecast(weekly) {
  let weeklyHTML = '';
  weekly.forEach((day, index) => {
    if (index % 8 === 0) {
      const icon = weatherIcons[day.weather[0].main] || weatherIcons.Default;
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString([], {weekday: 'long'});
      weeklyHTML += `
        <div class="forecast-card">
        <p id='title'>${dayName} </p>
            <i id='icon-forecast' class="${icon} weather-icon"></i>
            <p id='condition'>${day.weather[0].description}</p>
            <p id='temp'> ${day.main.temp}°C</p>
        </div>
      `;
    }
  });
  document.getElementById('weekly-forecast').innerHTML = weeklyHTML;
}

function updateBackgroundColor(weather) {
  const color =
    weatherBackgroundColors[weather] || weatherBackgroundColors.Default;
  document.body.style.backgroundImage = `url(${color})`;
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const {latitude, longitude} = position.coords;
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherResponse.json();
      displayCurrentWeather(weatherData);
      displayAdditionalInfo(weatherData);
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastResponse.json();
      displayHourlyForecast(forecastData.list.slice(0, 8));
      displayWeeklyForecast(forecastData.list);
      fetchUVIndex(weatherData.coord.lat, weatherData.coord.lon);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
getCurrentLocationWeather();

document.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    document.getElementById('searchButton').click();
  }
  if (event.key === 'r' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
    event.preventDefault();
    document.getElementById('resetButton').click();
  }
  if (event.key === 'm' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    document.getElementById('toggleModeButton').click();
  }
  if (event.key === 's') {
    document.getElementById('cityInput').focus();
  }
});
