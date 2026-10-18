const STORAGE_KEY: string = "weather_favorites"
const DEFAULT_CITIES: string[] = ["Bangkok", "Korat"]

/**
 * โหลดเมือง Favorites จากข้อมูลเดิมหรือกรณียังไม่มีข้อมูล ก็จะดึง DEFAULT_CITIES ไปใช้พร้อมป้องกันด้วย try catch
 */
export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_CITIES
    }
    const parsed = JSON.parse(raw);
    if (parsed.length === 0) return DEFAULT_CITIES

    return JSON.parse(raw)
  } catch (error) {
    return DEFAULT_CITIES
  }
}

/**
 * เพิ่มข้อมูลเมืองใหม่เข้าไปในที่เก็บข้อมูลเดิม STORAGE_KEY
 */
export function saveFavorite(cityName: string) {
  let favorites = getFavorites();
  if (favorites.includes(cityName)) {
    favorites = favorites.filter(item => item !== cityName)
  } else {
    if (favorites.length >= 4) {
      alert("สามารถบันทึกเมืองได้สูงสุด 4 เมืองเท่านั้น");
      return;
    }
    favorites.push(cityName);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save:", error);
  }

}