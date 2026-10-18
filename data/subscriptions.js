// ข้อมูลตัวอย่าง (สำรองไว้ใช้ตอนโหลดจาก GitHub ไม่สำเร็จ)
// ราคาเป็นตัวอย่างเพื่อการสาธิตเท่านั้น
// เนื้อหาเดียวกันนี้อยู่ในไฟล์ subscriptions.json สำหรับอัปโหลดขึ้น GitHub
const DEFAULT_SUBS = [
  { id: '1', name: 'Netflix', price: 419, cycle: 'monthly', billingDay: 5, billingMonth: 1, category: 'entertainment', icon: 'netflix', color: '#E50914', status: 'active', note: 'แพ็กเกจ Standard' },
  { id: '2', name: 'Spotify Premium', price: 149, cycle: 'monthly', billingDay: 12, billingMonth: 1, category: 'entertainment', icon: 'spotify', color: '#1DB954', status: 'active', note: '' },
  { id: '3', name: 'YouTube Premium', price: 179, cycle: 'monthly', billingDay: 20, billingMonth: 1, category: 'entertainment', icon: 'youtube', color: '#FF0000', status: 'active', note: '' },
  { id: '4', name: 'iCloud+ 50GB', price: 35, cycle: 'monthly', billingDay: 1, billingMonth: 1, category: 'work', icon: 'apple-icloud', color: '#3693F3', status: 'active', note: 'สำรองรูปในมือถือ' },
  { id: '5', name: 'Canva Pro', price: 1500, cycle: 'yearly', billingDay: 15, billingMonth: 3, category: 'work', icon: 'palette', color: '#00C4CC', status: 'active', note: 'ใช้ทำสไลด์นำเสนองาน' },
  { id: '6', name: 'ฟิตเนส', price: 990, cycle: 'monthly', billingDay: 25, billingMonth: 1, category: 'health', icon: 'dumbbell', color: '#F97316', status: 'active', note: '' },
  { id: '7', name: 'อินเทอร์เน็ตบ้าน', price: 599, cycle: 'monthly', billingDay: 15, billingMonth: 1, category: 'utility', icon: 'wifi', color: '#6366F1', status: 'active', note: '' },
  { id: '8', name: 'ค่าโทรศัพท์รายเดือน', price: 399, cycle: 'monthly', billingDay: 28, billingMonth: 1, category: 'utility', icon: 'cellphone', color: '#0EA5E9', status: 'active', note: '' },
  { id: '9', name: 'Microsoft 365', price: 2290, cycle: 'yearly', billingDay: 10, billingMonth: 8, category: 'work', icon: 'microsoft-office', color: '#D83B01', status: 'active', note: '' },
  { id: '10', name: 'Disney+ Hotstar', price: 99, cycle: 'monthly', billingDay: 18, billingMonth: 1, category: 'entertainment', icon: 'television-classic', color: '#113CCF', status: 'cancelled', note: 'ยกเลิกแล้ว ไม่ค่อยได้ดู' },
];

export default DEFAULT_SUBS;
