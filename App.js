import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  // Shuruat mein false rakhein taaki login screen dikhe
  const [isLoggedIn, setIsLoggedIn] = useState();

  // Yeh function hum Login screen ko pass karenge
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    // RootNavigator ko login status aur function bhejein
    <RootNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} />
  );
}