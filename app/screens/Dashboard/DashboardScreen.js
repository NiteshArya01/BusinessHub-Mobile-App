import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const menuItems = [
    { title: '📊 Dashboard', screen: 'DashboardHome' },
    { title: '🧾 Invoices', screen: 'Invoices' },
    { title: '📦 Stock Manager', screen: 'StockManager' },
    { title: '🤝 Supplier Ledger', screen: 'SupplierLedger' },
    { title: '🏢 Wholesale Ledger', screen: 'WholesaleLedger' },
    { title: '👤 Retail Ledger', screen: 'RetailLedger' },
    { title: '💸 Expenses', screen: 'Expenses' },
    { title: '📈 Profit & Loss', screen: 'ProfitLoss' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BusinessHub</Text>
      <Text style={styles.subtitle}>Main Menu</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.card} 
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0077cc', // BusinessHub blue
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});