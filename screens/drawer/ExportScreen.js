import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share, Platform } from 'react-native';
import { useSubs } from '../../context/SubContext';
import { useDialog } from '../../context/DialogContext';
import { styles, COLORS, CATEGORIES } from '../../styles/theme';
import { formatMoney, monthlyCost, getNextBillingDate, formatThaiDate } from '../../utils/helpers';

// จำลองการส่งออกรายงาน: สร้างข้อความสรุป / CSV แล้วส่งผ่านเมนูแชร์ของมือถือ (LINE, อีเมล, Drive ฯลฯ)
export default function ExportScreen() {
  const { activeSubs, cancelledSubs, settings } = useSubs();
  const { showMessage } = useDialog();
  const [format, setFormat] = useState('summary');
  const cur = settings.currency;
  const total = activeSubs.reduce((sum, s) => sum + monthlyCost(s), 0);

  const buildSummary = () => {
    const lines = activeSubs
      .slice()
      .sort((a, b) => monthlyCost(b) - monthlyCost(a))
      .map((s, i) => `${i + 1}. ${s.name} — ${formatMoney(s.price, cur)}/${s.cycle === 'yearly' ? 'ปี' : 'เดือน'} (ตัดเงิน ${formatThaiDate(getNextBillingDate(s))})`);
    return [
      '📊 รายงานค่าบริการรายเดือน — SubSaver',
      `วันที่ออกรายงาน: ${formatThaiDate(new Date())}`,
      '',
      ...lines,
      '',
      `รวมต่อเดือน: ${formatMoney(total, cur)}`,
      `รวมต่อปี: ${formatMoney(total * 12, cur)}`,
      `งบที่ตั้งไว้: ${formatMoney(settings.monthlyLimit, cur)}`,
      `ยกเลิกไปแล้ว ${cancelledSubs.length} บริการ`,
    ].join('\n');
  };

  const buildCSV = () => {
    const header = 'name,category,price,cycle,billing_day,monthly_cost,status';
    const rows = [...activeSubs, ...cancelledSubs].map((s) =>
      [`"${s.name}"`, CATEGORIES[s.category]?.label || s.category, s.price, s.cycle, s.billingDay, monthlyCost(s).toFixed(2), s.status].join(',')
    );
    return [header, ...rows].join('\n');
  };

  const content = format === 'summary' ? buildSummary() : buildCSV();

  const share = async () => {
    // บนเว็บไม่มีเมนูแชร์ของมือถือ จึงคัดลอกรายงานไปที่คลิปบอร์ดแทน
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(content);
        showMessage('คัดลอกแล้ว', 'คัดลอกรายงานไปที่คลิปบอร์ดแล้ว นำไปวางใน LINE, อีเมล หรือ Excel ได้เลย');
      } catch (err) {
        showMessage('แชร์บนเว็บไม่ได้', 'เบราว์เซอร์ไม่อนุญาตให้คัดลอก ลองทดสอบปุ่มนี้บนมือถือผ่าน Expo Go');
      }
      return;
    }
    try {
      await Share.share({ message: content, title: 'รายงาน SubSaver' });
    } catch (err) {
      showMessage('แชร์ไม่สำเร็จ', String(err.message || err));
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>เลือกรูปแบบรายงาน แล้วกดแชร์ไปยังแอปอื่น</Text>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        {[{ key: 'summary', label: 'สรุปข้อความ' }, { key: 'csv', label: 'CSV (Excel)' }].map((f) => (
          <Pressable key={f.key} onPress={() => setFormat(f.key)} style={[styles.chip, format === f.key && styles.chipActive]}>
            <Text style={[styles.chipText, format === f.key && styles.chipTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>ตัวอย่างรายงาน</Text>
      <View style={[styles.card, { backgroundColor: '#1F2333' }]}>
        <Text style={{ color: '#E4E6EF', fontFamily: format === 'csv' ? 'monospace' : undefined, fontSize: 13, lineHeight: 20 }}>{content}</Text>
      </View>

      <Pressable style={styles.button} onPress={share}>
        <Text style={styles.buttonText}>แชร์รายงาน</Text>
      </Pressable>
      <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 10, color: COLORS.textSecondary }]}>
        * ข้อมูลเก็บในเครื่องเท่านั้น ส่งออกเป็นข้อความเพื่อแชร์ต่อ
      </Text>
    </ScrollView>
  );
}