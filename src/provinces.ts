export const THAI_PROVINCES: Record<string, string> = {
  // ภาคกลาง และ ปริมณฑล
  "กรุงเทพ": "Bangkok",
  "กรุงเทพมหานคร": "Bangkok",
  "นนทบุรี": "Nonthaburi",
  "ปทุมธานี": "Pathum Thani",
  "สมุทรปราการ": "Samut Prakan",
  "สมุทรสาคร": "Samut Sakhon",
  "สมุทรสงคราม": "Samut Songkhram",
  "นครปฐม": "Nakhon Pathom",
  "อยุธยา": "Phra Nakhon Si Ayutthaya",
  "พระนครศรีอยุธยา": "Phra Nakhon Si Ayutthaya",
  "สระบุรี": "Saraburi",
  "ลพบุรี": "Lop Buri",
  "สิงห์บุรี": "Sing Buri",
  "ชัยนาท": "Chai Nat",
  "อ่างทอง": "Ang Thong",
  "สุพรรณบุรี": "Suphan Buri",
  "นครนายก": "Nakhon Nayok",

  // ภาคเหนือ
  "เชียงใหม่": "Chiang Mai",
  "เชียงราย": "Chiang Rai",
  "ลำปาง": "Lampang",
  "ลำพูน": "Lamphun",
  "แม่ฮ่องสอน": "Mae Hong Son",
  "พะเยา": "Phayao",
  "แพร่": "Phrae",
  "น่าน": "Nan",
  "อุตรดิตถ์": "Uttaradit",
  "พิษณุโลก": "Phitsanulok",
  "สุโขทัย": "Sukhothai",
  "เพชรบูรณ์": "Phetchabun",
  "พิจิตร": "Phichit",
  "กำแพงเพชร": "Kamphaeng Phet",
  "นครสวรรค์": "Nakhon Sawan",
  "อุทัยธานี": "Uthai Thani",
  "ตาก": "Tak",

  // ภาคตะวันออกเฉียงเหนือ (อีสาน)
  "โคราช": "Nakhon Ratchasima",
  "นครราชสีมา": "Nakhon Ratchasima",
  "ขอนแก่น": "Khon Kaen",
  "อุดรธานี": "Udon Thani",
  "อุบลราชธานี": "Ubon Ratchathani",
  "อุบล": "Ubon Ratchathani",
  "บุรีรัมย์": "Buri Ram",
  "สุรินทร์": "Surin",
  "ศรีสะเกษ": "Si Sa Ket",
  "ร้อยเอ็ด": "Roi Et",
  "มหาสารคาม": "Maha Sarakham",
  "สารคาม": "Maha Sarakham",
  "กาฬสินธุ์": "Kalasin",
  "สกลนคร": "Sakon Nakhon",
  "นครพนม": "Nakhon Phanom",
  "มุกดาหาร": "Mukdahan",
  "ยโสธร": "Yasothon",
  "อำนาจเจริญ": "Amnat Charoen",
  "หนองคาย": "Nong Khai",
  "หนองบัวลำภู": "Nong Bua Lam Phu",
  "เลย": "Loei",
  "บึงกาฬ": "Bueng Kan",
  "ชัยภูมิ": "Chaiyaphum",

  // ภาคตะวันออก
  "ชลบุรี": "Chon Buri",
  "พัทยา": "Pattaya",
  "ระยอง": "Rayong",
  "จันทบุรี": "Chanthaburi",
  "ตราด": "Trat",
  "ฉะเชิงเทรา": "Chachoengsao",
  "แปดริ้ว": "Chachoengsao",
  "ปราจีนบุรี": "Prachin Buri",
  "สระแก้ว": "Sa Kaeo",

  // ภาคตะวันตก
  "กาญจนบุรี": "Kanchanaburi",
  "ราชบุรี": "Ratchaburi",
  "เพชรบุรี": "Phetchaburi",
  "ประจวบคีรีขันธ์": "Prachuap Khiri Khan",
  "หัวหิน": "Hua Hin",

  // ภาคใต้
  "ภูเก็ต": "Phuket",
  "สุราษฎร์ธานี": "Surat Thani",
  "สุราษฎร์": "Surat Thani",
  "เกาะสมุย": "Ko Samui",
  "นครศรีธรรมราช": "Nakhon Si Thammarat",
  "กระบี่": "Krabi",
  "พังงา": "Phangnga",
  "ตรัง": "Trang",
  "พัทลุง": "Phatthalung",
  "สงขลา": "Songkhla",
  "หาดใหญ่": "Hat Yai",
  "สตูล": "Satun",
  "ปัตตานี": "Pattani",
  "ยะลา": "Yala",
  "เบตง": "Betong",
  "นราธิวาส": "Narathiwat",
  "ชุมพร": "Chumphon",
  "ระนอง": "Ranong",
};

export function toEnglishCity(input: string): string {
  const data = input.trim();
  if (data in THAI_PROVINCES) {
    return THAI_PROVINCES[data];
  } else {
    return data
  }
}