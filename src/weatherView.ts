import { type Weather } from "./types";
import { calculateWeeklyStats, getWeatherInfo } from "./utils";
import { getHumidityDesc, getWindDesc, getFeelsLikeDesc, getUvDesc } from "./utils";
const forecastGridEl = document.getElementById('forecast-grid') as HTMLElement;
const heroIconEl = document.querySelector('.weather-hero-icon') as HTMLElement;

/**
 * นำข้อมูลสภาพอากาศที่ปั้นและคลีนเสร็จแล้ว (type Weather) มาวาดขึ้นจอ
 * จัดการครบทั้ง 3 ส่วน: Hero Card, สรุปสถิติประจำสัปดาห์, และการ์ดพยากรณ์ 7 วัน
 */
export function renderWeather(data: Weather): void {
  //ดึง  El มาเก็บไว้รอใช้ สำหรับสถานะ 4 สถานะในการ์ด Hero
  const humidityDescEl = document.getElementById('humidity-desc') as HTMLElement;
  const windDescEl = document.getElementById('wind-desc') as HTMLElement;
  const feelsLikeDescEl = document.getElementById('feels-like-desc') as HTMLElement;
  const uvDescEl = document.getElementById('uv-desc') as HTMLElement;


  // 1. ส่วน Hero: ดึง Element ที่จำเป็นมาเก็บไว้ในตัวแปร และสั่งวาดข้อมูลสภาพอากาศปัจจุบันขึ้นจอ
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

  // สั่งวาด 4 สถานะในการ์ด hero
  humidityDescEl.textContent = getHumidityDesc(data.humidity);
  windDescEl.textContent = getWindDesc(data.windSpeed);
  feelsLikeDescEl.textContent = getFeelsLikeDesc(data.feelsLike);
  uvDescEl.textContent = getUvDesc(data.uvIndex);

  // 2. ส่วน Weekly Stats: ใช้ map ดึงอุณหภูมิ แล้วส่งให้ calculateWeeklyStats หาค่ามากสุด น้อยสุด และเฉลี่ย มาแปะลงจอ
  const maxTemps = data.forecast.map(item => item.max);
  const minTemps = data.forecast.map(item => item.min);
  const temps = calculateWeeklyStats(maxTemps, minTemps);

  document.getElementById('weekly-max')!.textContent = `${temps.max}°C`;
  document.getElementById('weekly-min')!.textContent = `${temps.min}°C`;
  document.getElementById('weekly-avg')!.textContent = `${temps.avg}°C`;

  // 3. ส่วน Forecast Grid: วาดการ์ด 7 วันด้วย map ดึงไอคอนจาก getWeatherInfo และแปะ active ให้อันแรก
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

  // 4. สั่งเปลี่ยนคลาสไอคอนตัวใหญ่บน Hero Card ตามสภาพอากาศสด
  heroIconEl.className = `fa-solid ${data.icon} weather-hero-icon`;

}
