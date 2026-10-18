import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MainTabs from './MainTabs';
import BudgetScreen from '../screens/drawer/BudgetScreen';
import ExportScreen from '../screens/drawer/ExportScreen';
import AboutScreen from '../screens/drawer/AboutScreen';
import { COLORS } from '../styles/theme';

const Drawer = createDrawerNavigator();

// Drawer: "หน้าหลัก" (บรรจุ 4 แท็บ) + 3 เมนูเสริม
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: COLORS.primary,
        drawerActiveBackgroundColor: COLORS.primaryLight,
        headerTintColor: COLORS.text,
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Drawer.Screen
        name="MainApp"
        component={MainTabs}
        options={{
          title: 'หน้าหลัก',
          headerShown: false, // แท็บมี header ของตัวเองแล้ว ไม่ให้ซ้อนกัน 2 ชั้น
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          title: 'งบประมาณ & สกุลเงิน',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="wallet-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Export"
        component={ExportScreen}
        options={{
          title: 'ส่งออกรายงาน',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="file-export-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'เกี่ยวกับ SubSaver',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="information-outline" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}
