```text
📂 src/main.ts
├── โซนที่ 1: การจับ DOM Elements & ตัวแปร State กลาง
│   └── เตรียมตัวแปรกล่องหลัก และ state = { status: "idle" }
│
├── โซนที่ 2: ฟังก์ชันควบคุมหน้าจอ (UI & Render Engine)
│   ├── 2.1 render() ──► สวิตช์สลับ 4 หน้าจอ (idle, loading, error, success)
│   ├── 2.2 renderWeather(data) ──► หยอดข้อมูลสดลง Hero, Stats, Grid 7 วัน
│   ├── 2.3 updateFavButton(cityName) ──► สลับสี/ข้อความปุ่มเพิ่ม-ลบรายการโปรด
│   └── 2.4 renderChips(activeCity) ──► ปั๊มปุ่มชิปเมืองโปรดพร้อมไฮไลท์สีฟ้า
│
├── โซนที่ 3: ท่อส่งน้ำหลัก (Data Pipeline: loadWeather)
│   └── สั่ง Loading ➔ ยิง API ➔ ปั้นก้อน Weather ➔ อัปเดต Success ➔ สั่ง Render
│
├── โซนที่ 4: Event Listeners (ดักฟังการกระทำของผู้ใช้)
│   ├── 4.1 ค้นหาเมืองเมื่อกด Submit ในฟอร์ม
│   ├── 4.2 สลับเมืองเมื่อคลิกปุ่มชิป (Event Delegation)
│   └── 4.3 เพิ่ม/ลบเมืองโปรดเมื่อคลิกปุ่มบน Hero Card
│
└── โซนที่ 5: เริ่มต้นการทำงานของแอป (App Bootstrap)
    └── renderChips() และ loadWeather("Bangkok") ทำงานทันทีตอนเปิดเว็บ```