# Weather Explorer

เว็บแอปพลิเคชันพยากรณ์อากาศและแดชบอร์ดสภาพอากาศล่วงหน้า 7 วัน พัฒนาด้วย **Vanilla TypeScript**, **HTML5/CSS3** และเชื่อมต่อข้อมูลสดจาก **Open-Meteo API**

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
weather-explorer/
├── src/
│   ├── api.ts            # เชื่อมต่อ Open-Meteo Geocoding & Forecast APIs
│   ├── provinces.ts      # ตารางเทียบชื่อ 77 จังหวัดภาษาไทยเป็นสากลสำหรับค้นหา
│   ├── utils.ts          # Pure Functions แปลงรหัส WMO, จัดการไอคอน และคำนวณสถิติ
│   ├── storage.ts        # จัดการบันทึกเมืองโปรดลง Browser LocalStorage อย่างปลอดภัย
│   ├── types.ts          # Strict Types และ Interface ทั้งหมดในระบบ
│   ├── weatherView.ts    # [View] วาด Hero Card, แถบสถิติ และการ์ดพยากรณ์ 7 วัน
│   ├── favoritesView.ts  # [View] วาดปุ่มชิปเมืองโปรดและปุ่มบันทึกบน Hero Card
│   ├── main.ts           # [Orchestrator] คุม State, ดัก Event Listeners และสั่ง View
│   └── style.css         # Responsive Styling ด้วย Flexbox & CSS Grid
├── index.html            # โครงสร้าง Semantic HTML
├── ARCHITECTURE.md       # สถาปัตยกรรมระบบและวงจรการทำงานโดยละเอียด
└── README.md             # ภาพรวมโปรเจกต์และบันทึกการเรียนรู้
```

อ่านรายละเอียดสถาปัตยกรรมเชิงลึกและลำดับการเดินทางของข้อมูลได้ที่ [ARCHITECTURE.md](ARCHITECTURE.md)

---

## เครื่องมือที่ใช้ (Tech Stack)

- **Language:** HTML5, CSS3, TypeScript (Strict Mode)
- **Tools & AI:** VS Code ร่วมกับ Gemini Flash 3.8 (ใช้เป็นที่ปรึกษาทบทวนแนวคิด ตรวจสอบ Code Smells และชี้แนะ Mental Models)
- **Runtime & Bundler:** Vite + Bun
- **Deploy:** Vercel
- **Weather API:** [Open-Meteo API](https://open-meteo.com/) (ใช้ Geocoding หาพิกัดเมือง และ Forecast ดึงสภาพอากาศ)

---

## บันทึกความรู้สึกและสิ่งที่ได้เรียนรู้ 

โปรเจกต์นี้เป็นโปรเจกต์ส่งท้ายเพื่อสรุปความรู้หลังจากที่ผมลุยเรียนพื้นฐานเว็บและ TypeScript มาตลอด **3 สัปดาห์** เพื่อเอาทุกอย่างที่เรียนมาลองประกอบเป็นเว็บแอปจริงๆ ที่ใช้งานได้ดูสักครั้ง

### สิ่งที่ได้เรียนรู้และฝึกทำจริง:

1. **หัดแกะหน้าตาเว็บจากภาพตัวอย่าง (Mockup):**
   - ได้ฝึกมองภาพหน้าจอให้ออกเป็น "กล่องสี่เหลี่ยมซ้อนกัน" (Box Model)
   - หัดเขียน HTML ให้ถูกแท็ก และจัดตำแหน่งด้วย CSS Flexbox กับ Grid

2. **ฝึกคุม DOM และเข้าใจ Event-Driven Architecture:**
   - เป็นครั้งแรกที่ต้องเขียนโค้ดคุมหน้าจอที่มีหลายจังหวะ ทั้งหน้าตอนโหลดหมุนๆ (Loading), หน้าแจ้งเตือนตอนหาเมืองไม่เจอ (Error) และหน้าโชว์ข้อมูลสภาพอากาศ
   - ได้เรียนรู้ว่าโค้ดหน้าเว็บไม่ได้รันจากบนลงล่างแบบเส้นตรง (Linear) แต่ทำงานแบบ **Event-Driven** ที่เตรียมฟังก์ชันไว้ก่อน แล้วรอให้ผู้ใช้คลิกเพื่อกระตุ้นให้ฟังก์ชันทำงาน

3. **การ Refactor สู่ Clean Architecture & Decoupling:**
   - ได้ฝึกแยกโค้ดที่บวมใน `main.ts` ออกเป็น View Modules ย่อย (`weatherView.ts` และ `favoritesView.ts`) ตามหลักการ **Single Responsibility Principle (SRP)**
   - ทำให้ `main.ts` กลายเป็น **Orchestrator** ที่แท้จริง คอยประสานงานระหว่าง Data Pipeline, State และ View โดยที่แต่ละ View ไม่ต้องแอบผูกติดกันข้ามโมดูล

4. **ได้ฝึกยิง API และสร้าง Data Pipeline ที่ปลอดภัย (Defensive Coding):**
   - ได้เจอกับปัญหาจริงเวลาหาเมืองไม่เจอหรือเน็ตหลุด ทำให้เข้าใจเรื่องการใช้ `try...catch` เพื่อทำ **Graceful Degradation** ไม่ให้หน้าเว็บแครช
   - ได้เข้าใจ Flow จริงๆ ของเว็บแอป: **รับชื่อเมืองจากผู้ใช้ -> ตรวจสอบข้อความ -> ยิง API ดึงพิกัดและสภาพอากาศ -> ปั้นก้อน Weather ที่คลีนแล้ว -> อัปเดต State -> สั่ง View วาดหน้าจอ**
   - ได้เข้าใจความสำคัญของ **Guard Clauses** (`activeCity && ...`) และการทำ **Case-Insensitive Comparison** (`.toLocaleLowerCase()`) เพื่อป้องกันบั๊กหน้างาน

5. **สัญชาตญาณวิศวกรซอฟต์แวร์ (Think Before Code):**
   - ตกผลึกแล้วว่าก่อนจะเริ่มพิมพ์โค้ด การเสียเวลา 10-15 นาทีเพื่อร่าง **Data Modeling** และ **Sequence Diagram** จะช่วยประหยัดเวลาการแก้บั๊กและป้องกันไม่ให้โค้ดเละได้อย่างมหาศาล

---

## วิธีการรันโปรเจกต์ในเครื่อง (Getting Started)

```bash
# 1. โคลนโปรเจกต์ลงเครื่อง
git clone https://github.com/kxitta/weather-explorer.git
cd weather-explorer

# 2. ติดตั้งแพ็กเกจ
bun install

# 3. รันเซิร์ฟเวอร์สำหรับเขียนโค้ด
bun run dev

# 4. เช็คความถูกต้องของ TypeScript
bun x tsc --noEmit
```
