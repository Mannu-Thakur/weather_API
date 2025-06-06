const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        updateForecastsInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        updateForecastsInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

const notFoundSection = document.querySelector('.not-found');
const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');
const countryTxt = document.querySelector('.country-text');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container');

const apiKey = 'b95cd3c52ca79a5b50abd11780234d30';

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'tn.svg';
    if (id <= 321) return 'dz.svg';
    if (id <= 531) return 'rn.svg';
    if (id <= 622) return 'sn.svg';
    if (id <= 781) return 'at.svg';
    if (id === 800) return 'cl.svg';
    return 'cld.svg';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';
    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `images/${getWeatherIcon(id)}`;

    showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    if (!forecastsData.list) return;

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';

    forecastsData.list.forEach(forecastWeather => {
        if (
            forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.startsWith(todayDate)
        ) {
            updateForecastsItems(forecastWeather);
        }
    });
}

function updateForecastsItems(weatherData) {
    const {
        dt_txt: dateText,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const datetaken = new Date(dateText);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    };

    const dateResult = datetaken.toLocaleDateString('en-US', dateOption);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="images/${getWeatherIcon(id)}" class="forecast-item-img" />
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(s => {
        s.style.display = "none";
    });
    section.style.display = 'flex';
}
