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
  icon: string;
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


//type Report getWeatherInfo
export type WeatherInfo = {
  description: string,
  icon: string,
}

//type Report calculateWeeklyStats
export type WeeklyStats = {
  max: number;
  min: number;
  avg: number;
}

//type สำหรับ ForecastResponse
export type ForecastResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
  };
}