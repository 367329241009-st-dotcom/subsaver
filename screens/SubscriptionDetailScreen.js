import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSubs } from '../context/SubContext';
import { useDialog } from '../context/DialogContext';
import ServiceIcon from '../components/ServiceIcon';
import { styles, COLORS, CATEGORIES } from '../styles/theme';
import { formatMoney, monthlyCost, yearlyCost, getNextBillingDate, daysUntil, dueText, formatThaiDate, THAI_MONTHS_FULL } from '../utils/helpers';

function InfoRow({ label, value, valueColor }) {
  return (
    <View style={[styles.between, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border }]}>
      <Text style={{ color: COLORS.textSecondary }}>{label}</Text>
      <Text style={{ color: valueColor || COLORS.text, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 }}>{value}</Text>
    </View>
  );
}

export default function SubscriptionDetailScreen({ route, navigation }) {
  const { subs, settings, toggleCancel, deleteSub } = useSubs();
  const { confirm } = useDialog();
  // ส่งแค่ id มาทาง route แล้วค้นจาก Context — ข้อมูลจะอัปเดตทันทีหลังแก้ไข
  const sub = subs.find((s) => s.id === route.params?.id);

  if (!sub) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.subtitle}>ไม่พบข้อมูลบริการนี้</Text>
      </View>
    );
  }

  const cur = settings.currency;
  const cancelled = sub.status === 'cancelled';
  const next = getNextBillingDate(sub);
  const days = daysUntil(next);
  const category = CATEGORIES[sub.category] || CATEGORIES.utility;

  const confirmDelete = () => {
    const id = sub.id;
    confirm('ลบบริการ', `ต้องการลบ "${sub.name}" ออกจากรายการใช่ไหม?`, 'ลบ', () => {
      navigation.goBack();
      deleteSub(id);
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <ServiceIcon icon={sub.icon} color={sub.color} size={84} faded={cancelled} />
        <Text style={[styles.title, { marginTop: 12 }]}>{sub.name}</Text>
        <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.text, marginTop: 6 }}>
          {formatMoney(sub.price, cur)}
          <Text style={{ fontSize: 16, fontWeight: '400', color: COLORS.textSecondary }}> / {sub.cycle === 'yearly' ? 'ปี' : 'เดือน'}</Text>
        </Text>
        <View style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: cancelled ? COLORS.border : COLORS.successLight }}>
          <Text style={{ color: cancelled ? COLORS.textSecondary : COLORS.success, fontWeight: '600' }}>{cancelled ? 'ยกเลิกแล้ว' : 'กำลังใช้งาน'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <InfoRow label="หมวดหมู่" value={category.label} valueColor={category.color} />
        <InfoRow label="รอบการจ่าย" value={sub.cycle === 'yearly' ? `รายปี (ทุก ${sub.billingDay} ${THAI_MONTHS_FULL[(sub.billingMonth || 1) - 1]})` : `รายเดือน (ทุกวันที่ ${sub.billingDay})`} />
        {!cancelled && <InfoRow label="ตัดเงินครั้งถัดไป" value={`${formatThaiDate(next)} · ${dueText(days)}`} valueColor={days <= settings.remindDays ? COLORS.danger : undefined} />}
        <InfoRow label="เฉลี่ยต่อเดือน" value={formatMoney(monthlyCost(sub), cur)} />
        <InfoRow label="รวมต่อปี" value={formatMoney(yearlyCost(sub), cur)} />
        {sub.note ? <InfoRow label="บันทึก" value={sub.note} /> : null}
      </View>

      {cancelled && (
        <View style={[styles.card, { backgroundColor: COLORS.successLight }]}>
          <Text style={{ color: COLORS.success, fontWeight: '600' }}>
            การยกเลิกช่วยให้คุณประหยัดได้ {formatMoney(yearlyCost(sub), cur)} ต่อปี
          </Text>
        </View>
      )}

      <Pressable style={styles.button} onPress={() => navigation.navigate('AddEditSubscription', { id: sub.id })}>
        <Text style={styles.buttonText}>แก้ไขข้อมูล</Text>
      </Pressable>
      <Pressable style={styles.buttonOutline} onPress={() => toggleCancel(sub.id)}>
        <Text style={styles.buttonOutlineText}>{cancelled ? 'กลับมาใช้บริการ' : 'ยกเลิกบริการนี้'}</Text>
      </Pressable>
      <Pressable style={[styles.buttonOutline, { borderColor: COLORS.danger }]} onPress={confirmDelete}>
        <Text style={[styles.buttonOutlineText, { color: COLORS.danger }]}>ลบออกจากรายการ</Text>
      </Pressable>
    </ScrollView>
  );
}