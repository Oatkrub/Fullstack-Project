import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function BlogCard({ post, isDark }: { post: any, isDark: boolean }) {
  return (
    <View style={[styles.container, isDark ? styles.borderDark : styles.borderLight]}>
      
      {/* Author Top Left */}
      <View style={styles.authorRow}>
        <View style={styles.avatarPlaceholder} />
        <Text style={[styles.username, isDark ? styles.textWhite : styles.textBlack]}>
          {post.author.username}
        </Text>
      </View>

      {/* Content Area - Wrapped in Link with asChild */}
      <Link href={`/blog/${post._id}`} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.title, isDark ? styles.textWhite : styles.textBlack]}>
            {post.header}
          </Text>
          <Text 
            style={styles.subHeader} 
            numberOfLines={2} // This replaces 'line-clamp-2'
          >
            {post.subHeader}
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{post.readingTime} min read</Text>
        <Text style={styles.footerText}>•</Text>
        <Text style={styles.footerText}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  borderLight: { borderBottomColor: '#f3f4f6' }, // gray-100
  borderDark: { borderBottomColor: '#27272a' },  // zinc-800
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  subHeader: {
    fontSize: 16,
    color: '#71717a',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af', // gray-400
  },
  textWhite: { color: '#ffffff' },
  textBlack: { color: '#000000' },
});