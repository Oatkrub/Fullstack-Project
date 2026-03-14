import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  SafeAreaView, 
  RefreshControl 
} from 'react-native';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import BlogCard from '../components/BlogCard';
import { BASE_URL } from '../constants/api';

export default function HomeFeed() {
  const { isDark } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Replace with your Local IP
  const API_URL = `${BASE_URL}/content`;

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  if (loading) {
    return (
      <View style={[styles.center, isDark ? styles.bgDark : styles.bgLight]}>
        <ActivityIndicator size="large" color={isDark ? "white" : "black"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      {/* 1. TOP NAVIGATION */}
      <Navigation />

      {/* 2. THE FEED */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BlogCard post={item} isDark={isDark} />
        )}
        contentContainerStyle={styles.listContent}
        
        // 3. PULL TO REFRESH
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "white" : "black"}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLight: { backgroundColor: '#fff' },
  bgDark: { backgroundColor: '#18181b' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});