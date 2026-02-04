import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  
  // Recent 5 Bills ke liye data
  const recentBills = [
    { id: '1', customer: 'Rahul Sharma', amount: '1,200', date: '04 Feb', status: 'Paid' },
    { id: '2', customer: 'Verma Traders', amount: '5,500', date: '03 Feb', status: 'Pending' },
    { id: '3', customer: 'Amit Gupta', amount: '850', date: '03 Feb', status: 'Paid' },
    { id: '4', customer: 'Suresh Kumar', amount: '2,100', date: '02 Feb', status: 'Paid' },
    { id: '5', customer: 'Kirana Store', amount: '3,400', date: '01 Feb', status: 'Pending' },
    // Agar data 5 se zyada bhi ho, toh hum sirf 5 hi dikhayenge
  ];

  return (
    // ✅ Pura screen scrollable banane ke liye ScrollView
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. Statistics Cards (2x2 Grid) */}
      <View style={styles.statsContainer}>
        <StatCard title="Total Sales" amount="45,000" icon="trending-up" color="#2ecc71" />
        <StatCard title="Total Purchase" amount="28,500" icon="cart" color="#3498db" />
        <StatCard title="Total Due" amount="12,200" icon="alert-circle" color="#e74c3c" />
        <StatCard title="Low Stock" amount="08 Items" icon="warning" color="#f39c12" />
      </View>

      {/* 2. Quick Menu Grid (4 Icons in Row) */}
      <Text style={styles.sectionTitle}>Quick Menu</Text>
      <View style={styles.grid}>
        <MenuTile title="Invoices" icon="document-text" color="#0077cc" onPress={() => navigation.navigate('Invoices')} />
        <MenuTile title="Stock" icon="cube" color="#6c5ce7" onPress={() => navigation.navigate('Stock Manager')} />
        <MenuTile title="Suppliers" icon="people" color="#1abc9c" onPress={() => navigation.navigate('Supplier Ledger')} />
        <MenuTile title="Retailers" icon="person" color="#e67e22" onPress={() => navigation.navigate('Retail Ledger')} />
      </View>

      {/* 3. Recent 5 Bills Section (Professional Look) */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent 5 Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Invoices')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Sirf pehle 5 items dikhane ke liye .slice(0, 5) */}
        {recentBills.slice(0, 5).map((item) => (
          <View key={item.id} style={styles.billRow}>
            <View style={styles.billLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="receipt" size={18} color="#0077cc" />
              </View>
              <View>
                <Text style={styles.custName}>{item.customer}</Text>
                <Text style={styles.billDate}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.billRight}>
              <Text style={styles.billAmount}>₹{item.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Paid' ? '#e8f5e9' : '#ffebee' }]}>
                <Text style={[styles.statusText, { color: item.status === 'Paid' ? '#2ecc71' : '#e74c3c' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* Thoda niche gap scroll ke liye */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// --- Child Components ---

const StatCard = ({ title, amount, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statAmount, { color: color }]}>₹{amount}</Text>
    </View>
    <Ionicons name={icon} size={22} color={color} />
  </View>
);

const MenuTile = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.tileLabel}>{title}</Text>
  </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
  statsContainer: { padding: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 12, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 3, borderLeftWidth: 4,
  },
  statTitle: { fontSize: 11, color: '#888', fontWeight: '600' },
  statAmount: { fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 15, marginBottom: 10, color: '#333' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 },
  tile: { backgroundColor: '#fff', width: '23%', paddingVertical: 12, borderRadius: 12, alignItems: 'center', elevation: 2 },
  iconBox: { padding: 8, borderRadius: 10, marginBottom: 5 },
  tileLabel: { fontSize: 10, fontWeight: 'bold', color: '#555' },

  recentSection: { marginHorizontal: 15, backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 4 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  recentTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  viewAllText: { color: '#0077cc', fontSize: 12, fontWeight: 'bold' },
  
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { backgroundColor: '#f0f7ff', padding: 8, borderRadius: 20, marginRight: 12 },
  custName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  billDate: { fontSize: 11, color: '#aaa' },
  billRight: { alignItems: 'flex-end' },
  billAmount: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
});

export default DashboardScreen;