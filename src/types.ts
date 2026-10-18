//พยากรณ์ 7 วัน
export type DailyForecast = {
  day: string;
  weatherCode: number;
  max: number;
  min: number;
}

//กลุ่มข้อมูลหลัก hero
export type Weather = {
  cityName: string;
  temperature: number;
  description: string;
  humidity: number; //ความชื้น
  windSpeed: number; //ความเร็วลม
  feelsLike: number; //อุณหภูมิที่รู้สึกเหมือน
  uvIndex: number; //ดัชนี UV
  forecast: DailyForecast[];
}

//type สำหรับหน้า loading
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }

//type respon จาก api
export type GeocodingResponse = {
  results?: {
    name: string,
    latitude: number,
    longitude: number,
    country: string,
  }[]
}