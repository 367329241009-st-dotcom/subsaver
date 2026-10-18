import { StyleSheet } from 'react-native';

// สีหลักของแอป — แก้ที่นี่ที่เดียว ทั้งแอปเปลี่ยนตาม
export const COLORS = {
  primary: '#5B4BDB',
  primaryLight: '#ECEAFE',
  background: '#F5F6FA',
  card: '#FFFFFF',
  text: '#1F2333',
  textSecondary: '#6B7085',
  border: '#E4E6EF',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
};

// หมวดหมู่บริการ
export const CATEGORIES = {
  entertainment: { label: 'บันเทิง', color: '#E5484D', icon: 'movie-open-outline' },
  work: { label: 'งาน/เรียน', color: '#3E63DD', icon: 'briefcase-outline' },
  health: { label: 'สุขภาพ', color: '#30A46C', icon: 'heart-pulse' },
  utility: { label: 'ค่าบริการประจำ', color: '#F76B15', icon: 'home-lightning-bolt-outline' },
};

// ไอคอนที่ให้ผู้ใช้เลือกตอนเพิ่มบริการ (MaterialCommunityIcons) + สีแบรนด์
export const ICON_CHOICES = [
  { icon: 'netflix', color: '#E50914' },
  { icon: 'spotify', color: '#1DB954' },
  { icon: 'youtube', color: '#FF0000' },
  { icon: 'apple-icloud', color: '#3693F3' },
  { icon: 'google-drive', color: '#1FA463' },
  { icon: 'microsoft-office', color: '#D83B01' },
  { icon: 'palette', color: '#00C4CC' },
  { icon: 'television-classic', color: '#113CCF' },
  { icon: 'gamepad-variant', color: '#7C3AED' },
  { icon: 'robot-outline', color: '#10A37F' },
  { icon: 'dumbbell', color: '#F97316' },
  { icon: 'wifi', color: '#6366F1' },
  { icon: 'cellphone', color: '#0EA5E9' },
  { icon: 'credit-card-outline', color: '#64748B' },
];

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { padding: 16, paddingBottom: 40 },

  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 10 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonOutlineText: { color: COLORS.primary, fontSize: 16, fontWeight: '700' },

  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '600' },

  progressTrack: { height: 10, borderRadius: 5, backgroundColor: COLORS.border, overflow: 'hidden' },
  progressFill: { height: 10, borderRadius: 5 },
});
