# 🌤️ Weather Explorer

เว็บแอปพลิเคชันพยากรณ์อากาศและแดชบอร์ดสภาพอากาศล่วงหน้า 7 วัน พัฒนาด้วย **Vanilla TypeScript**, **HTML5/CSS3 (Modern Responsive Flexbox & Grid)** และเชื่อมต่อข้อมูลจริงจาก **Open-Meteo API**

---

## 🛠️ โครงสร้างฟังก์ชันและหน้าที่การทำงาน (Core Architecture)

### 1. API Layer (`src/api.ts`)
รับผิดชอบการเชื่อมต่อและดึงข้อมูลจากภายนอก (External Network Requests):

- **`searchCity(cityName: string)`**
  - **หน้าที่:** นำชื่อเมืองที่ผู้ใช้กรอก (เช่น `Bangkok`, `Tokyo`) ไปแปลงเป็นพิกัด ละติจูด/ลองจิจูด ผ่าน Open-Meteo Geocoding API
  - **การทำงานสำคัญ:** ทำความสะอาดข้อมูล (`.trim()`), ดักจับช่องว่าง, เข้ารหัส URL (`encodeURIComponent`), และตรวจสอบข้อผิดพลาดกรณีหาเมืองไม่พบ
  
- **`getForecast(latitude: number, longitude: number)`**
  - **หน้าที่:** นำพิกัดละติจูดและลองจิจูดไปดึงข้อมูลสภาพอากาศแบบสดๆ จาก Open-Meteo Forecast API
  - **ข้อมูลที่ได้:** สภาพอากาศปัจจุบัน (อุณหภูมิ, ความชื้น, ลม, สภาพท้องฟ้า) และข้อมูลพยากรณ์ 7 วันล่วงหน้า

---

### 2. Utils Layer (`src/utils.ts`)
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

### 3. Type System (`src/types.ts`)
กำหนดโครงสร้างข้อมูลที่รัดกุม (Strict Typing) เพื่อความปลอดภัยของระบบ:

- **`Weather`:** โมเดลข้อมูลสภาพอากาศหลักสำหรับแสดงผลใน Hero Card
- **`DailyForecast`:** โครงสร้างข้อมูลพยากรณ์อากาศแต่ละวันใน 7-Day Forecast Grid
- **`WeeklyStats`:** โมเดลผลลัพธ์สถิติประจำสัปดาห์ (`max`, `min`, `avg`)
- **`WeatherInfo`:** โครงสร้างข้อมูลคำบรรยายและไอคอนสภาพอากาศ
- **`AsyncState<T>`:** Discriminated Union สำหรับควบคุมสถานะ UI 4 สเตจ (`idle`, `loading`, `success`, `error`) ป้องกันการแสดงผลซ้อนทับ

