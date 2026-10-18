import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DEFAULT_SUBS from '../data/subscriptions';

// ข้อมูลเริ่มต้นดึงจาก GitHub (อัปโหลดไฟล์ subscriptions.json ไว้ใน repo ก่อน)
const DATA_URL = 'https://raw.githubusercontent.com/Poychutimon28/SubSaver_data/refs/heads/main/subscriptions.json';

const KEY_SUBS = '@subsaver_subs';
const KEY_SETTINGS = '@subsaver_settings';

const DEFAULT_SETTINGS = {
  userName: 'ผู้ใช้ SubSaver',
  monthlyLimit: 2500,
  currency: '฿',
  remindDays: 3,
};

const SubContext = createContext(null);

// Context = "กล่องเก็บข้อมูลกลาง" ทุกหน้าจอเรียก useSubs() เพื่ออ่าน/แก้ข้อมูลชุดเดียวกัน
export function SubProvider({ children }) {
  const [subs, setSubs] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  // ดึงข้อมูลตัวอย่างจาก GitHub ถ้าไม่สำเร็จใช้ข้อมูลในเครื่องแทน
  const fetchDefaults = async () => {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error('HTTP Error: ' + response.status);
      const data = await response.json();
      setNotice('');
      return data;
    } catch (err) {
      console.log('Load data error:', err);
      setNotice('โหลดข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ จึงใช้ข้อมูลตัวอย่างในเครื่องแทน');
      return DEFAULT_SUBS;
    }
  };

  // เปิดแอปครั้งแรก: อ่านจาก AsyncStorage ก่อน ถ้ายังไม่เคยบันทึกจึงดึงจาก GitHub
  const loadData = async () => {
    try {
      setLoading(true);
      const [savedSubs, savedSettings] = await Promise.all([
        AsyncStorage.getItem(KEY_SUBS),
        AsyncStorage.getItem(KEY_SETTINGS),
      ]);
      if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      if (savedSubs) {
        setSubs(JSON.parse(savedSubs));
      } else {
        setSubs(await fetchDefaults());
      }
    } catch (err) {
      console.log('Storage error:', err);
      setSubs(DEFAULT_SUBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // บันทึกลงเครื่องทุกครั้งที่ข้อมูลเปลี่ยน (หลังโหลดเสร็จแล้วเท่านั้น)
  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY_SUBS, JSON.stringify(subs));
  }, [subs, loading]);

  useEffect(() => {
    if (!loading) AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  }, [settings, loading]);

  // ---------- คำสั่งจัดการข้อมูล ----------
  const addSub = (sub) => {
    setSubs((prev) => [...prev, { ...sub, id: Date.now().toString(), status: 'active' }]);
  };

  const updateSub = (id, changes) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  };

  const deleteSub = (id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleCancel = (id) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'cancelled' : 'active' } : s))
    );
  };

  const updateSettings = (changes) => {
    setSettings((prev) => ({ ...prev, ...changes }));
  };

  // ล้างข้อมูลทั้งหมดแล้วโหลดข้อมูลตัวอย่างใหม่
  const resetData = async () => {
    setLoading(true);
    await AsyncStorage.multiRemove([KEY_SUBS, KEY_SETTINGS]);
    setSettings(DEFAULT_SETTINGS);
    setSubs(await fetchDefaults());
    setLoading(false);
  };

  const value = {
    subs,
    activeSubs: subs.filter((s) => s.status === 'active'),
    cancelledSubs: subs.filter((s) => s.status === 'cancelled'),
    settings,
    loading,
    notice,
    addSub,
    updateSub,
    deleteSub,
    toggleCancel,
    updateSettings,
    resetData,
  };

  return <SubContext.Provider value={value}>{children}</SubContext.Provider>;
}

export function useSubs() {
  return useContext(SubContext);
}
