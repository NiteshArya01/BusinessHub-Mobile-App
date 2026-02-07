import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Eye icon ke liye
import { AuthController } from '../../controllers/AuthController';

export default function LoginScreen({ navigation, route }) {
  const { onLogin } = route.params || {};
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Eye toggle state
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Validation Logic (Same as before)
  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async () => {
    Keyboard.dismiss(); 
    
    if (!validate()) return;

    setLoading(true);
    const result = await AuthController.login(email, password);
    setLoading(false);

    if (result.success) {
      if (onLogin) onLogin();
    } else {
      setGeneralError(result.message || "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/terabook-icon.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Welcome to Tera Book</Text>
      <Text style={styles.subtitle}>Sign in to manage your business</Text>

      {generalError ? <Text style={styles.errorTextCenter}>{generalError}</Text> : null}

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => { setEmail(text); setEmailError(''); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* Password Input with Eye Icon */}
      <View style={styles.inputWrapper}>
        <View style={[styles.passwordWrapper, passwordError ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleSignIn} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#f9f9f9' },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 100, height: 100 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0077cc' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' },
  
  inputWrapper: { marginBottom: 15 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 14, 
    backgroundColor: '#fff',
    fontSize: 16
  },

  // ✅ Password Specific Styles (Bina existing design kharab kiye)
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  passwordInput: { 
    flex: 1, 
    padding: 14, 
    fontSize: 16 
  },
  eyeIcon: { 
    paddingHorizontal: 12 
  },

  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff9f9' },
  errorText: { color: '#ff4d4d', fontSize: 12, marginTop: 4, marginLeft: 5 },
  errorTextCenter: { 
    color: '#ff4d4d', 
    backgroundColor: '#ffe6e6', 
    padding: 10, 
    borderRadius: 8, 
    textAlign: 'center', 
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500'
  },
  
  button: { backgroundColor: '#0077cc', padding: 16, borderRadius: 10, marginTop: 10, elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  link: { color: '#0077cc', textAlign: 'center', marginTop: 20 },
});