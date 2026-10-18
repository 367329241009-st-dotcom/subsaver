import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useSubs } from '../../context/SubContext';
import { useDialog } from '../../context/DialogContext';
import { styles, COLORS } from '../../styles/theme';
import { formatMoney, monthlyCost } from '../../utils/helpers';

const CURRENCIES = [
  { symbol: '฿', label: 'บาท (฿)' },
  { symbol: '$', label: 'ดอลลาร์ ($)' },
  { symbol: '€', label: 'ยูโร (€)' },
];
const REMIND_OPTIONS = [1, 3, 7];

export default function BudgetScreen() {
  const { settings, updateSettings, activeSubs, resetData } = useSubs();
  const { showMessage, confirm } = useDialog();
  const [limit, setLimit] = useState(String(settings.monthlyLimit));

  useEffect(() => {
    setLimit(String(settings.monthlyLimit));
  }, [settings.monthlyLimit]);

  const total = activeSubs.reduce((sum, s) => sum + monthlyCost(s), 0);

  const saveLimit = () => {
    const n = parseFloat(limit);
    if (isNaN(n) || n <= 0) return showMessage('ไม่ถูกต้อง', 'กรุณาใส่งบเป็นตัวเลขมากกว่า 0');
    updateSettings({ monthlyLimit: n });
    showMessage('บันทึกแล้ว', `ตั้งงบต่อเดือนเป็น ${formatMoney(n, settings.currency)}`);
  };

  const confirmReset = () => {
    confirm(
      'ล้างข้อมูลทั้งหมด',
      'ข้อมูลที่เพิ่มเองจะหายและกลับไปเป็นข้อมูลตัวอย่าง ต้องการทำต่อไหม?',
      'ล้างข้อมูล',
      async () => {
        await resetData();
        showMessage('เรียบร้อย', 'โหลดข้อมูลตัวอย่างใหม่แล้ว');
      }
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.text }}>งบประมาณต่อเดือน (Monthly Limit)</Text>
        <Text style={styles.subtitle}>ตอนนี้ใช้อยู่ {formatMoney(total, settings.currency)} ต่อเดือน</Text>
        <TextInput style={[styles.input, { marginTop: 12 }]} value={limit} onChangeText={setLimit} keyboardType="decimal-pad" />
        <Pressable style={styles.button} onPress={saveLimit}>
          <Text style={styles.buttonText}>บันทึกงบประมาณ</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.text }}>สัญลักษณ์สกุลเงิน</Text>
        <Text style={styles.subtitle}>เปลี่ยนเฉพาะสัญลักษณ์ที่แสดง ไม่ได้แปลงค่าเงิน</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {CURRENCIES.map((c) => (
            <Pressable key={c.symbol} onPress={() => updateSettings({ currency: c.symbol })} style={[styles.chip, settings.currency === c.symbol && styles.chipActive]}>
              <Text style={[styles.chipText, settings.currency === c.symbol && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.text }}>เตือนล่วงหน้าก่อนตัดเงิน</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {REMIND_OPTIONS.map((d) => (
            <Pressable key={d} onPress={() => updateSettings({ remindDays: d })} style={[styles.chip, settings.remindDays === d && styles.chipActive]}>
              <Text style={[styles.chipText, settings.remindDays === d && styles.chipTextActive]}>{d} วัน</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={[styles.buttonOutline, { borderColor: COLORS.danger }]} onPress={confirmReset}>
        <Text style={[styles.buttonOutlineText, { color: COLORS.danger }]}>ล้างข้อมูล / โหลดข้อมูลตัวอย่างใหม่</Text>
      </Pressable>
    </ScrollView>
  );
}