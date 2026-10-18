import { type GeocodingResponse } from "./types";

export async function searchCity(cityName: string) {
  //คลีนข้อมูล
  const cleanName: string = cityName.trim();
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

