import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubs } from '../context/SubContext';
import ServiceIcon from '../components/ServiceIcon';
import { styles, COLORS } from '../styles/theme';
import { formatMoney, daysInMonth, billingDayInMonth, THAI_MONTHS_FULL } from '../utils/helpers';

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// ปฏิทินรายเดือน สร้างเองด้วย View (ไม่ต้องติดตั้งไลบรารีเพิ่ม)
export default function CalendarScreen() {
  const { activeSubs, settings } = useSubs();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const changeMonth = (step) => {
    let m = month + step;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  // จัดกลุ่ม: วันที่ → รายการที่ตัดเงินวันนั้น
  const billsByDay = {};
  activeSubs.forEach((s) => {
    const d = billingDayInMonth(s, year, month);
    if (d) billsByDay[d] = [...(billsByDay[d] || []), s];
  });
  const monthTotal = Object.values(billsByDay).flat().reduce((sum, s) => sum + s.price, 0);

  // สร้างช่องในตาราง: ช่องว่างก่อนวันที่ 1 + วันที่ 1..n
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const selectedBills = billsByDay[selectedDay] || [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.between}>
          <Pressable onPress={() => changeMonth(-1)} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.text} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text }}>
              {THAI_MONTHS_FULL[month]} {year + 543}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>ต้องจ่ายเดือนนี้ {formatMoney(monthTotal, settings.currency)}</Text>
          </View>
          <Pressable onPress={() => changeMonth(1)} hitSlop={10}>
            <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          {WEEKDAYS.map((w) => (
            <Text key={w} style={{ flex: 1, textAlign: 'center', color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' }}>{w}</Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
          {cells.map((d, i) => {
            const bills = d ? billsByDay[d] || [] : [];
            const selected = d === selectedDay;
            return (
              <Pressable key={i} disabled={!d} onPress={() => setSelectedDay(d)} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }}>
                {d && (
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selected ? COLORS.primary : isToday(d) ? COLORS.primaryLight : 'transparent',
                    }}
                  >
                    <Text style={{ color: selected ? '#fff' : COLORS.text, fontWeight: isToday(d) || selected ? '700' : '400' }}>{d}</Text>
                    <View style={{ flexDirection: 'row', height: 6, marginTop: 2 }}>
                      {bills.slice(0, 3).map((b) => (
                        <View key={b.id} style={{ width: 5, height: 5, borderRadius: 3, marginHorizontal: 1, backgroundColor: selected ? '#fff' : b.color }} />
                      ))}
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        วันที่ {selectedDay} {THAI_MONTHS_FULL[month]}
      </Text>
      {selectedBills.length === 0 ? (
        <Text style={styles.subtitle}>ไม่มีรายการตัดเงินในวันนี้</Text>
      ) : (
        selectedBills.map((s) => (
          <View key={s.id} style={[styles.card, styles.row]}>
            <ServiceIcon icon={s.icon} color={s.color} size={38} />
            <Text style={{ flex: 1, marginLeft: 12, fontWeight: '600', color: COLORS.text }}>{s.name}</Text>
            <Text style={{ fontWeight: '700', color: COLORS.text }}>{formatMoney(s.price, settings.currency)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
