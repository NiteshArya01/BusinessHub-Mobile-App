import React, { useState } from 'react';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true); // Yeh function redirect karega

  return <RootNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} />;
}