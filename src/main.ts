import { searchCity, getForecast } from "./api";
import { calculateWeeklyStats, formatDayName } from "./utils";
import './style.css'

const data = await getForecast(13.75, 100.5);
console.log(calculateWeeklyStats(data.daily.temperature_2m_max, data.daily.temperature_2m_min))
console.log(formatDayName(data.daily.time[1], 1));
