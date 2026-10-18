import React from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { COLORS } from '../styles/theme';

// ปุ่ม ☰ มุมซ้ายบน — เปิด Drawer ได้จากทุกหน้า แม้จะอยู่ใน Tab หรือ Stack ซ้อนกัน
export default function MenuButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ paddingHorizontal: 16 }} hitSlop={10}>
      <MaterialCommunityIcons name="menu" size={26} color={COLORS.text} />
    </Pressable>
  );
}
