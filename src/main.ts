import './style.css'

import { searchCity, getForecast } from "./api";
import { calculateWeeklyStats, formatDayName, getWeatherInfo } from "./utils";
import { getFavorites, saveFavorite } from "./storage";
import { type Weather, type AsyncState, type ForecastResponse } from "./types";

// ==========================================
// โซนที่ 1: การจับ DOM Elements & ตัวแปร State กลาง
// ==========================================
const heroIconEl = document.querySelector('.weather-hero-icon') as HTMLElement;
const statusEl = document.getElementById('status-container') as HTMLElement;

const heroWeatherEl = document.getElementById('hero-weather') as HTMLElement;
const statsSummaryEl = document.getElementById('stats-summary') as HTMLElement;
const forecastGridEl = document.getElementById('forecast-grid') as HTMLElement;
const forecastTitleEl = document.querySelector('.forecast-title') as HTMLElement;

const searchFormEl = document.getElementById('search-form') as HTMLFormElement;
const searchInputEl = document.getElementById('search-input') as HTMLInputElement;

const favoriteChipsEl = document.getElementById('favorite-chips') as HTMLElement;
const favToggleBtn = document.getElementById('fav-toggle-btn') as HTMLButtonElement;

let state: AsyncState<Weather> = { status: "idle" };

// ==========================================
// โซนที่ 2: ฟังก์ชันควบคุมหน้าจอ (UI & Render Engine)
// ==========================================

// 2.1 สลับหน้าจอ 4 สถานะ (idle, loading, error, success)
function render(): void {
  switch (state.status) {
    case "idle":
      heroWeatherEl.style.display = "none";
      statsSummaryEl.style.display = "none";
      forecastGridEl.style.display = "none";
      forecastTitleEl.style.display = "none";
      statusEl.style.display = "block";
      statusEl.innerHTML = `<p class="status-msg" > พิมพ์ชื่อเมืองในช่องค้นหาด้านบนเพื่อดูสภาพอากาศ </p>`
      break;
    case "loading":
      heroWeatherEl.style.display = "none";
      statsSummaryEl.style.display = "none";
      forecastGridEl.style.display = "none";
      forecastTitleEl.style.display = "none";
      statusEl.style.display = "block";
      statusEl.innerHTML = `<div class="status-msg">
      <i class="fa-solid fa-circle-notch fa-spin status-icon loading-icon"></i>
      <p class="status-text">กำลังโหลดข้อมูลสภาพอากาศ...</p>
    </div>`
      break;
    case "error":
      heroWeatherEl.style.display = "none";
      statsSummaryEl.style.display = "none";
      forecastGridEl.style.display = "none";
      forecastTitleEl.style.display = "none";
      statusEl.style.display = "block";
      statusEl.innerHTML = `<p class="status-msg" >${state.message}</p>`
      break;
    case "success":
      statusEl.style.display = "none";
      heroWeatherEl.style.display = "";
      statsSummaryEl.style.display = "";
      forecastGridEl.style.display = "";
      forecastTitleEl.style.display = "";
      renderWeather(state.data)
      break;
  }
}

// 2.2 หยอดข้อมูลสภาพอากาศสดลงหน้าจอ 3 โซน (Hero Card, สรุปสถิติ, การ์ด 7 วัน)
function renderWeather(data: Weather): void {
  //hero
  const cityNameEl = document.getElementById('city-name') as HTMLElement;
  const currTempEl = document.getElementById('current-temp') as HTMLElement;
  const weatherDesEl = document.getElementById('weather-condition') as HTMLElement;
  const humidityEl = document.getElementById('humidity-val') as HTMLElement;
  const windEl = document.getElementById('wind-val') as HTMLElement;
  const feelsEl = document.getElementById('feels-like-val') as HTMLElement;
  const uvEl = document.getElementById('uv-val') as HTMLElement;
  const dateEl = document.getElementById('current-date') as HTMLElement;

  cityNameEl.textContent = data.cityName;
  currTempEl.textContent = `${Math.round(data.temperature)}`;
  weatherDesEl.textContent = data.description;
  humidityEl.textContent = `${data.humidity}%`;
  windEl.textContent = `${data.windSpeed} km/h`;
  feelsEl.textContent = `${Math.round(data.feelsLike)}°`
  uvEl.textContent = `${data.uvIndex}`
  dateEl.textContent = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });

  //weekly stats
  const maxTemps = data.forecast.map(item => item.max);
  const minTemps = data.forecast.map(item => item.min);
  const temps = calculateWeeklyStats(maxTemps, minTemps);

  document.getElementById('weekly-max')!.textContent = `${temps.max}°C`;
  document.getElementById('weekly-min')!.textContent = `${temps.min}°C`;
  document.getElementById('weekly-avg')!.textContent = `${temps.avg}°C`;

  //forecastGridEl
  forecastGridEl.innerHTML = data.forecast.map((f, index) => {
    const icon = getWeatherInfo(f.weatherCode).icon;
    const activeClass = index === 0 ? "active" : "";

    return `
     <div class="forecast-card ${activeClass}">
      <div class="forecast-header">
        <span class="forecast-day">${f.day}</span>
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="forecast-temps">
        <span class="temp-max">${Math.round(f.max)}°</span>
        <span class="temp-min">${Math.round(f.min)}°</span>
      </div>
    </div>
    `;
  }).join("");

  //hero icon
  heroIconEl.className = `fa-solid ${data.icon} weather-hero-icon`;
  upadateFavButton(data.cityName)
  renderChips(data.cityName);
}

// 2.3 สลับสีและข้อความปุ่มเพิ่ม/ลบรายการโปรด
function upadateFavButton(cityName: string): void {
  const isFav = getFavorites().includes(cityName);

  if (isFav) {
    favToggleBtn.classList.add("active");
    favToggleBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>บันทึกแล้ว</span>`;
  } else {
    favToggleBtn.classList.remove("active");
    favToggleBtn.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>เพิ่มในรายการโปรด</span>`;
  }
}

// 2.4 ปั๊มปุ่มชิปเมืองโปรดพร้อมไฮไลท์สีฟ้าตามเมืองที่กำลังเปิดดูอยู่
function renderChips(activeCity?: string): void {
  const cityNames = getFavorites();
  favoriteChipsEl.innerHTML = cityNames.map(name => {
    const isActive = activeCity && name.toLocaleLowerCase() === activeCity.toLocaleLowerCase()
    return `
    <button type="button" class="chip ${isActive ? 'active' : ''}">${name}</button>
    `;
  }).join("");

}

// ==========================================
// โซนที่ 3: ท่อส่งน้ำหลัก (Data Pipeline: loadWeather)
// Flow: สั่ง Loading ➔ ยิง API ➔ ปั้นก้อน Weather ➔ อัปเดต State Success ➔ สั่ง Render
// ==========================================
async function loadWeather(cityName: string): Promise<void> {
  state = { status: "loading" };
  render();

  try {
    const city = await searchCity(cityName);
    const forecastData: ForecastResponse = await getForecast(city.latitude, city.longitude);
    const weather: Weather = ({
      cityName: city.name,
      temperature: forecastData.current.temperature_2m,
      description: getWeatherInfo(forecastData.current.weather_code).description,
      icon: getWeatherInfo(forecastData.current.weather_code).icon,
      humidity: forecastData.current.relative_humidity_2m,
      windSpeed: forecastData.current.wind_speed_10m,
      feelsLike: forecastData.current.apparent_temperature,
      uvIndex: forecastData.daily.uv_index_max[0],
      forecast: forecastData.daily.time.map((timeStr, index) => ({
        day: formatDayName(timeStr, index),
        weatherCode: forecastData.daily.weather_code[index],
        max: forecastData.daily.temperature_2m_max[index],
        min: forecastData.daily.temperature_2m_min[index],
      }))
    })
    state = { status: "success", data: weather };
    render();
  } catch (error) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    state = { status: "error", message };
    render()
  }
}

// ==========================================
// โซนที่ 4: Event Listeners (ดักฟังการกระทำของผู้ใช้)
// ==========================================

// 4.1 ค้นหาเมืองเมื่อผู้ใช้กด Submit ในฟอร์ม
searchFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInputEl.value.trim();
  if (query) {
    loadWeather(query);
    searchInputEl.value = "";
  }
});

// 4.2 สลับเมืองเมื่อผู้ใช้คลิกที่ปุ่มชิป (Event Delegation)
favoriteChipsEl.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("chip")) {
    const cityName = target.textContent?.trim();
    if (cityName) {
      loadWeather(cityName);
    }
  }
});

// 4.3 เพิ่ม/ลบเมืองโปรดเมื่อคลิกปุ่มบน Hero Card
favToggleBtn.addEventListener("click", () => {
  if (state.status === "success") {
    saveFavorite(state.data.cityName);
    upadateFavButton(state.data.cityName);
    renderChips(state.data.cityName);
  }
});

// ==========================================
// โซนที่ 5: เริ่มต้นการทำงานของแอป (App Bootstrap)
// ==========================================
renderChips();
loadWeather("Bangkok");