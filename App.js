import React, { useState } from 'react';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false); // Logout logic

  return (
    <RootNavigator 
      isAuthenticated={isLoggedIn} // Prop ka naam RootNavigator ke hisaab se
      onLogin={handleLogin} 
      onLogout={handleLogout} 
    />
  );
}
// import React, { useState } from 'react';
// import RootNavigator from './app/navigation/RootNavigator';

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = () => setIsLoggedIn(true); // Yeh function redirect karega

//   return <RootNavigator isLoggedIn={isLoggedIn} onLogin={handleLogin} />;
// }