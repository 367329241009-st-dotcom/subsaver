// ฟังก์ชันช่วยคำนวณ — แยกออกมาจากหน้าจอ (Separation of Concerns)

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
export const THAI_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// ใส่ลูกน้ำคั่นหลักพัน เช่น 1234.5 -> "฿1,235"
export function formatMoney(amount, symbol = '฿') {
  const n = Math.round(Number(amount) || 0);
  return symbol + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// จำนวนวันในเดือน (month เริ่มที่ 0)
export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ค่าใช้จ่ายต่อเดือน: รายปีหาร 12
export function monthlyCost(sub) {
  return sub.cycle === 'yearly' ? sub.price / 12 : sub.price;
}

export function yearlyCost(sub) {
  return sub.cycle === 'yearly' ? sub.price : sub.price * 12;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// หาวันตัดเงินครั้งถัดไป (ถ้าวันที่ 31 แต่เดือนนั้นมี 30 วัน จะใช้วันสุดท้ายของเดือน)
export function getNextBillingDate(sub, from = new Date()) {
  const today = startOfDay(from);
  let y = today.getFullYear();

  if (sub.cycle === 'yearly') {
    const m = (sub.billingMonth || 1) - 1;
    let d = new Date(y, m, Math.min(sub.billingDay, daysInMonth(y, m)));
    if (d < today) {
      y += 1;
      d = new Date(y, m, Math.min(sub.billingDay, daysInMonth(y, m)));
    }
    return d;
  }

  let m = today.getMonth();
  let d = new Date(y, m, Math.min(sub.billingDay, daysInMonth(y, m)));
  if (d < today) {
    m += 1;
    if (m > 11) { m = 0; y += 1; }
    d = new Date(y, m, Math.min(sub.billingDay, daysInMonth(y, m)));
  }
  return d;
}

// อีกกี่วันจะถึงวันที่กำหนด (0 = วันนี้)
export function daysUntil(date, from = new Date()) {
  return Math.round((startOfDay(date) - startOfDay(from)) / 86400000);
}

export function formatThaiDate(date) {
  return `${date.getDate()} ${THAI_MONTHS[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export function dueText(days) {
  if (days === 0) return 'ตัดเงินวันนี้';
  if (days === 1) return 'ตัดเงินพรุ่งนี้';
  return `อีก ${days} วัน`;
}

// วันที่บริการนี้ตัดเงินใน "เดือนที่ดูอยู่" (คืนค่า null ถ้าเดือนนั้นไม่มีการตัดเงิน)
export function billingDayInMonth(sub, year, month) {
  if (sub.cycle === 'yearly' && (sub.billingMonth || 1) - 1 !== month) return null;
  return Math.min(sub.billingDay, daysInMonth(year, month));
}
