import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { BASE_URL } from '../constants/api';

export default function Comments({ contentId, isDark }: { contentId: string, isDark: boolean }) {
  const { user } = useApp();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    try {
      // Replace with your local IP
      const res = await fetch(`${BASE_URL}/social/comments/${contentId}`);
      const data = await res.json();
      if (data.success) setComments(data.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => { fetchComments(); }, [contentId]);

  const postComment = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/social/comments/${contentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        fetchComments();
      }
    } catch (err) {
      console.error("Post comment error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDark ? styles.textWhite : styles.textBlack]}>
        Responses ({comments.length})
      </Text>
      
      {user && (
        <View style={[styles.inputContainer, isDark ? styles.borderDark : styles.borderLight]}>
          <TextInput
            style={[styles.input, isDark ? styles.textWhite : styles.textBlack]}
            placeholder="What are your thoughts?"
            placeholderTextColor="#71717a"
            multiline
            value={text}
            onChangeText={setText} // Mobile uses onChangeText instead of e.target.value
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={postComment} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Respond</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.list}>
        {comments.map((c: any) => (
          <View key={c._id} style={[styles.commentItem, isDark ? styles.borderDark : styles.borderLight]}>
            <Text style={[styles.commentAuthor, isDark ? styles.textWhite : styles.textBlack]}>
              {c.author?.username}
            </Text>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 32 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  inputContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  input: {
    minHeight: 80,
    textAlignVertical: 'top', // Important for Android multiline
    fontSize: 16,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'end', marginTop: 8 },
  submitBtn: { backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  submitBtnText: { color: 'white', fontWeight: '600', fontSize: 14 },
  list: { gap: 16 },
  commentItem: { borderBottomWidth: 1, paddingBottom: 12 },
  commentAuthor: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  commentText: { color: '#71717a', fontSize: 15, lineHeight: 22 },
  borderLight: { borderColor: '#e4e4e7' },
  borderDark: { borderColor: '#27272a' },
  textWhite: { color: 'white' },
  textBlack: { color: 'black' },
});