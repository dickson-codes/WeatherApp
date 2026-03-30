// API Key
const apiKey = "994c12bfbe61906b4f5d395ff13c2e27";

// Elements
const cityName = document.querySelector(".m-city-name");
const tempNum = document.querySelector(".m-temp-num");
const tempDesc = document.querySelector(".m-temp-desc");
const tempImg = document.querySelector(".m-temp-img img");

const windElem = document.querySelector(".s-wind");
const humidityElem = document.querySelector(".s-humidity");
const sTempElem = document.querySelector(".s-temp");

const hfGrid = document.querySelector(".hf-grid");

// Overlay elements
const searchBtn = document.getElementById("searchIcon");
const overlay = document.getElementById("searchOverlay");
const overlayInput = document.getElementById("overlay-input");


// 🎨 ICON MAP (YOUR IMAGES)
const iconMap = {
  "01d": "sun.png",
  "01n": "moon.png",

  "02d": "part-sun.png",
  "02n": "part-moon.png",

  "03d": "part-sun.png",
  "03n": "part-moon.png",

  "04d": "cloud.png",
  "04n": "cloud.png",

  "09d": "rain.png",
  "09n": "rain.png",
  "10d": "rain.png",
  "10n": "rain.png",

  "11d": "storm.png",
  "11n": "storm.png",

  "13d": "snow.png",
  "13n": "snow.png",

  "50d": "haze.png",
  "50n": "haze.png"
};

// Function to get custom icon
function getCustomIcon(iconCode) {
  return iconMap[iconCode] || "part-sun.png";
}


// 🌍 MAIN WEATHER FUNCTION
function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      // ❗ Error handling
      if (data.cod !== 200) {
        tempDesc.textContent = "Error: " + data.message;
        return;
      }

      // ✅ Update UI
      cityName.innerHTML = `${data.name}, <span>${data.sys.country}</span>`;
      tempNum.textContent = `${Math.round(data.main.temp)}°C`;
      tempDesc.textContent = data.weather[0].description;

      // 🎨 Custom icon
      const iconCode = data.weather[0].icon;
      tempImg.src = getCustomIcon(iconCode);

      // 🌬️ Wind
      windElem.innerHTML = `<img src="wind.png"> ${data.wind.speed} km/hr`;

      // 💧 Humidity
      humidityElem.innerHTML = `<img src="humidity.png"> ${data.main.humidity}%`;

      // 🌡️ Temp
      sTempElem.innerHTML = `<img src="temp-logo.png"> ${Math.round(data.main.temp)}°C`;

      // 🔥 Hourly forecast
      getHourlyForecast(data.coord.lat, data.coord.lon);
    })
    .catch(err => {
      console.log("Error:", err);
      tempDesc.textContent = "Something went wrong!";
    });
}


// ⏰ HOURLY FORECAST
function getHourlyForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Hourly:", data);

      hfGrid.innerHTML = "";

      data.list.slice(0, 8).forEach(item => {
        const time = new Date(item.dt * 1000);

        let hours = time.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const displayTime = `${hours} ${ampm}`;

        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;

        hfGrid.innerHTML += `
          <div class="hf-elem">
            <div class="hf-temp-img">
              <img src="${getCustomIcon(icon)}">
            </div>
            <div class="hf-time">${displayTime}</div>
            <div class="hf-temp-num">${temp}°C</div>
          </div>
        `;
      });
    })
    .catch(err => console.log("Hourly error:", err));
}


// 🔍 SEARCH OVERLAY

searchBtn.addEventListener("click", () => {
  overlay.classList.add("active");
  overlayInput.focus();
});

overlayInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = overlayInput.value.trim();
    if (city !== "") {
      getWeather(city);
    }
    overlay.classList.remove("active");
    overlayInput.value = "";
  }
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});


// 🚀 DEFAULT LOAD
getWeather("Chennai");