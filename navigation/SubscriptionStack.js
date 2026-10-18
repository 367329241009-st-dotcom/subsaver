import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SubscriptionListScreen from '../screens/SubscriptionListScreen';
import SubscriptionDetailScreen from '../screens/SubscriptionDetailScreen';
import AddEditSubscriptionScreen from '../screens/AddEditSubscriptionScreen';
import MenuButton from '../components/MenuButton';
import { COLORS } from '../styles/theme';

const Stack = createNativeStackNavigator();

// Stack: รายการ → รายละเอียด → ฟอร์มเพิ่ม/แก้ไข
export default function SubscriptionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerTintColor: COLORS.text,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="SubscriptionList"
        component={SubscriptionListScreen}
        options={{ title: 'บริการของฉัน', headerLeft: () => <MenuButton /> }}
      />
      <Stack.Screen name="SubscriptionDetail" component={SubscriptionDetailScreen} options={{ title: 'รายละเอียด' }} />
      <Stack.Screen name="AddEditSubscription" component={AddEditSubscriptionScreen} options={{ title: 'เพิ่มบริการ' }} />
    </Stack.Navigator>
  );
}
