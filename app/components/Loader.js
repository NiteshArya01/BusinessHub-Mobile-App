import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function Leader({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Home after animation
      setTimeout(() => {
        navigation.replace('Login');
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.icon}>📘∞</Text>
      </Animated.View>

    
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Tera Book
      </Animated.Text>

    
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Accounting for the Infinite Era
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark mode background
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 64,
    color: '#007BFF', // Vibrant blue
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
});