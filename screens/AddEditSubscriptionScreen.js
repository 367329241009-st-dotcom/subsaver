import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubs } from '../context/SubContext';
import { useDialog } from '../context/DialogContext';
import { styles, COLORS, CATEGORIES, ICON_CHOICES } from '../styles/theme';
import { THAI_MONTHS_FULL } from '../utils/helpers';

// หน้าเดียวใช้ได้ทั้ง "เพิ่ม" และ "แก้ไข" — ถ้ามี id ส่งมา = แก้ไข
export default function AddEditSubscriptionScreen({ route, navigation }) {
  const { subs, addSub, updateSub, settings } = useSubs();
  const { showMessage } = useDialog();
  const editing = subs.find((s) => s.id === route.params?.id);

  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [cycle, setCycle] = useState(editing?.cycle ?? 'monthly');
  const [billingDay, setBillingDay] = useState(editing ? String(editing.billingDay) : '');
  const [billingMonth, setBillingMonth] = useState(editing?.billingMonth ?? new Date().getMonth() + 1);
  const [category, setCategory] = useState(editing?.category ?? 'entertainment');
  const [iconChoice, setIconChoice] = useState(
    editing ? { icon: editing.icon, color: editing.color } : ICON_CHOICES[0]
  );
  const [note, setNote] = useState(editing?.note ?? '');

  useLayoutEffect(() => {
    navigation.setOptions({ title: editing ? 'แก้ไขบริการ' : 'เพิ่มบริการ' });
  }, [navigation, editing]);

  const save = () => {
    const priceNum = parseFloat(price);
    const dayNum = parseInt(billingDay, 10);

    // ตรวจสอบข้อมูลก่อนบันทึก
    if (!name.trim()) return showMessage('ข้อมูลไม่ครบ', 'กรุณาใส่ชื่อบริการ');
    if (isNaN(priceNum) || priceNum <= 0) return showMessage('ราคาไม่ถูกต้อง', 'กรุณาใส่ราคาเป็นตัวเลขมากกว่า 0');
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) return showMessage('วันตัดเงินไม่ถูกต้อง', 'กรุณาใส่วันที่ 1–31');

    const data = {
      name: name.trim(),
      price: priceNum,
      cycle,
      billingDay: dayNum,
      billingMonth,
      category,
      icon: iconChoice.icon,
      color: iconChoice.color,
      note: note.trim(),
    };

    if (editing) updateSub(editing.id, data);
    else addSub(data);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>ไอคอน</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {ICON_CHOICES.map((c) => {
            const active = c.icon === iconChoice.icon;
            return (
              <Pressable
                key={c.icon}
                onPress={() => setIconChoice(c)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  margin: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? c.color : c.color + '1A',
                }}
              >
                <MaterialCommunityIcons name={c.icon} size={26} color={active ? '#fff' : c.color} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>ชื่อบริการ</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="เช่น Netflix" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>ราคา ({settings.currency})</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={COLORS.textSecondary} />

        <Text style={styles.label}>รอบการจ่าย</Text>
        <View style={styles.row}>
          {[{ key: 'monthly', label: 'รายเดือน' }, { key: 'yearly', label: 'รายปี' }].map((c) => (
            <Pressable key={c.key} onPress={() => setCycle(c.key)} style={[styles.chip, cycle === c.key && styles.chipActive]}>
              <Text style={[styles.chipText, cycle === c.key && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>ตัดเงินทุกวันที่ (1–31)</Text>
        <TextInput style={styles.input} value={billingDay} onChangeText={setBillingDay} keyboardType="number-pad" maxLength={2} placeholder="เช่น 15" placeholderTextColor={COLORS.textSecondary} />

        {cycle === 'yearly' && (
          <>
            <Text style={styles.label}>เดือนที่ตัดเงิน</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {THAI_MONTHS_FULL.map((m, i) => (
                <Pressable key={m} onPress={() => setBillingMonth(i + 1)} style={[styles.chip, billingMonth === i + 1 && styles.chipActive]}>
                  <Text style={[styles.chipText, billingMonth === i + 1 && styles.chipTextActive]}>{m}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.label}>หมวดหมู่</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Object.keys(CATEGORIES).map((key) => (
            <Pressable key={key} onPress={() => setCategory(key)} style={[styles.chip, category === key && styles.chipActive]}>
              <Text style={[styles.chipText, category === key && styles.chipTextActive]}>{CATEGORIES[key].label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>บันทึกเพิ่มเติม</Text>
        <TextInput style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]} value={note} onChangeText={setNote} multiline placeholder="ไม่บังคับ" placeholderTextColor={COLORS.textSecondary} />

        <Pressable style={[styles.button, { marginTop: 24 }]} onPress={save}>
          <Text style={styles.buttonText}>{editing ? 'บันทึกการแก้ไข' : 'เพิ่มบริการ'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}