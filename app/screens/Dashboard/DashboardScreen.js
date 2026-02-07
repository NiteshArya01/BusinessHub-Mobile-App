import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DashboardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state added
  const [activeFilter, setActiveFilter] = useState('Today');
  const [showModal, setShowModal] = useState(false);
  
  // Animation Ref
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Date Picker States
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('from');

  const filters = ['Today', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

  // Simulation of API Call
  useEffect(() => {
    // Pulse Animation Start
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // 2.5 seconds baad data dikhayega
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const recentBills = [
    { id: '1', customer: 'Rahul Sharma', amount: '1,200', date: '04 Feb', status: 'Paid' },
    { id: '2', customer: 'Verma Traders', amount: '5,500', date: '03 Feb', status: 'Pending' },
    { id: '3', customer: 'Amit Gupta', amount: '850', date: '03 Feb', status: 'Paid' },
    { id: '4', customer: 'Suresh Kumar', amount: '2,100', date: '02 Feb', status: 'Paid' },
    { id: '5', customer: 'Kirana Store', amount: '3,400', date: '01 Feb', status: 'Pending' },
  ];

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === 'from') setFromDate(selectedDate);
      else setToDate(selectedDate);
    }
  };

  // --- 1. Animated Logo Loading UI ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image 
          source={require('../../../assets/logo.png')} // Path check kar lena babu
          style={[styles.loadingLogo, { transform: [{ scale: pulseAnim }] }]} 
          resizeMode="contain"
        />
        <Text style={styles.loadingText}>Fetching your business data...</Text>
      </View>
    );
  }

  // --- 2. Actual Dashboard UI ---
  return (
    <View style={{ flex: 1, backgroundColor: '#f4f7fa' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Filter Bar */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((item) => (
              <TouchableOpacity 
                key={item} 
                onPress={() => { setActiveFilter(item); if(item==='Custom') setShowModal(true); }}
                style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
              >
                <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.calendarIcon} onPress={() => setShowModal(true)}>
            <Ionicons name="calendar" size={20} color="#0077cc" />
          </TouchableOpacity>
        </View>

        {/* 2. Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard title="Total Sales" amount="45,000" icon="trending-up" color="#2ecc71" />
          <StatCard title="Total Purchase" amount="28,500" icon="cart" color="#3498db" />
          <StatCard title="Total Due" amount="12,200" icon="alert-circle" color="#e74c3c" />
          <StatCard title="Expenses" amount="4,500" icon="wallet" color="#9b59b6" />
        </View>

        {/* 3. Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitleInside}>Sales Target Progress</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} /> 
          </View>
          <Text style={styles.progressInfo}>₹33,750 reached of ₹45,000</Text>
        </View>

        {/* 4. Business Management */}
        <Text style={styles.sectionTitle}>Business Management</Text>
        <View style={styles.grid}>
          <MenuTile title="Stock List" icon="cube" color="#6c5ce7" />
          <MenuTile title="Customers" icon="people" color="#1abc9c" />
          <MenuTile title="Suppliers" icon="business" color="#e67e22" />
          <MenuTile title="Reports" icon="bar-chart" color="#f1c40f" />
        </View>

        {/* 5. Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <ActionButton title="New Sale" icon="add-circle" color="#0077cc" />
          <ActionButton title="New Purchase" icon="download" color="#2ecc71" />
          <ActionButton title="Add Expense" icon="remove-circle" color="#e74c3c" />
        </View>

        {/* 6. Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Invoices')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentBills.map((item) => (
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
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Custom Date Range</Text>
            <Text style={styles.label}>From Date:</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={() => { setPickerMode('from'); setShowPicker(true); }}>
              <Text>{fromDate.toDateString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#0077cc" />
            </TouchableOpacity>
            <Text style={styles.label}>To Date:</Text>
            <TouchableOpacity style={styles.dateSelector} onPress={() => { setPickerMode('to'); setShowPicker(true); }}>
              <Text>{toDate.toDateString()}</Text>
              <Ionicons name="calendar-outline" size={18} color="#0077cc" />
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowModal(false)}><Text style={{color:'#fff'}}>Apply</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showPicker && (
        <DateTimePicker value={pickerMode === 'from' ? fromDate : toDate} mode="date" onChange={onChangeDate} />
      )}
    </View>
  );
};

// --- Helper Components ---
const StatCard = ({ title, amount, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statAmount, { color: color }]}>₹{amount}</Text>
    </View>
    <Ionicons name={icon} size={20} color={color} />
  </View>
);

const MenuTile = ({ title, icon, color }) => (
  <TouchableOpacity style={styles.tile}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.tileLabel}>{title}</Text>
  </TouchableOpacity>
);

const ActionButton = ({ title, icon, color }) => (
  <TouchableOpacity style={[styles.actionBtn, { borderColor: color }]}>
    <Ionicons name={icon} size={18} color={color} />
    <Text style={[styles.actionText, { color: color }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // New Loading Styles
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingLogo: { width: 100, height: 100, marginBottom: 20 },
  loadingText: { fontSize: 16, color: '#0077cc', fontWeight: '500' },

  filterWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 10, elevation: 4 },
  filterScroll: { paddingLeft: 15, paddingRight: 50 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: '#f0f2f5' },
  filterBtnActive: { backgroundColor: '#0077cc' },
  filterText: { fontSize: 12, color: '#555' },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  calendarIcon: { position: 'absolute', right: 0, padding: 10, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#eee' },
  statsContainer: { padding: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 3, borderLeftWidth: 5, flexDirection: 'row', alignItems: 'center' },
  statTitle: { fontSize: 10, color: '#888', fontWeight: 'bold' },
  statAmount: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 15, marginVertical: 10 },
  sectionTitleInside: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 },
  tile: { backgroundColor: '#fff', width: '23%', paddingVertical: 15, borderRadius: 15, alignItems: 'center', elevation: 2 },
  iconBox: { padding: 8, borderRadius: 12, marginBottom: 5 },
  tileLabel: { fontSize: 10, fontWeight: 'bold', color: '#444' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10, width: '31%', borderWidth: 1, justifyContent: 'center' },
  actionText: { fontSize: 11, fontWeight: 'bold', marginLeft: 5 },
  progressSection: { marginHorizontal: 15, backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 3, marginBottom: 15 },
  progressBarBg: { height: 8, backgroundColor: '#eee', borderRadius: 10, marginTop: 10 },
  progressBarFill: { height: '100%', backgroundColor: '#2ecc71', borderRadius: 10 },
  progressInfo: { fontSize: 11, color: '#888', marginTop: 8, textAlign: 'right' },
  recentSection: { marginHorizontal: 15, backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 3 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  recentTitle: { fontSize: 15, fontWeight: 'bold' },
  viewAllText: { color: '#0077cc', fontSize: 12, fontWeight: 'bold' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { backgroundColor: '#f0f7ff', padding: 6, borderRadius: 20, marginRight: 10 },
  custName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  billDate: { fontSize: 11, color: '#aaa' },
  billRight: { alignItems: 'flex-end' },
  billAmount: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 0.45, padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#eee' },
  applyBtn: { flex: 0.45, padding: 12, backgroundColor: '#0077cc', alignItems: 'center', borderRadius: 10 }
});

export default DashboardScreen;