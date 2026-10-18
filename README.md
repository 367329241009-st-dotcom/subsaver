# SubSaver

แอปติดตามค่าสมาชิกรายเดือน (Subscription) สร้างด้วย React Native + Expo SDK 54

## โครงสร้างโปรเจกต์

```
App.js                 จุดเริ่มแอป (Drawer > Tabs > Stack)
navigation/            ตัวนำทาง Drawer / Bottom Tabs / Stack
screens/               หน้าจอทั้งหมด
components/            คอมโพเนนต์ที่ใช้ซ้ำ
context/               SubContext (ข้อมูลกลาง), DialogContext
data/ utils/ styles/   ข้อมูลตัวอย่าง ฟังก์ชันช่วย และธีม
eas.json               ตั้งค่า EAS Build (profile "preview" = ไฟล์ .apk)
```

## รันบนเครื่องตัวเอง

```bash
npm install
npx expo start
```

## Build เป็นไฟล์ APK (สำหรับ LDPlayer / มือถือ Android)

```bash
npm install -g eas-cli
eas login
eas init                                   # ครั้งแรกครั้งเดียว
eas build -p android --profile preview     # ได้ลิงก์ดาวน์โหลด .apk
```

เมื่อ build เสร็จ นำไฟล์ `.apk` ไปลากวางในหน้าต่าง LDPlayer เพื่อติดตั้ง
