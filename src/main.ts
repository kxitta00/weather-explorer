import './style.css'

import { searchCity, getForecast } from "./api";
import { formatDayName, getWeatherInfo } from "./utils";
import { saveFavorite } from "./storage";
import { type Weather, type AsyncState, type ForecastResponse } from "./types";

//ฟังก์ชัน renderWeather
import { renderWeather } from "./weatherView";
//ฟังก์ชันในส่วน Fav
import { renderChips, upadateFavButton } from "./favoritesView";
//ฟังก์ชันหาชื่อเมืองภาษาอังกฤษ
import { toEnglishCity } from './provinces';

// โซนที่ 1: การจับ DOM Elements & ตัวแปร State กลาง
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


/**
 * ฟังก์ชันคุมหน้าจอตาม state กลาง (idle, loading, error, success)
 * - idle: ซ่อนการ์ด โชว์ข้อความให้ผู้ใช้ค้นหา
 * - loading: ซ่อนการ์ด โชว์ตัวหมุนเพื่อรอข้อมูล
 * - error: ซ่อนการ์ด โชว์ข้อความแจ้งเตือนสีแดง
 * - success: ปิด loading เปิดการ์ด แล้วสั่ง weatherView และ favoritesView วาดจอ
 */
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
      upadateFavButton(state.data.cityName)
      renderChips(state.data.cityName)
      break;
  }
}


/**
 * ท่อดึงข้อมูลสภาพอากาศ (Data Pipeline)
 * 1. สับสวิตช์ state = loading สั่ง render() ขึ้นตัวหมุน
 * 2. เข้าบล็อก try: ส่งชื่อเมืองไปแปลง toEnglishCity  ส่งต่อ searchCity หาพิกัด -> ส่งพิกัดให้ getForecast ขอข้อมูลดิบ
 * 3. ปั้นข้อมูลดิบให้อยู่ในโครงสร้าง type Weather ที่คลีนเรียบร้อย
 * 4. สับสวิตช์ state = success แนบ data แล้วสั่ง render() วาดข้อมูลขึ้นจอ
 * 5. กรณีพัง (catch): ดึงข้อความ error สับสวิตช์ state = error สั่ง render() แจ้งเตือนผู้ใช้
 */
async function loadWeather(cityName: string): Promise<void> {
  state = { status: "loading" };
  render();

  try {
    const englishName = toEnglishCity(cityName);
    const city = await searchCity(englishName);
    const forecastData: ForecastResponse = await getForecast(city.latitude, city.longitude);
    const weather: Weather = ({
      cityName: city.name,
      temperature: forecastData.current.temperature_2m,
      description: getWeatherInfo(forecastData.current.weather_code, forecastData.current.is_day).description,
      icon: getWeatherInfo(forecastData.current.weather_code, forecastData.current.is_day).icon,
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


// โซนที่ 4: Event Listeners (ดักฟังการกระทำของผู้ใช้)
// ดักการ Submit ฟอร์ม: ดูดข้อความชื่อเมือง ส่งต่อให้ loadWeather และล้างช่องค้นหา
searchFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInputEl.value.trim();
  if (query) {
    loadWeather(query);
    searchInputEl.value = "";
  }
});

// สลับดูสภาพอากาศเมื่อผู้ใช้คลิกที่ปุ่มชิปเมืองโปรด (Event Delegation)
favoriteChipsEl.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("chip")) {
    const cityName = target.textContent?.trim();
    if (cityName) {
      loadWeather(cityName);
    }
  }
});

// สลับสถานะเพิ่ม/ลบเมืองโปรดลง LocalStorage พร้อมอัปเดตปุ่มและชิปทันที
favToggleBtn.addEventListener("click", () => {
  if (state.status === "success") {
    saveFavorite(state.data.cityName);
    upadateFavButton(state.data.cityName);
    renderChips(state.data.cityName);
  }
});


// โซนที่ 5: เริ่มต้นการทำงานของแอป (App Bootstrap)
// สั่งโหลดหน้าเว็บครั้งแรกด้วยสภาพอากาศของกรุงเทพฯ และปั๊มปุ่มชิปเมืองโปรด
renderChips();
loadWeather("Bangkok");

