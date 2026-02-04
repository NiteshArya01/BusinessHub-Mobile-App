import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = ({ isLoggedIn, onLogin }) => {
  return (
    <NavigationContainer>
      {/* Agar login hai to App (Dashboard) dikhao, warna Auth (Login) */}
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator onLogin={onLogin} />}
    </NavigationContainer>
  );
};

export default RootNavigator;