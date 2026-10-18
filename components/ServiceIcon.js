import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ไอคอนแบรนด์ในกรอบสี่เหลี่ยมมน (ใช้ซ้ำทั้งหน้ารายการ รายละเอียด และปฏิทิน)
export default function ServiceIcon({ icon, color, size = 44, faded = false }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: color + '1A',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: faded ? 0.45 : 1,
      }}
    >
      <MaterialCommunityIcons name={icon || 'credit-card-outline'} size={size * 0.55} color={color} />
    </View>
  );
}
