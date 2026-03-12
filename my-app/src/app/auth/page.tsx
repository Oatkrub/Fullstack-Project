import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext'; // Make sure this path is correct

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  const { setUser } = useApp();
  const router = useRouter();

  // IMPORTANT: Use your computer's LOCAL IP, not localhost
  const API_URL = 'http://192.168.1.XX:5000/api/v1/auth'; 

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
        // 1. Save Token for future requests (Since Expo ignores cookies)
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }
        
        // 2. Update Global State
        setUser(data.data); 
        
        // 3. Redirect to Home
        router.replace('/');
      } else {
        Alert.alert("Auth Failed", data.error || "Check your credentials");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Connection Error", "Is your server running on your Local IP?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // You can use dark mode logic later
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'serif',
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
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
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