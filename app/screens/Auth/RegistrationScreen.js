import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserController } from '../../controllers/UserController'; // Path check karein
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SignupScreen({ navigation }) {
  // Input States
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation States (Red Error logic ke liye)
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Red Validation Logic
  const validate = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');

    if (!businessName.trim()) {
      setNameError('Business name is required');
      isValid = false;
    } else if (businessName.length < 3) {
      setNameError('Name must be at least 3 characters');
      isValid = false;
    }

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

  const onSignupPress = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    setLoading(true);
    const result = await UserController.registerUser(email, password, businessName);
    setLoading(false);

    if (result.success) {
      navigation.navigate('Login');
    } else {
      // Agar Firebase se koi error aata hai (jaise Email already exists)
      if (result.error.includes('email')) {
        setEmailError(result.error);
      } else {
        setPasswordError(result.error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join TeraBook to manage your business efficiently</Text>

      {/* Business Name Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="Business Name"
          value={businessName}
          onChangeText={(text) => { setBusinessName(text); setNameError(''); }}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => { setEmail(text); setEmailError(''); }}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* Password Input with Eye Icon */}
      <View style={styles.inputWrapper}>
        <View style={[styles.passwordWrapper, passwordError ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={onSignupPress} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? <Text style={{fontWeight: 'bold'}}>Login</Text></Text>
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
  
  // Password Specific Wrapper
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  eyeIcon: { paddingHorizontal: 12 },

  // Error Styles
  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff9f9' },
  errorText: { color: '#ff4d4d', fontSize: 12, marginTop: 4, marginLeft: 5 },
  
  button: { backgroundColor: '#0077cc', padding: 16, borderRadius: 10, marginTop: 10, elevation: 2 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  link: { color: '#0077cc', textAlign: 'center', marginTop: 20 },
});