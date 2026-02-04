import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // TODO: integrate Firebase password reset or backend API
    console.log('Reset password for:', email);
    navigation.navigate('Login'); // redirect after reset
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9f9f9',
  },
 title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#1E2A78' },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
   button: { 
    backgroundColor: '#1E90FF', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: {
    color: '#1E2A78',
    textAlign: 'center',
    marginTop: 8,
  },
});