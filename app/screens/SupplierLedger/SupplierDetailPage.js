import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import LoadingSpinner from '../../components/LoadingSpinner'; // ✅ Component import kiya

export default function SupplierDetailPage({ route, navigation }) {
  const { supplier } = route.params;
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [transType, setTransType] = useState('Purchase');

  // Form States
  const [amount, setAmount] = useState('');
  const [billNo, setBillNo] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [date, setDate] = useState(new Date().toLocaleDateString());

  // Transaction History Data
  const [transactions, setTransactions] = useState([
    { id: '1', date: '05 Feb 2026', type: 'Purchase', amount: '12,000', remark: 'Bill #101', mode: '-' },
    { id: '2', date: '06 Feb 2026', type: 'Payment', amount: '5,000', remark: 'Cash', mode: 'Cash' },
  ]);

  // ✅ Effect to simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds tak logo pulse karega
    return () => clearTimeout(timer);
  }, []);

  const openPopup = (type) => {
    setTransType(type);
    setModalVisible(true);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transCard}>
      <View>
        <Text style={styles.transDate}>{item.date}</Text>
        <Text style={styles.transRemark}>{item.remark} ({item.mode})</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.transAmount, { color: item.type === 'Purchase' ? '#e74c3c' : '#2ecc71' }]}>
          {item.type === 'Purchase' ? `+ ₹${item.amount}` : `- ₹${item.amount}`}
        </Text>
        <Text style={styles.statusLabel}>{item.type}</Text>
      </View>
    </View>
  );

  // ✅ Loading State Check
  if (isLoading) {
    return <LoadingSpinner message={`Opening ${supplier.name}'s Ledger...`} />;
  }

  return (
    <View style={styles.container}>
      {/* 1. Top Card */}
      <View style={styles.topCard}>
        <Text style={styles.supName}>{supplier.name}</Text>
        <Text style={styles.balanceAmt}>{supplier.balance}</Text>
        <Text style={styles.balanceLabel}>Current Balance</Text>
      </View>

      <Text style={styles.secTitle}>Transaction History</Text>

      {/* 2. Transaction List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 100 }}
      />

      {/* 3. Bottom Action Buttons */}
      <View style={styles.actionFooter}>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#e74c3c'}]} onPress={() => openPopup('Purchase')}>
          <Text style={styles.btnText}>+ Purchase Maal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#2ecc71'}]} onPress={() => openPopup('Payment')}>
          <Text style={styles.btnText}>- Give Payment</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Bottom Sheet Popup */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>New {transType} Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#ccc" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={amount} onChangeText={setAmount} />

              <Text style={styles.label}>Date</Text>
              <TextInput style={styles.input} value={date} />

              <Text style={styles.label}>Bill No / Invoice</Text>
              <TextInput style={styles.input} placeholder="Enter Bill Number" value={billNo} onChangeText={setBillNo} />

              <Text style={styles.label}>Payment Mode</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={payMode} onValueChange={(v) => setPayMode(v)}>
                  <Picker.Item label="Cash" value="Cash" />
                  <Picker.Item label="UPI (PhonePe/GPay)" value="UPI" />
                  <Picker.Item label="Bank Account" value="Account" />
                  <Picker.Item label="Cheque" value="Check" />
                </Picker>
              </View>

              <TouchableOpacity style={[styles.saveBtn, {backgroundColor: transType === 'Purchase' ? '#e74c3c' : '#2ecc71'}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.saveBtnText}>Confirm {transType}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
  topCard: { backgroundColor: '#0077cc', padding: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: 'center' },
  supName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceAmt: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  balanceLabel: { color: '#d1e9ff', fontSize: 14 },
  secTitle: { fontSize: 16, fontWeight: 'bold', margin: 15 },
  transCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  transDate: { fontWeight: 'bold', fontSize: 14 },
  transRemark: { color: '#666', fontSize: 12 },
  transAmount: { fontSize: 16, fontWeight: 'bold' },
  statusLabel: { fontSize: 10, color: '#888' },
  actionFooter: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 15, backgroundColor: '#fff', justifyContent: 'space-between', elevation: 10 },
  btn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, height: '75%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 20 },
  saveBtn: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});