# สถาปัตยกรรมระบบ (Architecture Overview)

เอกสารอธิบายโครงสร้างและการแบ่งหน้าที่ของแต่ละโมดูลในโปรเจกต์ Weather Explorer ตามหลักการ Separation of Concerns

---

## 1. API Layer (`src/api.ts`)
รับผิดชอบการเชื่อมต่อและดึงข้อมูลจากภายนอก (External Network Requests):

- **`searchCity(cityName: string)`**
  - **หน้าที่:** นำชื่อเมืองที่ผู้ใช้กรอก (เช่น `Bangkok`, `Tokyo`, `Nakhon Ratchasima`) ไปแปลงเป็นพิกัด ละติจูด/ลองจิจูด ผ่าน Open-Meteo Geocoding API
  - **การทำงานสำคัญ:** ทำความสะอาดข้อมูล (`.trim()`), ดักจับช่องว่าง, เข้ารหัส URL (`encodeURIComponent`), และตรวจสอบข้อผิดพลาดกรณีหาเมืองไม่พบ
  
- **`getForecast(latitude: number, longitude: number)`**
  - **หน้าที่:** นำพิกัดละติจูดและลองจิจูดไปดึงข้อมูลสภาพอากาศแบบสดๆ จาก Open-Meteo Forecast API
  - **ข้อมูลที่ได้:** สภาพอากาศปัจจุบัน (อุณหภูมิ, ความชื้น, ลม, สภาพท้องฟ้า) และข้อมูลพยากรณ์ 7 วันล่วงหน้า

---

## 2. Utils Layer (`src/utils.ts`)
รับผิดชอบ Pure Logic ในการแปลงข้อมูลและการคำนวณทางสถิติ:

- **`getWeatherInfo(code: number): WeatherInfo`**
  - **หน้าที่:** นำรหัสสภาพอากาศมาตรฐานสากล (WMO Weather Code) มาจับคู่เป็นคำอธิบายภาษาไทยและชื่อคลาสไอคอน (FontAwesome)
  - **ตัวอย่าง:** รหัส `0` คืนค่า `"ท้องฟ้าแจ่มใส / แดดจ้า"` และ `"fa-sun"`

- **`calculateWeeklyStats(maxTemps: number[], minTemps: number[]): WeeklyStats`**
  - **หน้าที่:** คำนวณสรุปสถิติสภาพอากาศรอบ 7 วัน เพื่อนำไปแสดงในแถบ Summary Bar
  - **การทำงานสำคัญ:** ใช้ `.reduce()` ในการหาค่าสูงสุด (Max), ค่าต่ำสุด (Min) และอุณหภูมิเฉลี่ย (Average) พร้อมปัดเศษทศนิยมอย่างแม่นยำ

- **`formatDayName(dateStr: string, index: number): string`**
  - **หน้าที่:** แปลงสตริงวันที่จาก API (เช่น `"2026-10-18"`) ให้เป็นชื่อวันที่เป็นมิตรต่อผู้ใช้งาน
  - **การทำงานสำคัญ:**
    - ถ้าเป็นวันแรกสุด (`index === 0`) จะคืนค่าคำว่า `"วันนี้"` เพื่อเสริม UX ที่ดี
    - วันถัดๆ ไป จะใช้ `new Date()` และ `.getDay()` เพื่อแปลงเป็นชื่อวันย่อภาษาไทย (`"อา."`, `"จ."`, `"อ."`, ...)

---

## 3. Safe LocalStorage Layer (`src/storage.ts`)
รับผิดชอบการจัดเก็บข้อมูลถาวรใน Browser อย่างปลอดภัย (Production-Ready Storage):

- **`getFavorites(): string[]`**
  - **หน้าที่:** ดึงรายการเมืองโปรดออกมาเป็น Array
  - **การทำงานสำคัญ:** ครอบด้วย `try...catch` เพื่อป้องกันแอปแครชกรณีติดสิทธิ์ Incognito/Private Browsing และมี Fallback เป็น `DEFAULT_CITIES` อัตโนมัติเมื่อยังไม่มีข้อมูล
  
- **`saveFavorite(cityName: string): void`**
  - **หน้าที่:** ระบบ **Toggle Favorite** สลับสถานะเพิ่ม/ลบเมืองโปรด
  - **การทำงานสำคัญ:**
    - **กรณีมีเมืองนี้อยู่แล้ว:** ทำการลบออกจากรายการด้วย `.filter()`
    - **กรณีเป็นเมืองใหม่:** ตรวจสอบโควตาความจุ หากเกิน 4 เมือง (`favorites.length >= 4`) จะแจ้งเตือนผู้ใช้ด้วย `alert()` และไม่บันทึกซ้ำ หากไม่เกินจะเพิ่มด้วย `.push()`

---

## 4. Controller & UI Engine (`src/main.ts`)
รับผิดชอบการร้อยเรียง Business Logic, State Machine และการตอบสนองต่อผู้ใช้งาน (DOM Events):

- **`state: AsyncState<Weather>`**
  - ควบคุมสถานะหน้าจอด้วย Discriminated Unions 4 สถานะ (`idle`, `loading`, `error`, `success`) ป้องกันปัญหาหน้าจอและเนื้อหาซ้อนทับกัน
- **`render(): void`**
  - ฟังก์ชันคุมม่านเวที สั่งเปิด/ซ่อนกล่องสถานะ (`#status-container`) และโซนสภาพอากาศตาม `state.status`
- **`renderWeather(data: Weather): void`**
  - หยอดข้อมูลสภาพอากาศสด 3 โซน: Hero Card (พร้อมวันที่ภาษาไทยอัตโนมัติ), แถบสถิติประจำสัปดาห์, และการ์ดพยากรณ์ 7 วัน
- **`renderChips(activeCity?: string): void`**
  - สร้างปุ่มชิปเมืองโปรดแบบไดนามิกด้วย `.map()` และ `.join("")` พร้อมคำนวณไฮไลท์สีฟ้า (`.active`) ให้ตรงกับเมืองที่กำลังเปิดดูอยู่
- **`updateFavButton(cityName: string): void`**
  - สลับข้อความและสีของปุ่มบน Hero Card ระหว่าง `"เพิ่มในรายการโปรด"` กับ `"บันทึกแล้ว"` ตามสถานะข้อมูลจริง
- **`loadWeather(cityName: string): Promise<void>`**
  - ท่อส่งน้ำหลัก (Data Pipeline): สั่ง Loading -> ค้นหาพิกัด -> ดึงสภาพอากาศ -> ปั้นก้อน `Weather` -> อัปเดต State Success -> สั่ง Render
- **Event Listeners:**
  - Form Submit พร้อม `e.preventDefault()`
  - Event Delegation สำหรับการคลิกปุ่มชิปเมืองโปรด
  - ปุ่ม Toggle Favorite บน Hero Card
  - Bootstrap โหลดสภาพอากาศเมืองเริ่มต้น (`Bangkok`) ทันทีที่เปิดเว็บ

---

## 5. Type System (`src/types.ts`)
กำหนดโครงสร้างข้อมูลที่รัดกุม (Strict Typing) เพื่อความปลอดภัยและเปิดใช้งาน Autocomplete:

- **`ForecastResponse`:** โครงสร้างข้อมูลที่ตอบกลับมาจาก Open-Meteo Forecast API
- **`GeocodingResponse`:** โครงสร้างข้อมูลพิกัดเมืองจาก Open-Meteo Geocoding API
- **`Weather`:** โมเดลข้อมูลสภาพอากาศหลักสำหรับใช้งานในแอป
- **`DailyForecast`:** โครงสร้างข้อมูลพยากรณ์อากาศแต่ละวันใน 7-Day Grid
- **`WeeklyStats`:** โมเดลผลลัพธ์สถิติประจำสัปดาห์ (`max`, `min`, `avg`)
- **`WeatherInfo`:** โครงสร้างคำบรรยายและชื่อไอคอน FontAwesome
- **`AsyncState<T>`:** Discriminated Union สำหรับควบคุมสถานะ UI 4 สเตจ

