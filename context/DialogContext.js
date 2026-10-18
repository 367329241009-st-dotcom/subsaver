import React, { createContext, useContext, useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { COLORS } from '../styles/theme';

// กล่องแจ้งเตือน/ยืนยันที่สร้างเอง ใช้แทน Alert.alert
// เหตุผล: Alert.alert ไม่ทำงานบน Web (พรีวิว Web ของ Snack) แต่ Modal ทำงานได้ทุกแพลตฟอร์ม
const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const close = () => setDialog(null);

  // แจ้งเตือนธรรมดา มีปุ่ม "ตกลง" ปุ่มเดียว
  const showMessage = (title, message) => {
    setDialog({ title, message, buttons: [{ text: 'ตกลง', primary: true }] });
  };

  // ขอยืนยันก่อนทำ เช่น ลบข้อมูล
  const confirm = (title, message, confirmText, onConfirm, danger = true) => {
    setDialog({
      title,
      message,
      buttons: [
        { text: 'ยกเลิก' },
        { text: confirmText, primary: true, danger, onPress: onConfirm },
      ],
    });
  };

  return (
    <DialogContext.Provider value={{ showMessage, confirm }}>
      {children}
      <Modal visible={!!dialog} transparent animationType="fade" onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 20, width: '100%', maxWidth: 360 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>{dialog?.title}</Text>
            {dialog?.message ? (
              <Text style={{ fontSize: 15, color: COLORS.textSecondary, marginTop: 8, lineHeight: 22 }}>{dialog.message}</Text>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              {dialog?.buttons.map((b) => (
                <Pressable
                  key={b.text}
                  onPress={() => {
                    close();
                    if (b.onPress) b.onPress();
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                    marginLeft: 8,
                    backgroundColor: b.primary ? (b.danger ? COLORS.danger : COLORS.primary) : COLORS.background,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: b.primary ? '#fff' : COLORS.text }}>{b.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
