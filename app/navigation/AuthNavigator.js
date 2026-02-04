import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../components/Loader';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/RegistrationScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({ onLogin }) {
  return (
    <Stack.Navigator initialRouteName="Loader" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loader" component={Loader} />
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        initialParams={{ onLogin }} // Yeh zaroori hai
      />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}