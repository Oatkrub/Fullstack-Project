import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// 1. Updated Import for SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../constants/api';

export default function Navigation() {
  const { user, setUser, toggleTheme, isDark } = useApp();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // For mobile, remember to clear AsyncStorage in your setUser(null) logic
      const res = await fetch(`${BASE_URL}/auth/logout`);
      if (res.ok) {
        setUser(null);
        router.replace('/auth');
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    // 2. Flattening safeArea styles
    <SafeAreaView style={StyleSheet.flatten([styles.safeArea, isDark ? styles.bgDark : styles.bgLight])} edges={['top']}>
      <View style={StyleSheet.flatten([styles.navInner, isDark ? styles.borderDark : styles.borderLight])}>
        
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text style={StyleSheet.flatten([styles.logo, isDark ? styles.textWhite : styles.textBlack])}>
              Knowledge
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={22} color={isDark ? "white" : "black"} />
          </TouchableOpacity>

          {user ? (
            <View style={styles.userControls}>
              <Link href="/create" asChild>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="create-outline" size={24} color={isDark ? "#a1a1aa" : "#71717a"} />
                </TouchableOpacity>
              </Link>

              <Link href="/bookmarks" asChild>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="bookmark-outline" size={24} color={isDark ? "#a1a1aa" : "#71717a"} />
                </TouchableOpacity>
              </Link>

              <View style={styles.divider} />

              <TouchableOpacity onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Link href="/auth" asChild>
              {/* 3. Flattening the button styles to avoid the [Slot] error */}
              <TouchableOpacity 
                style={StyleSheet.flatten([
                  styles.signInBtn, 
                  isDark ? styles.btnWhite : styles.btnBlack
                ])}
              >
                <Text style={isDark ? styles.textBlack : styles.textWhite}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // No longer need manual padding check for Android with the new SafeAreaView
  },
  bgDark: { backgroundColor: '#18181b' },
  bgLight: { backgroundColor: '#ffffff' },
  navInner: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  borderDark: { borderBottomColor: '#27272a' },
  borderLight: { borderBottomColor: '#e4e4e7' },
  logo: { fontSize: 20, fontWeight: 'bold' },
  textWhite: { color: 'white' },
  textBlack: { color: 'black' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { padding: 4 },
  divider: { width: 1, height: 20, backgroundColor: '#3f3f46', marginLeft: 4 },
  signOutText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  signInBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnBlack: { backgroundColor: 'black' },
  btnWhite: { backgroundColor: 'white' },
});