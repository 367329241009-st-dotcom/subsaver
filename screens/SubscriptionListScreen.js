import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSubs } from '../context/SubContext';
import SubscriptionCard from '../components/SubscriptionCard';
import { styles, COLORS, CATEGORIES } from '../styles/theme';

const FILTERS = [{ key: 'all', label: 'ทั้งหมด' }, ...Object.keys(CATEGORIES).map((k) => ({ key: k, label: CATEGORIES[k].label }))];

export default function SubscriptionListScreen({ navigation }) {
  const { subs, settings, loading } = useSubs();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // กรองตามคำค้นและหมวดหมู่ แล้วให้บริการที่ยกเลิกแล้วไปอยู่ท้ายรายการ
  const shown = subs
    .filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((s) => filter === 'all' || s.category === filter)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'active' ? -1 : 1));

  return (
    <View style={styles.screen}>
      <FlatList
        data={shown}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        ListHeaderComponent={
          <View>
            <View style={[styles.input, styles.row, { paddingVertical: 4 }]}>
              <MaterialCommunityIcons name="magnify" size={22} color={COLORS.textSecondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="ค้นหาบริการ..."
                placeholderTextColor={COLORS.textSecondary}
                style={{ flex: 1, paddingVertical: 8, marginLeft: 8, fontSize: 16, color: COLORS.text }}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 4 }}>
              {FILTERS.map((f) => (
                <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, filter === f.key && styles.chipActive]}>
                  <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <MaterialCommunityIcons name="text-box-search-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.subtitle}>ไม่พบบริการ</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            sub={item}
            currency={settings.currency}
            remindDays={settings.remindDays}
            onPress={() => navigation.navigate('SubscriptionDetail', { id: item.id })}
          />
        )}
      />

      {/* ปุ่ม + ลอยมุมขวาล่าง */}
      <Pressable
        onPress={() => navigation.navigate('AddEditSubscription')}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}
