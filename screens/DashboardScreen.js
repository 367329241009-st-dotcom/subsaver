import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubs } from '../context/SubContext';
import ServiceIcon from '../components/ServiceIcon';
import { styles, COLORS, CATEGORIES } from '../styles/theme';
import { formatMoney, monthlyCost, getNextBillingDate, daysUntil, dueText, formatThaiDate } from '../utils/helpers';

export default function DashboardScreen({ navigation }) {
  const { activeSubs, settings, loading, notice } = useSubs();
  const cur = settings.currency;

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.subtitle}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  // ยอดรวมต่อเดือน (รายปีหาร 12)
  const total = activeSubs.reduce((sum, s) => sum + monthlyCost(s), 0);
  const limit = Number(settings.monthlyLimit) || 0;
  const percent = limit > 0 ? total / limit : 0;
  const barColor = percent >= 1 ? COLORS.danger : percent >= 0.8 ? COLORS.warning : COLORS.success;

  // รายการที่ใกล้ตัดเงิน เรียงจากใกล้สุด
  const upcoming = activeSubs
    .map((s) => ({ ...s, date: getNextBillingDate(s) }))
    .map((s) => ({ ...s, days: daysUntil(s.date) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  const urgent = upcoming.filter((s) => s.days <= settings.remindDays);

  // สัดส่วนตามหมวดหมู่
  const byCategory = Object.keys(CATEGORIES)
    .map((key) => ({
      key,
      ...CATEGORIES[key],
      amount: activeSubs.filter((s) => s.category === key).reduce((sum, s) => sum + monthlyCost(s), 0),
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const openDetail = (id) =>
    navigation.navigate('Subscriptions', { screen: 'SubscriptionDetail', params: { id }, initial: false });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {notice ? (
        <View style={[styles.card, { backgroundColor: COLORS.warningLight }]}>
          <Text style={{ color: COLORS.warning }}>{notice}</Text>
        </View>
      ) : null}

      {/* การ์ดยอดรวม */}
      <View style={[styles.card, { backgroundColor: COLORS.primary }]}>
        <Text style={{ color: '#fff', opacity: 0.85 }}>ค่าใช้จ่ายรายเดือนทั้งหมด</Text>
        <Text style={{ color: '#fff', fontSize: 36, fontWeight: '800', marginTop: 4 }}>{formatMoney(total, cur)}</Text>
        <Text style={{ color: '#fff', opacity: 0.85, marginTop: 2 }}>
          {activeSubs.length} บริการ · ปีละประมาณ {formatMoney(total * 12, cur)}
        </Text>
      </View>

      {/* งบประมาณ */}
      <View style={styles.card}>
        <View style={styles.between}>
          <Text style={{ fontWeight: '700', color: COLORS.text }}>งบต่อเดือน</Text>
          <Text style={{ color: COLORS.textSecondary }}>
            {formatMoney(total, cur)} / {formatMoney(limit, cur)}
          </Text>
        </View>
        <View style={[styles.progressTrack, { marginTop: 10 }]}>
          <View style={[styles.progressFill, { width: `${Math.min(percent, 1) * 100}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={{ marginTop: 8, color: barColor, fontWeight: '600' }}>
          {percent >= 1
            ? `เกินงบ ${formatMoney(total - limit, cur)}`
            : `เหลืออีก ${formatMoney(limit - total, cur)} (${Math.round(percent * 100)}%)`}
        </Text>
      </View>

      {/* แจ้งเตือนในแอป */}
      {urgent.length > 0 && (
        <View style={[styles.card, styles.row, { backgroundColor: COLORS.dangerLight }]}>
          <MaterialCommunityIcons name="bell-ring-outline" size={24} color={COLORS.danger} />
          <Text style={{ flex: 1, marginLeft: 10, color: COLORS.danger, fontWeight: '600' }}>
            มี {urgent.length} บริการจะตัดเงินภายใน {settings.remindDays} วัน
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>ใกล้ตัดเงิน</Text>
      {upcoming.length === 0 && <Text style={styles.subtitle}>ยังไม่มีบริการ</Text>}
      {upcoming.map((s) => (
        <Pressable key={s.id} style={[styles.card, styles.row]} onPress={() => openDetail(s.id)}>
          <ServiceIcon icon={s.icon} color={s.color} size={38} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: '600', color: COLORS.text }}>{s.name}</Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{formatThaiDate(s.date)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '700', color: COLORS.text }}>{formatMoney(s.price, cur)}</Text>
            <Text style={{ fontSize: 12, color: s.days <= settings.remindDays ? COLORS.danger : COLORS.textSecondary }}>
              {dueText(s.days)}
            </Text>
          </View>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>สัดส่วนตามหมวดหมู่</Text>
      <View style={styles.card}>
        {/* แถบสัดส่วนรวม */}
        <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 14 }}>
          {byCategory.map((c) => (
            <View key={c.key} style={{ flex: c.amount, backgroundColor: c.color }} />
          ))}
        </View>
        {byCategory.map((c) => (
          <View key={c.key} style={[styles.between, { marginBottom: 8 }]}>
            <View style={styles.row}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.color, marginRight: 8 }} />
              <Text style={{ color: COLORS.text }}>{c.label}</Text>
            </View>
            <Text style={{ color: COLORS.text, fontWeight: '600' }}>
              {formatMoney(c.amount, cur)} <Text style={{ color: COLORS.textSecondary, fontWeight: '400' }}>({Math.round((c.amount / total) * 100)}%)</Text>
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
