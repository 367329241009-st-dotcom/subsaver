import React from 'react';
import { View, Text, Pressable } from 'react-native';
import ServiceIcon from './ServiceIcon';
import { styles, COLORS, CATEGORIES } from '../styles/theme';
import { formatMoney, getNextBillingDate, daysUntil, dueText } from '../utils/helpers';

// การ์ด 1 แถวในรายการบริการ
export default function SubscriptionCard({ sub, currency, remindDays, onPress }) {
  const cancelled = sub.status === 'cancelled';
  const days = daysUntil(getNextBillingDate(sub));
  const soon = !cancelled && days <= remindDays;
  const category = CATEGORIES[sub.category] || CATEGORIES.utility;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, styles.row, pressed && { opacity: 0.7 }]}>
      <ServiceIcon icon={sub.icon} color={sub.color} faded={cancelled} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: cancelled ? COLORS.textSecondary : COLORS.text }} numberOfLines={1}>
          {sub.name}
        </Text>
        <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
          {category.label} · {sub.cycle === 'yearly' ? 'รายปี' : 'รายเดือน'}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: cancelled ? COLORS.textSecondary : COLORS.text, textDecorationLine: cancelled ? 'line-through' : 'none' }}>
          {formatMoney(sub.price, currency)}
        </Text>
        {cancelled ? (
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>ยกเลิกแล้ว</Text>
        ) : (
          <Text style={{ fontSize: 12, marginTop: 2, color: soon ? COLORS.danger : COLORS.textSecondary, fontWeight: soon ? '700' : '400' }}>
            {dueText(days)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
