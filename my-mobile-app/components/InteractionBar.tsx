import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// Ionicons is great for Heart/Bookmark icons
import { Ionicons } from '@expo/vector-icons'; 
import { useApp } from '../context/AppContext';
import { BASE_URL } from '../constants/api';
interface InteractionBarProps {
  post: any; 
  updatePostState: (updatedPost: any) => void;
}

export default function InteractionBar({ post, updatePostState }: InteractionBarProps) {
  const { user } = useApp();

  // 1. DATA NORMALIZATION (Same logic as web)
  const likedBy = post?.likedBy || [];
  const bookmarkedBy = post?.bookmarkedBy || [];

  const isLiked = user && likedBy.includes(user?._id);
  const isBookmarked = user && bookmarkedBy.includes(user?._id);
  const likesCount = likedBy.length;

  const handleToggle = async (type: 'like' | 'bookmark') => {
    if (!user) return Alert.alert("Login Required", "Please login to interact!");
    if (!post?._id) return;

    try {
      // Remember to change localhost to your IP address!
      const res = await fetch(`${BASE_URL}/social/toggle/${post._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
        // Note: Mobile fetch doesn't use 'credentials: include' for cookies easily.
        // You usually pass a token in the headers:
        // headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      const data = await res.json();
      if (data.success) {
        updatePostState(data.data); 
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (!post) {
    return <View style={styles.skeleton} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        
        {/* LIKE BUTTON */}
        <TouchableOpacity 
          onPress={() => handleToggle('like')} 
          style={styles.button}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "#ef4444" : "#71717a"} 
          />
          <Text style={[styles.countText, isLiked && styles.activeText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
        
        {/* COMMENT BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble-outline" size={22} color="#71717a" />
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
      </View>

      {/* BOOKMARK BUTTON */}
      <TouchableOpacity onPress={() => handleToggle('bookmark')}>
        <Ionicons 
          name={isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={24} 
          color={isBookmarked ? "#2563eb" : "#71717a"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e4e7', // zinc-200
    marginVertical: 24,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    color: '#71717a',
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717a',
  },
  // Ensure this part is exactly like this:
  activeText: {
    color: '#ef4444',
    fontWeight: '700',
  },
  skeleton: {
    height: 56,
    width: '100%',
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    marginVertical: 32,
  }
});