import { type WeatherInfo, type WeeklyStats } from "./types";

/**
 * นำ code มาแปลงเป็นคำบรรยายสภาพอากาศและไอคอน FontAwesome สำหรับแสดงบน UI
 */
export function getWeatherInfo(code: number, is_day: number = 1): WeatherInfo {
  switch (code) {
    case 0:
      if (is_day === 0) {
        return {
          description: "ท้องฟ้าแจ่มใส / ฟ้าโปร่ง (กลางคืน)",
          icon: "fa-moon"
        };
      }
      return ({
        description: "ท้องฟ้าแจ่มใส / แดดจ้า",
        icon: "fa-sun"
      })
    case 1:
    case 2:
    case 3:
      if (is_day === 0) {
        return {
          description: "มีเมฆบางส่วน (กลางคืน)",
          icon: "fa-cloud-moon"
        };
      }
      return ({
        description: "มีเมฆบางส่วน / เมฆเป็นส่วนมาก",
        icon: "fa-cloud-sun"
      })
    case 45:
    case 48:
      if (is_day === 0) {
        return {
          description: "มีหมอก / หมอกหนา (กลางคืน)",
          icon: "fa-smog"
        };
      }
      return ({
        description: "มีหมอก / หมอกหนา",
        icon: "fa-smog"
      })
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 80:
    case 81:
    case 82:
      if (is_day === 0) {
        return {
          description: "ฝนตก / ฝนฟ้าคะนอง (กลางคืน)",
          icon: "fa-cloud-moon-rain"
        };
      }
      return ({
        description: "ฝนตก / ฝนฟ้าคะนอง",
        icon: "fa-cloud-rain"
      })
    case 95:
    case 96:
    case 99:
      if (is_day === 0) {
        return {
          description: "พายุฝนฟ้าคะนอง (กลางคืน)",
          icon: "fa-cloud-bolt"
        };
      }
      return ({
        description: "พายุฝนฟ้าคะนอง",
        icon: "fa-cloud-bolt"
      })
    default:
      return ({
        description: "สภาพอากาศทั่วไป",
        icon: "fa-cloud"
      })
  }
}

/**
 *หาค่าสูงสุดต่ำสุดและค่าเฉลี่ยจาก temp ที่ได้มาจาก api โดยใช้ reduce
 */
export function calculateWeeklyStats(maxTemps: number[], minTemps: number[]): WeeklyStats {
  const max = maxTemps.reduce((acc, curr) => {
    return curr > acc ? curr : acc;
  })
  const min = minTemps.reduce((acc, curr) => {
    return curr < acc ? curr : acc;
  })

  const totalMax = maxTemps.reduce((acc, curr) => { return acc + curr }, 0)
  const totalMin = minTemps.reduce((acc, curr) => { return acc + curr }, 0)
  let avg = (totalMax + totalMin) / (maxTemps.length + minTemps.length);
  avg = Number(avg.toFixed(1));
  return ({
    max: Math.round(max),
    min: Math.round(min),
    avg: avg
  })
}

/** แปลงวันที่รวมที่ได้จาก api มาเป็นวัน
 */
export function formatDayName(dateStr: string, index: number): string {
  if (index === 0) {
    return "วันนี้"
  }

  const date = new Date(dateStr);
  const Days: string[] = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  return Days[date.getDay()];

}

/** แปลงความชื้นที่ได้จาก api มาเป็นสถานะ*/
export function getHumidityDesc(humidity: number): string {
  if (humidity > 70) {
    return "ค่อนข้างชื้น";
  } else if (humidity >= 40) {
    return "กำลังสบาย";
  } else {
    return "อากาศแห้ง";
  }
}

/** แปลงแรงลมที่ได้จาก api มาเป็นสถานะ*/
export function getWindDesc(speed: number): string {
  if (speed > 25) {
    return "ลมแรง";
  } else if (speed >= 10) {
    return "ลมเบา-ปานกลาง";
  } else {
    return "ลมสงบ";
  }
}

/** แปลงความรู้สึกจากสภาพอากาศที่ได้จาก api มาเป็นสถานะ*/
export function getFeelsLikeDesc(temp: number): string {
  if (temp > 38) {
    return "ร้อนจัด / อันตราย";
  } else if (temp >= 33) {
    return "ร้อนอบอ้าว";
  } else if (temp >= 20) {
    return "สบายตัว";
  } else {
    return "อากาศเย็น";
  }
}

/** แปลงUvที่ได้จาก api มาเป็นสถานะ*/
export function getUvDesc(uv: number): string {
  if (uv > 10) {
    return "อันตรายสุดขีด";
  } else if (uv >= 8) {
    return "สูงมาก";
  } else if (uv >= 6) {
    return "สูง";
  } else if (uv >= 3) {
    return "ปานกลาง";
  } else {
    return "ต่ำ (ปลอดภัย)";
  }
}