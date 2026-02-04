import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation, route }) {
  const { onLogin } = route.params || {}; // App.js se aane wala function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign In function
const handleSignIn = async () => {
  try {
    // Aapka login logic (Firebase/API) yahan aayega
    console.log('Login success');

    // ✅ Manual navigation ki jagah state change karein
    if (route.params?.onLogin) {
      route.params.onLogin(); 
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BusinessHub</Text>
      <Text style={styles.subtitle}>Your Smart Billing & Inventory Companion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* ✅ Login button attached to Dashboard */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#0077cc' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#0077cc', padding: 14, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  link: { color: '#0077cc', textAlign: 'center', marginTop: 8 },
});