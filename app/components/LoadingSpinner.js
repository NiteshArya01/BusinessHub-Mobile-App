import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

const LoadingSpinner = ({ message = "Loading..." }) => {
  // Animation value for scale
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation logic
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1, // Halka bada hoga
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Wapas normal size
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Scale transform use kiya hai ghumne ki jagah */}
      <Animated.Image 
        source={require('../../assets/logo.png')} 
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]} 
        resizeMode="contain"
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f4f7fa' 
  },
  logo: { width: 100, height: 100 },
  text: { 
    marginTop: 20, 
    color: '#0077cc', 
    fontWeight: 'bold',
    fontSize: 16 
  }
});

export default LoadingSpinner;