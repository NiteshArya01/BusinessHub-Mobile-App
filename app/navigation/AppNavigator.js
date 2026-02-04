import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
// import InvoicesScreen from '../screens/Invoices/InvoicesScreen';
// import StockManagerScreen from '../screens/Inventory/StockManagerScreen';
// import SupplierLedgerScreen from '../screens/Ledger/SupplierLedgerScreen';
// import WholesaleLedgerScreen from '../screens/Ledger/WholesaleLedgerScreen';
// import RetailLedgerScreen from '../screens/Ledger/RetailLedgerScreen';
// import ExpensesScreen from '../screens/Analysis/ExpensesScreen';
// import ProfitLossScreen from '../screens/Analysis/ProfitLossScreen';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="📊 Dashboard" component={DashboardScreen} />
      {/* <Drawer.Screen name="🧾 Invoices" component={InvoicesScreen} />
      <Drawer.Screen name="📦 Stock Manager" component={StockManagerScreen} />
      <Drawer.Screen name="🤝 Supplier Ledger" component={SupplierLedgerScreen} />
      <Drawer.Screen name="🏢 Wholesale Ledger" component={WholesaleLedgerScreen} />
      <Drawer.Screen name="👤 Retail Ledger" component={RetailLedgerScreen} />
      <Drawer.Screen name="💸 Expenses" component={ExpensesScreen} />
      <Drawer.Screen name="📈 Profit & Loss" component={ProfitLossScreen} /> */}
    </Drawer.Navigator>
  );
}
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Loader from '../components/Loader';
// import LoginScreen from '../screens/Auth/LoginScreen';
// import SignupScreen from '../screens/Auth/RegistrationScreen';
// import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
// import DashboardScreen from '../screens/Dashboard/DashboardScreen';

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Loader" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Loader" component={Loader} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }}/>
//         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }}/>
//         <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;