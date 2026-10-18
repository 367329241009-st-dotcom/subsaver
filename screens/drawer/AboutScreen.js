import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, COLORS } from '../../styles/theme';

// TODO: ใส่ชื่อ-รหัสนักศึกษาของสมาชิกทั้ง 3 คน
const TEAM = [
  { name: 'สมาชิกคนที่ 1', id: '004', role: 'น.ส.ชุติมณฑน์ เธียรภักดีกุล' },
  { name: 'สมาชิกคนที่ 2', id: '009', role: 'ปวริศา เสือใจหาญ' },
  { name: 'สมาชิกคนที่ 3', id: '012', role: 'รัญชนา วรรณพัตน์' },
  { name: 'สมาชิกคนที่ 4', id: '018', role: 'อภิจารวี นุ่มดี' },
];

const FEATURES = [
  ['view-dashboard-outline', 'สรุปยอดรายจ่ายรายเดือนและสัดส่วนตามหมวดหมู่'],
  ['bell-ring-outline', 'เตือนบริการที่ใกล้ถึงวันตัดเงิน'],
  ['calendar-month-outline', 'ปฏิทินแสดงวันตัดเงินของแต่ละบริการ'],
  ['piggy-bank-outline', 'คำนวณยอดประหยัดจากบริการที่ยกเลิก'],
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <View style={{ width: 80, height: 80, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="wallet-outline" size={44} color="#fff" />
        </View>
        <Text style={[styles.title, { marginTop: 12 }]}>SubSaver</Text>
        <Text style={styles.subtitle}>เวอร์ชัน 1.0.0</Text>
        <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
          แอปติดตามค่าบริการรายเดือน ช่วยให้รู้ว่าจ่ายอะไรไปบ้าง และเตือนก่อนถึงวันตัดบัตร
        </Text>
      </View>

      <Text style={styles.sectionTitle}>ฟีเจอร์หลัก</Text>
      <View style={styles.card}>
        {FEATURES.map(([icon, text]) => (
          <View key={icon} style={[styles.row, { marginBottom: 10 }]}>
            <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
            <Text style={{ marginLeft: 10, flex: 1, color: COLORS.text }}>{text}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>นโยบายความเป็นส่วนตัว</Text>
      <View style={styles.card}>
        <Text style={{ color: COLORS.text, lineHeight: 22 }}>
          ข้อมูลทั้งหมดเก็บไว้ในเครื่องของผู้ใช้เท่านั้น (AsyncStorage) แอปไม่มีการสมัครสมาชิก ไม่เก็บข้อมูลบัตร และไม่ส่งข้อมูลไปที่เซิร์ฟเวอร์ใด
        </Text>
      </View>

      <Text style={styles.sectionTitle}>ผู้พัฒนา</Text>
      {TEAM.map((m) => (
        <View key={m.name} style={[styles.card, styles.row]}>
          <MaterialCommunityIcons name="account-circle" size={36} color={COLORS.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: '600', color: COLORS.text }}>{m.name}</Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{m.id} · {m.role}</Text>
          </View>
        </View>
      ))}
      <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
        สาขาวิชาระบบสารสนเทศและนวัตกรรมดิจิทัล{'\n'}มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ
      </Text>
    </ScrollView>
  );
}
