import React from 'react';
import { StyleSheet, View, Text,TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigator import karein
import { Ionicons } from '@expo/vector-icons'; // Icons ke liye


// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import InvoicesScreen from '../screens/Invoices/InvoicesScreen';
import StockManagerScreen from '../screens/Inventory/StockManagerScreen';
import SupplierLedgerScreen from '../screens/SupplierLedger/SupllierLedgerScreen';
import SupplierDetailPage from '../screens/SupplierLedger/SupplierDetailPage';
import WholesaleLedgerScreen from '../screens/WholesaleLedger/WholesaleLedgerScreen';
import RetailLedgerScreen from '../screens/RetailLedger/RetailLedgerScreen';
import ExpensesScreen from '../screens/Expenses/ExpensesScreen';
import ProfitLossScreen from '../screens/Profit&Loss/ProfitLossScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


// AppNavigator.js ke andar SupplierStack ko aise update karein
function SupplierStack({ navigation }) {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true, // Hum Stack ka header use karenge
        headerStyle: { backgroundColor: '#0077cc' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="SupplierLedgerMain" 
        component={SupplierLedgerScreen} 
        options={{ 
          title: 'Supplier Ledger',
          // ✅ Yahan Menu button manually add karenge takki Drawer khul sake
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{marginLeft: 15}}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen 
        name="SupplierDetailPage" 
        component={SupplierDetailPage} 
        options={{ title: 'Supplier Detail' }} // Yahan auto Back button aayega
      />
    </Stack.Navigator>
  );
}

// 1. Custom Drawer Design (Logo aur Name ke liye)
function CustomDrawerContent(props) {
  // Yeh function App.js ki state ko wapas false kar dega
  const handleLogout = () => {
    // RootNavigator se pass kiya gaya onLogout
    if (props.onLogout) {
      props.onLogout();
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* Header Section (Jo humne pehle banaya tha) */}
        <View style={styles.drawerHeader}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileLetter}>B</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.businessName}>TeraBook</Text>
            <Text style={styles.userRole}>Admin Account</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <DrawerItemList {...props} />

        {/* Purchase Plan Card (Aapki screenshot jaisa) */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>TeraBook</Text>
          <Text style={styles.planSubtitle}>Accounting for the infinite Era.</Text>
          <TouchableOpacity style={styles.planButton}>
            <Text style={styles.planButtonText}>Purchase Plan</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button Section at Bottom */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#e91e63" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppNavigator({ onLogout }) {
  return (
    <Drawer.Navigator 
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0077cc', 
          elevation: 5,
          shadowOpacity: 0.3,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        drawerActiveTintColor: '#0077cc',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 15, fontWeight: '500', marginLeft: -10 }, // Icon ke saath alignment
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Invoices" 
        component={InvoicesScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Stock Manager" 
        component={StockManagerScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Supplier Ledger" 
        component={SupplierStack}
       options={{ 
    headerShown: false, // ❌ Drawer ka header band kar diya
    drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> 
  }}
      />
      <Drawer.Screen 
        name="Wholesale Ledger" 
        component={WholesaleLedgerScreen} 
       options={{ 
          headerShown: false, // ✅ Drawer ka "ganda" header band kar diya
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> 
        }}
      />
      <Drawer.Screen 
        name="Retail Ledger" 
        component={RetailLedgerScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Expenses" 
        component={ExpensesScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Profit & Loss" 
        component={ProfitLossScreen} 
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="trending-up-outline" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#0077cc',
    height: 150,
    alignItems: 'center',
    justifyContent: 'left',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: -5, // ScrollView ke gap ko fill karne ke liye
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLetter: {
    color: '#0077cc',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  businessName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#d1e9ff',
    fontSize: 12,
  },
  planCard: {
    backgroundColor: '#f0f4ff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d9ff',
  },
  planTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc', marginBottom: 5 },
  planSubtitle: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 15 },
  planButton: {
    backgroundColor: '#4c4ce6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  planButtonText: { color: '#fff', fontWeight: 'bold' },
  
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
    marginBottom: 20, // Bottom se thoda gap
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f7', // Light red tint
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#e91e63',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});