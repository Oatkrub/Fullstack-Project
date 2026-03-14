import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext'; 
import { BASE_URL } from '../constants/api';
export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  const { setUser } = useApp();
  const router = useRouter();

  const API_URL = `${BASE_URL}/auth`; 

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          // Store token for future API calls
          await AsyncStorage.setItem('userToken', data.token);
        }
        setUser(data.data); 
        router.replace('/'); 
      } else {
        Alert.alert("Auth Failed", data.error || "Check your credentials");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Connection Error", "Ensure server is running on your Local IP");
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView prevents the keyboard from hiding the input fields
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Knowledge'}</Text>

        <View style={styles.form}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#71717a"
              onChangeText={(val) => setFormData({ ...formData, username: val })}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#71717a"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(val) => setFormData({ ...formData, email: val })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#71717a"
            secureTextEntry
            onChangeText={(val) => setFormData({ ...formData, password: val })}
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Use flexGrow for ScrollView children
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  button: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchBtn: {
    marginTop: 25,
  },
  switchText: {
    textAlign: 'center',
    color: '#71717a',
    fontSize: 14,
  },
});