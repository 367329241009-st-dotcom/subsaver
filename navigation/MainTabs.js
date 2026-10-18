import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import SubscriptionStack from './SubscriptionStack'; // ต้อง import จาก navigation/ (Stack) ไม่ใช่จาก screens/
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MenuButton from '../components/MenuButton';
import { COLORS } from '../styles/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: 'view-dashboard-outline',
  Subscriptions: 'format-list-bulleted',
  Calendar: 'calendar-month-outline',
  Profile: 'account-circle-outline',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => <MenuButton />,
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={TAB_ICONS[route.name]} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'ภาพรวม' }} />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionStack}
        options={{ title: 'บริการของฉัน', headerShown: false }} // Stack ข้างในมี header เอง
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'ปฏิทิน' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} />
    </Tab.Navigator>
  );
}
