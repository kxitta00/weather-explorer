# 🌤️ Boss Fight ด่านที่ 3: Weather Explorer

เอกสารข้อกำหนดการพัฒนา (Technical Requirements) และ UI Design Mockup ประจำด่านที่ 3
ธีม: **Clean Minimal Modern (ขาว - ฟ้าพาสเทล - แสงเงาละมุน)**


---

## 2. โจทย์และเงื่อนไขทางธุรกิจ (Business Requirements)

### 2.1 ระบบค้นหาเมืองและเชื่อมต่อ Live API
- ผู้ใช้พิมพ์ชื่อเมือง (ภาษาอังกฤษ เช่น `Bangkok`, `Tokyo`, `London`, `Chiang Mai`) ลงในช่องค้นหา แล้วกดค้นหา (Enter หรือคลิกไอคอนแว่นขยาย)
- ยิง Open-Meteo Geocoding API เพื่อแปลงชื่อเมืองเป็นพิกัด ละติจูด/ลองจิจูด
- ยิง Open-Meteo Forecast API เพื่อดึงสภาพอากาศปัจจุบันและพยากรณ์ล่วงหน้า 7 วัน

### 2.2 การจัดการสถานะ UI ด้วย Discriminated Unions (`AsyncState<T>`)
หน้าจอต้องรองรับ 4 สถานะโดยไม่มีการแสดงผลซ้อนทับกัน:
1. **`idle`:** แสดงข้อความต้อนรับ ชวนผู้ใช้พิมพ์ชื่อเมือง
2. **`loading`:** แสดง Loading Spinner หมุนติ้วชัดเจน
3. **`error`:** เมื่อหาชื่อเมืองไม่เจอ หรือเน็ตหลุด ให้ขึ้นกล่องข้อความเตือนสีแดงละมุน พร้อมปุ่ม "ลองใหม่อีกครั้ง"
4. **`success`:** แสดงข้อมูลสภาพอากาศครบทั้ง 3 โซน (Hero Card, สรุปสถิติ, 7-Day Forecast)

### 2.3 การคำนวณสถิติประจำสัปดาห์ด้วย `.reduce()`
นำข้อมูลสภาพอากาศ 7 วันมาคำนวณในแดชบอร์ดสรุปผล:
- **Weekly Max:** อุณหภูมิสูงสุดในสัปดาห์ (ใช้ `.reduce` หาค่า Max)
- **Weekly Min:** อุณหภูมิต่ำสุดในสัปดาห์ (ใช้ `.reduce` หาค่า Min)
- **Weekly Average:** อุณหภูมิเฉลี่ย 7 วัน (ใช้ `.reduce` รวมผลแล้วหารจำนวนวัน)

### 2.4 ระบบบันทึกเมืองโปรด (Favorite Cities) ด้วย Safe LocalStorage
- บนการ์ดปัจจุบันมีปุ่ม **"+ Add to Favorites"**
- เมื่อกด จะบันทึกชื่อเมืองลงใน `localStorage` ผ่าน `saveStorage`
- แถบด้านบนแสดงรายชื่อเมืองโปรดเป็น Chips (เช่น `Singapore`, `Tokyo`, `Paris`)
- ผู้ใช้สามารถคลิกที่ปุ่มชื่อเมืองเพื่อสลับดูสภาพอากาศของเมืองนั้นได้ทันทีโดยไม่ต้องพิมพ์ใหม่
- เมื่อรีเฟรชหน้าเว็บ (F5) รายชื่อเมืองโปรดยังคงอยู่ครบ

---

## 3. ถอดรหัสกล่อง UI (Box Hierarchy: Skeleton)

แบ่งหน้าจอออกเป็น **4 เลเยอร์ตามแนวดิ่ง (Vertical Slicing)**:

### เลเยอร์ที่ 1: Top Navigation Bar (`.top-nav`)
- **ฝั่งซ้าย:** โลโก้ + ชื่อแอป (`Weather Explorer`)
- **ตรงกลาง:** กล่องค้นหา (`.search-box`: `<input>` + `<button>`)
- **ฝั่งขวา:** แถบเมืองโปรด (`.favorite-chips`: รายการปุ่มเมืองที่เคยบันทึกไว้)

### เลเยอร์ที่ 2: Hero Current Weather Card (`.current-weather-card`)
- ชื่อเมืองและประเทศ (`Bangkok, Thailand`)
- วันที่ปัจจุบัน
- อุณหภูมิปัจจุบันตัวใหญ่เด่น (`31°C`) พร้อมคำบรรยายสภาพอากาศ (`Partly Cloudy`)
- ตารางย่อยข้อมูลสภาพอากาศ:
  - ความชื้น (Humidity)
  - ความเร็วลม (Wind Speed)
- ปุ่มเพิ่มลงในรายการโปรด (`<button id="favorite-btn">+ Add to Favorites</button>`)

### เลเยอร์ที่ 3: Weekly Statistics Summary Bar (`.stats-summary-bar`)
- กล่องแคปซูลแนวนอน รวมสถิติ 3 ช่องที่คำนวณสดด้วย `.reduce()`:
  - **Weekly Max** (`34°C`)
  - **Weekly Min** (`26°C`)
  - **Weekly Average** (`29.5°C`)

### เลเยอร์ที่ 4: 7-Day Forecast Grid (`.forecast-grid`)
- จัดวางด้วย CSS Grid: `display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;`
- การ์ดแต่ละใบ (`.forecast-card`):
  - ชื่อวัน (`Mon`, `Tue`, ...)
  - ไอคอนสภาพอากาศ (แดด, เมฆ, ฝน)
  - อุณหภูมิสูงสุด / ต่ำสุด (`32°C / 27°C`)
  - คำบรรยายสภาพอากาศย่อ (`Sunny`, `Rainy`)

---

## 4. แผนที่ Semantic HTML & ID สำหรับ TypeScript

| ชิ้นส่วน | HTML Tag | Class (แต่ง CSS) | ID (TypeScript จับทำ Logic) |
| :--- | :--- | :--- | :--- |
| ฟอร์มค้นหา | `<form>` | `.search-form` | `#search-form` |
| ช่องพิมพ์ชื่อเมือง | `<input>` | `.search-input` | `#search-input` |
| ปุ่มกดค้นหา | `<button>` | `.search-btn` | `#search-btn` |
| กล่องแสดงสถานะ (Loading/Error) | `<div>` | `.status-container` | `#status-container` |
| กล่องสภาพอากาศปัจจุบัน | `<section>` | `.hero-card` | `#hero-weather` |
| ปุ่มกดเซฟเมืองโปรด | `<button>` | `.fav-btn` | `#fav-toggle-btn` |
| แถบเมืองโปรดด้านบน | `<div>` | `.fav-chips-container` | `#favorite-chips` |
| แถบสถิติสัปดาห์ | `<section>` | `.stats-bar` | `#stats-summary` |
| คอนเทนเนอร์ 7 วัน | `<section>` | `.forecast-grid` | `#forecast-grid` |
