import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

export default function RootNavigator({ isAuthenticated, onLogin, onLogout }) {
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigator onLogout={onLogout} /> 
      ) : (
        <AuthNavigator onLogin={onLogin} />
      )}
    </NavigationContainer>
  );
}


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AuthNavigator from './AuthNavigator';
// import AppNavigator from './AppNavigator';

// export default function RootNavigator({ isAuthenticated }) {
//   return (
//     <NavigationContainer>
//       {/* If isAuthenticated is true, show Dashboard. If false, show Login. */}
//       {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// }