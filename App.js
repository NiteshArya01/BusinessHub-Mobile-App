// import React from 'react';
// import AppNavigator from './app/navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }

import React, { useState } from 'react';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  // Filhal check karne ke liye false rakha hai (Login screen dikhegi)
  // Jab login ho jaye toh ise true kar dena
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <RootNavigator isLoggedIn={isLoggedIn} />;
}