import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SubProvider } from './context/SubContext';
import { DialogProvider } from './context/DialogContext';
import DrawerNavigator from './navigation/DrawerNavigator';

// โครงสร้างการนำทาง:  Drawer (หน้าหลัก + 3 เมนู)
//                       └─ MainTabs (4 แท็บ)
//                            └─ SubscriptionStack (รายการ → รายละเอียด → ฟอร์ม)
// SubProvider ครอบทั้งแอป ทำให้ทุกหน้าใช้ข้อมูลชุดเดียวกัน
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubProvider>
        <DialogProvider>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </DialogProvider>
      </SubProvider>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}