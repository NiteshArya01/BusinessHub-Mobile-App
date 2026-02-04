import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'; // Image यहाँ से इम्पोर्ट करें

export default function LoginScreen({ navigation, route }) {
  const { onLogin } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      console.log('Login success');
      if (route.params?.onLogin) {
        route.params.onLogin(); 
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ वेलकम टेक्स्ट के ऊपर इमेज */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/terabook-icon.png')} // पाथ चेक करें (src/screens/Auth के हिसाब से ../../assets)
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome to Tera Book</Text>
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
  // ✅ लोगो के लिए स्टाइल
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120, // आप अपनी पसंद के हिसाब से एडजस्ट कर सकते हैं
    height: 120,
  },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#0077cc' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#0077cc', padding: 14, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  link: { color: '#0077cc', textAlign: 'center', marginTop: 8 },
});