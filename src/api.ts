import { type GeocodingResponse } from "./types";
import { toEnglishCity } from "./provinces";

/**นำชื่อเมืองที่ user ค้นหายิงไปหา latitude และ longitude เพื่อนำไปหาสภาพอากาศต่อ
 * */
export async function searchCity(cityName: string) {
  //คลีนข้อมูล
  const cleanName: string = toEnglishCity(cityName);
  if (cleanName === "") {
    throw new Error("กรุณากรอกชื่อเมือง");
  }

  //ยิง api
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`);
  if (!res.ok) {
    throw new Error(`โหลดไม่สำเร็จ สถานะ: ${res.status}`);
  }
  const data: GeocodingResponse = await res.json();
  if (!data.results || data.results?.length === 0) {
    throw new Error("ไม่พบข้อมูลเมืองที่ค้นหา")
  }

  //ดึงค่าจาก data แล้วส่งออก
  const city = data.results[0];
  return ({
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
  })
}

/**นำ latitude และ longitude ยิงไปหา สภาพอากาศ
 * */
export async function getForecast(latitude: number, longitude: number) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`)
  if (!res.ok) {
    throw new Error(`โหลดไม่สำเร็จ สถานะ: ${res.status}`)
  }
  const data = await res.json()
  return data
}