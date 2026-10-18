import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubs } from '../context/SubContext';
import ServiceIcon from '../components/ServiceIcon';
import { styles, COLORS } from '../styles/theme';
import { formatMoney, monthlyCost, yearlyCost } from '../utils/helpers';

function Stat({ value, label, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: color || COLORS.text }}>{value}</Text>
      <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { activeSubs, cancelledSubs, settings, updateSettings } = useSubs();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.userName);
  const cur = settings.currency;

  const savedPerMonth = cancelledSubs.reduce((sum, s) => sum + monthlyCost(s), 0);
  const savedPerYear = cancelledSubs.reduce((sum, s) => sum + yearlyCost(s), 0);

  const saveName = () => {
    if (nameInput.trim()) updateSettings({ userName: nameInput.trim() });
    setEditingName(false);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 34, fontWeight: '800' }}>{settings.userName.charAt(0)}</Text>
        </View>
        {editingName ? (
          <View style={[styles.row, { marginTop: 12 }]}>
            <TextInput style={[styles.input, { minWidth: 180, paddingVertical: 8 }]} value={nameInput} onChangeText={setNameInput} autoFocus onSubmitEditing={saveName} />
            <Pressable onPress={saveName} style={{ marginLeft: 8 }}>
              <MaterialCommunityIcons name="check-circle" size={32} color={COLORS.success} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => {
              setNameInput(settings.userName);
              setEditingName(true);
            }}
            style={[styles.row, { marginTop: 12 }]}
          >
            <Text style={styles.title}>{settings.userName}</Text>
            <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.textSecondary} style={{ marginLeft: 6 }} />
          </Pressable>
        )}
      </View>

      <View style={[styles.card, styles.row]}>
        <Stat value={activeSubs.length} label="กำลังใช้" />
        <Stat value={cancelledSubs.length} label="ยกเลิกแล้ว" />
        <Stat value={formatMoney(settings.monthlyLimit, cur)} label="งบ/เดือน" />
      </View>

      <View style={[styles.card, { backgroundColor: COLORS.successLight }]}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="piggy-bank-outline" size={28} color={COLORS.success} />
          <Text style={{ marginLeft: 8, fontWeight: '700', color: COLORS.success, fontSize: 16 }}>ยอดประหยัดจากการยกเลิก</Text>
        </View>
        <Text style={{ fontSize: 30, fontWeight: '800', color: COLORS.success, marginTop: 8 }}>{formatMoney(savedPerYear, cur)} / ปี</Text>
        <Text style={{ color: COLORS.success }}>หรือเดือนละ {formatMoney(savedPerMonth, cur)}</Text>
      </View>

      <Text style={styles.sectionTitle}>บริการที่ยกเลิกแล้ว</Text>
      {cancelledSubs.length === 0 ? (
        <Text style={styles.subtitle}>ยังไม่มี — ลองดูว่ามีบริการไหนที่ไม่ค่อยได้ใช้บ้าง</Text>
      ) : (
        cancelledSubs.map((s) => (
          <View key={s.id} style={[styles.card, styles.row]}>
            <ServiceIcon icon={s.icon} color={s.color} size={38} faded />
            <Text style={{ flex: 1, marginLeft: 12, color: COLORS.text }}>{s.name}</Text>
            <Text style={{ color: COLORS.success, fontWeight: '700' }}>+{formatMoney(yearlyCost(s), cur)}/ปี</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
