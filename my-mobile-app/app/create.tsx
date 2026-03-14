import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '../components/Navigation';
import { useApp } from '../context/AppContext';
import { BASE_URL } from '../constants/api';

export default function CreatePost() {
  const [form, setForm] = useState({ header: '', subHeader: '', content: '' });
  const [loading, setLoading] = useState(false);
  const { isDark } = useApp();
  const router = useRouter();

  // Replace with your local IP
  const API_URL = `${BASE_URL}/content`;

  const handleSubmit = async () => {
    if (!form.header || !form.content) {
      return Alert.alert("Wait!", "Please add a title and some content.");
    }

    setLoading(true);
    try {
      // Get the token you saved during login
      const token = await AsyncStorage.getItem('userToken');

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Mobile apps send the token in the header instead of cookies
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/blog/${data.data._id}`);
      } else {
        Alert.alert("Error", data.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.main, isDark ? styles.bgDark : styles.bgLight]}>
      <Navigation />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={[styles.titleInput, isDark ? styles.textWhite : styles.textBlack]}
            placeholder="Title"
            placeholderTextColor="#9ca3af"
            onChangeText={(val) => setForm({...form, header: val})}
            multiline
          />
          
          <TextInput
            style={styles.subHeaderInput}
            placeholder="Subtitle (Short description)"
            placeholderTextColor="#9ca3af"
            onChangeText={(val) => setForm({...form, subHeader: val})}
            multiline
          />

          <TextInput
            style={[styles.contentInput, isDark ? styles.textWhite : styles.textBlack]}
            placeholder="Tell your story..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            onChangeText={(val) => setForm({...form, content: val})}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.publishBtn, loading && { opacity: 0.5 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.publishText}>Publish Now</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  bgLight: { backgroundColor: '#fff' },
  bgDark: { backgroundColor: '#18181b' },
  scrollContent: { padding: 24, gap: 20 },
  textWhite: { color: '#fff' },
  textBlack: { color: '#000' },
  titleInput: {
    fontSize: 32,
    fontWeight: 'bold',
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 16,
  },
  subHeaderInput: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#6b7280',
    paddingLeft: 16,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    paddingLeft: 16,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    paddingBottom: 40,
  },
  publishBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 99,
  },
  publishText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});