import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import BlogCard from '../components/BlogCard'; // The component we converted earlier
import Navigation from '../components/Navigation';
import { BASE_URL } from '../constants/api';

export default function BookmarksScreen() {
  const { user, isDark } = useApp();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with your computer's Local IP
  const API_URL = `${BASE_URL}/content/bookmarks`;

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_URL, {
          method: 'GET',
          // If your backend requires a token for bookmarks:
          // headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.success) {
          setBookmarks(data.data);
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.center, isDark ? styles.bgDark : styles.bgLight]}>
        <ActivityIndicator size="large" color={isDark ? "white" : "black"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <Navigation />
      
      <View style={styles.content}>
        <Text style={[styles.title, isDark ? styles.textWhite : styles.textBlack]}>
          Your Bookmarks
        </Text>

        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BlogCard post={item} isDark={isDark} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {user ? "No bookmarks yet." : "Sign in to see your bookmarks."}
            </Text>
          }
          contentContainerStyle={styles.listPadding}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#18181b' },
  bgLight: { backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  textWhite: { color: 'white' },
  textBlack: { color: 'black' },
  emptyText: { textAlign: 'center', color: '#71717a', marginTop: 50, fontSize: 16 },
  listPadding: { paddingBottom: 40 }
});