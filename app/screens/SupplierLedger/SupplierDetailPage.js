import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Custom Components
import LoadingSpinner from '../../components/LoadingSpinner';
import TransactionList from './TransactionList';
import PurchaseEntryModal from './PurchaseEntryModal';
import PaymentEntryModal from './PaymentEntryModal';
export default function SupplierDetailPage({ route, navigation }) {
  const { supplier } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  
  const [transType, setTransType] = useState('Purchase');
  const [showDetails, setShowDetails] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All'); 
  const [dateFilter, setDateFilter] = useState('Weekly');

  const [amount, setAmount] = useState('');
  const [billNo, setBillNo] = useState('');

  const [transactions, setTransactions] = useState([
    { id: '1', date: '05 Feb 2026', type: 'Purchase', amount: '12,000', remark: 'Bill #101', mode: '-', balType: 'Cr' },
    { id: '2', date: '06 Feb 2026', type: 'Payment', amount: '5,000', remark: 'Cash', mode: 'Cash', balType: 'Dr' },
  ]);
 
  // States to control visibility
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (type) => {
    if (type === 'Purchase') {
      setTransType(type);
      setAmount('');
      setBillNo('');
      setPurchaseModalVisible(true);
    } else if (type === 'Payment') {
      setPaymentModalVisible(true);
    }
  };

  const handleSaveEntry = () => {
    // Logic to save entry goes here
    setModalVisible(false);
    Alert.alert("Success", `${transType} added successfully`);
  };

  const handleSavePayment = (data) => {
  console.log("Payment Recorded:", data);
  // Add logic to update your balance
};

  if (isLoading) return <LoadingSpinner message={`Opening ${supplier?.name}'s Ledger...`} />;

  return (
    <View style={styles.container}>
    {/* 1. TOP HEADER (Premium Redesign) */}
    <View style={styles.topHeader}>
      {/* Supplier Title & Aligned Quick Actions */}
      <View style={styles.headerTopRow}>
        <View style={styles.nameContainer}>
          <Text style={styles.supName} numberOfLines={1}>
            {supplier?.name || 'Supplier Name'}
          </Text>
          
          {/* Wholesaler ki jagah ab Mobile Number */}
          <View style={styles.phoneBadge}>
            <Ionicons name="call-outline" size={12} color="#fff" />
            <Text style={styles.phoneText}> {supplier?.phone || '+91 00000 00000'}</Text>
          </View>
        </View>
        
        {/* Icons Aligned Perfectly */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: '#fff' }]} 
            onPress={() => {/* Call Logic */}}
          >
            <Ionicons name="call" size={18} color="#004a80" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: '#25D366' }]} 
            onPress={() => {/* WhatsApp Logic */}}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Balance Card (Same high contrast style) */}
      <View style={styles.balanceMainCard}>
        <View>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <Text style={styles.balanceAmt}>
            ₹{supplier?.amount || supplier?.balance} 
            <Text style={[styles.balTypeText, {color: supplier?.balanceType === 'Cr' ? '#d32f2f' : '#2e7d32'}]}>
              {" "}{supplier?.balanceType || 'Cr'}
            </Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.detailsMinimalBtn} 
          onPress={() => setShowDetails(!showDetails)}
        >
          <Ionicons 
            name={showDetails ? "chevron-up-circle" : "information-circle"} 
            size={28} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Collapsible Info Section (Simplified) */}
      {showDetails && (
        <View style={styles.expandedInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#444" />
            <Text style={styles.infoValue}>{supplier?.address || 'No Address'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={16} color="#444" />
            <Text style={styles.infoValue}>GST: {supplier?.gstin || 'N/A'}</Text>
          </View>
          {/* Bank Details Strip */}
          <View style={styles.bankStrip}>
            <View style={styles.bankHeader}>
              <Ionicons name="business" size={14} color="#0077cc" />
              <Text style={styles.bankLabel}> BANK DETAILS</Text>
            </View>
            <Text style={styles.bankValue}>
              {supplier?.bankName || 'HDFC Bank'} • {supplier?.accNo || 'XXXXXXXX4521'}
            </Text>
            <Text style={styles.ifscValue}>IFSC: {supplier?.ifsc || 'HDFC0001234'}</Text>
          </View>
        </View>
      )}
    </View>

      {/* 2. FILTERS */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <View style={styles.chipContainer}>
            {['All', 'Cr', 'Dr'].map(f => (
              <TouchableOpacity key={f} style={[styles.chip, typeFilter === f && styles.activeChip]} onPress={() => setTypeFilter(f)}>
                <Text style={[styles.chipText, typeFilter === f && styles.activeChipText]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.timelineBox}>
            <Picker selectedValue={dateFilter} onValueChange={(v) => setDateFilter(v)} style={styles.picker}>
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
            </Picker>
          </View>
        </View>
      </View>

      {/* 3. TRANSACTION LIST COMPONENT */}
      <TransactionList transactions={transactions} />

      {/* 4. BOTTOM ACTION BUTTONS */}
      <View style={styles.actionFooter}>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#e74c3c'}]} onPress={() => handleOpenModal('Purchase')}>
          <Text style={styles.btnText}>+ Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#2ecc71'}]} onPress={() => handleOpenModal('Payment')}>
          <Text style={styles.btnText}>- Give Payment</Text>
        </TouchableOpacity>
      </View>

      {/* 5. REUSABLE ENTRY MODAL */}
      <PurchaseEntryModal 
        visible={purchaseModalVisible}
        type={transType}
        amount={amount}
        setAmount={setAmount}
        billNo={billNo}
        setBillNo={setBillNo}
        onClose={() => setPurchaseModalVisible(false)}
        onConfirm={handleSaveEntry}
      />


       {/* Payment Entry Modal */}
      <PaymentEntryModal 
        visible={paymentModalVisible} 
        onClose={() => setPaymentModalVisible(false)} 
        onSave={handleSavePayment} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
topHeader: {
    backgroundColor: '#0077cc',//'#004a80', 
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Isse text aur icons ek hi line mein rahenge
    marginBottom: 20,
  },
  nameContainer: {
    flex: 1, // Isse naam lamba hone par icons dabenge nahi
    marginRight: 10,
  },
  supName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  phoneText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center', // Vertical alignment fix
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // Soft Shadow for Icons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceMainCard: {
    backgroundColor: '#004a80',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  balanceLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
  },
  balanceAmt: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
  },
  balTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandedInfo: {
    backgroundColor: '#f1f1f1',
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoValue: {
    color: '#333',
    fontSize: 14,
    marginLeft: 8,
  },
  bankStrip: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0077cc',
    marginTop: 5,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  bankValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  ifscValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  balanceSection: { alignItems: 'center' },
  supName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceAmt: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  balanceLabel: { color: '#d1e9ff', fontSize: 12 },
  detailsToggle: { flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, marginTop: 12 },
  detailsToggleText: { color: '#fff', fontSize: 11, marginRight: 5 },
  detailsContainer: { marginTop: 15, padding: 12, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoText: { color: '#fff', fontSize: 12, marginLeft: 5 },
  filterSection: { backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipContainer: { flexDirection: 'row', flex: 0.5 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, backgroundColor: '#f0f2f5', marginRight: 6 },
  activeChip: { backgroundColor: '#0077cc' },
  chipText: { fontSize: 12, color: '#666' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  timelineBox: { flex: 0.48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#ddd', height: 40 },
  picker: { flex: 1, transform: [{scale: 0.9}] },
  actionFooter: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 15, backgroundColor: '#fff', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#eee' },
  btn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});