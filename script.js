const homeBtn = document.getElementById("homeBtn");
const weatherBtn = document.getElementById("weatherBtn");
const newsBtn = document.getElementById("newsBtn");

const homePage = document.getElementById("homePage");
const weatherPage = document.getElementById("weatherPage");
homeBtn.addEventListener("click", function () {
    homePage.style.display = "block";
    weatherPage.style.display = "none";
});
weatherBtn.addEventListener("click", function () {
    weatherPage.style.display = "block";
    homePage.style.display = "none";
});
const rain = document.querySelector(".rain");

const button = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const loading = document.getElementById("loading");
const unitToggle = document.getElementById("unitToggle");
let isCelsius = true;
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let drops = [];

for (let i = 0; i < 200; i++) {

    drops.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        length: Math.random() * 20 + 10,

        speed: Math.random() * 8 + 6

    });

}

const apiKey = "240bf53b1fe345310a4680b35e2ff764";
const unsplashKey = "Ug71RVsG4RkJClf100jJABGFDp5u84liXJqfCz85AqY";

async function getForecast(city) {

    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(forecastUrl);
    const data = await response.json();

    if (data.cod != "200") {
        return;
    }

    const forecastContainer =
        document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    // Every 8th item = approximately one forecast per day
    for (let i = 0; i < data.list.length; i += 8) {

        const forecast = data.list[i];

        const date = new Date(forecast.dt * 1000);

        const day = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const icon =
            `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${day}</h3>

            <img src="${icon}" alt="Weather">

            <p>${Math.round(forecast.main.temp)}°C</p>

            <p>${forecast.weather[0].main}</p>
        `;

        forecastContainer.appendChild(card);
    }
}

button.addEventListener("click", async function () {

    loading.style.display = "block";

    const city = cityInput.value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    loading.style.display = "none";

    if (data.cod != 200) {
    loading.style.display = "none";    
    alert("City not found!");
    return;
}

    console.log(data);

    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);

    sunrise.innerText = sunriseTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
});

    sunset.innerText = sunsetTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
});

    cityName.innerText = data.name;
    getForecast(city);
    changeBackground(city);
    temperature.dataset.value = data.main.temp;
    temperature.innerText = "Temperature : " + data.main.temp + "°C";
    humidity.innerText = "Humidity : " + data.main.humidity + "%";
    wind.innerText = "Wind Speed : " + data.wind.speed + " km/h";
    condition.innerText = "Condition : " + data.weather[0].main;

    if (data.weather[0].main === "Rain") {
        isRaining = true;
    } else {
        isRaining = false;
    }

    if(data.weather[0].main==="Rain"){

    rain.style.display="block";

}else{

    rain.style.display="none";

}

    if (data.weather[0].main === "Clear") {
    document.body.style.background =
        "linear-gradient(135deg, #56CCF2, #2F80ED)";
}

else if (data.weather[0].main === "Clouds") {
    document.body.style.background =
        "linear-gradient(135deg, #bdc3c7, #2c3e50)";
}

else if (data.weather[0].main === "Rain") {
    document.body.style.background =
        "linear-gradient(135deg, #4B79A1, #283E51)";
}

else if (data.weather[0].main === "Snow") {
    document.body.style.background =
        "linear-gradient(135deg, #E6DADA, #274046)";
}

else {
    document.body.style.background =
        "linear-gradient(135deg, #4facfe, #00f2fe)";
}

    feelsLike.dataset.value = data.main.feels_like;
    feelsLike.innerText = data.main.feels_like + "°C";
    visibility.innerText = (data.visibility / 1000) + " km";

});

async function changeBackground(city) {

    const imageUrl = `https://api.unsplash.com/search/photos?query=${city}&orientation=landscape&client_id=${unsplashKey}`;

    const response = await fetch(imageUrl);

    const data = await response.json();

    if (data.results.length > 0) {

        document.body.style.backgroundImage =
            `url(${data.results[0].urls.regular})`;

        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

    }

}

function drawRain() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;

    for (let drop of drops) {

        ctx.beginPath();

        ctx.moveTo(drop.x, drop.y);

        ctx.lineTo(drop.x, drop.y + drop.length);

        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {

            drop.y = -20;
            drop.x = Math.random() * canvas.width;

        }

    }

    requestAnimationFrame(drawRain);

}

let isRaining = false;
drawRain();
function drawRain() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isRaining) {

        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;

        for (let drop of drops) {

            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;

            if (drop.y > canvas.height) {
                drop.y = -20;
                drop.x = Math.random() * canvas.width;
            }
        }
    }

    requestAnimationFrame(drawRain);
}

unitToggle.addEventListener("click", function () {

    isCelsius = !isCelsius;

    const currentTemp = parseFloat(temperature.dataset.value);
    const currentFeels = parseFloat(feelsLike.dataset.value);

    if (isCelsius) {
        temperature.innerText = "Temperature : " + currentTemp + "°C";
        feelsLike.innerText = currentFeels + "°C";
    } else {
        const fahrenheitTemp = (currentTemp * 9 / 5) + 32;
        const fahrenheitFeels = (currentFeels * 9 / 5) + 32;

        temperature.innerText =
            "Temperature : " + fahrenheitTemp.toFixed(1) + "°F";

        feelsLike.innerText =
            fahrenheitFeels.toFixed(1) + "°F";
    }
});

window.addEventListener("load", function () {
    setTimeout(function () {
        const splash = document.getElementById("splashScreen");

        splash.style.opacity = "0";

        setTimeout(function () {
            splash.style.display = "none";
        }, 600);

    }, 2000);
});
