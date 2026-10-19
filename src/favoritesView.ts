import { getFavorites } from "./storage";

const favoriteChipsEl = document.getElementById('favorite-chips') as HTMLElement;
const favToggleBtn = document.getElementById('fav-toggle-btn') as HTMLButtonElement;

/**
 * ดึงชื่อเมืองจาก getFavorites() ใน LocalStorage มาปั๊มเป็นปุ่มชิป
 * ถ้ามี activeCity ส่งมาและตรงกับเมืองที่กำลังดูอยู่ จะแปะคลาส active (สีฟ้า) ให้ปุ่มนั้น
 */
export function renderChips(activeCity?: string): void {
  const cityNames = getFavorites();
  favoriteChipsEl.innerHTML = cityNames.map(name => {
    // ดักกันแอปแครชกรณีเปิดเว็บครั้งแรกที่ activeCity ยังเป็น undefined
    // และแปลงเป็นตัวพิมพ์เล็กทั้งคู่เพื่อเปรียบเทียบชื่อเมืองแบบไม่สนพิมพ์เล็ก-ใหญ่
    const isActive = activeCity && name.toLocaleLowerCase() === activeCity.toLocaleLowerCase()
    return `
    <button type="button" class="chip ${isActive ? 'active' : ''}">${name}</button>
    `;
  }).join("");
}

/**
 * ตรวจสอบชื่อเมืองใน getFavorites()
 * ถ้าเคยบันทึกแล้ว: สลับปุ่มเป็นการ์ด "บันทึกแล้ว"
 * ถ้ายังไม่เคยบันทึก: สลับปุ่มเป็น "เพิ่มในรายการโปรด"
 */
export function upadateFavButton(cityName: string): void {
  const isFav = getFavorites().includes(cityName);

  if (isFav) {
    favToggleBtn.classList.add("active");
    favToggleBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>บันทึกแล้ว</span>`;
  } else {
    favToggleBtn.classList.remove("active");
    favToggleBtn.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>เพิ่มในรายการโปรด</span>`;
  }
}
