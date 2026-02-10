import React, { useState } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentEntryModal = ({ visible, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB')); // Default today's date
  const [paymentMode, setPaymentMode] = useState('Cash'); // Cash, Online, Cheque
  const [remarks, setRemarks] = useState('');

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const paymentData = {
      type: 'Payment Out',
      amount: parseFloat(amount),
      date,
      paymentMode,
      remarks,
      timestamp: new Date().toISOString(),
    };

    onSave(paymentData);
    resetAndClose();
  };

  const resetAndClose = () => {
    setAmount('');
    setRemarks('');
    setPaymentMode('Cash');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.clickableOverlay} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <View style={styles.sheetContent}>
            <View style={styles.handleBar} />
            
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Give Payment</Text>
                <Text style={styles.subTitle}>Record payment to supplier</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="#ccc" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              
              {/* Amount Input */}
              <Text style={styles.label}>Amount Paid (₹)</Text>
              <TextInput 
                style={[styles.input, styles.amountInput]} 
                placeholder="0.00" 
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor="#999"
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput 
                    style={styles.input} 
                    value={date}
                    onChangeText={setDate}
                    placeholder="DD/MM/YYYY"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Payment Mode</Text>
                  <View style={styles.modeContainer}>
                    {['Cash', 'Online'].map((mode) => (
                      <TouchableOpacity 
                        key={mode}
                        style={[styles.modeBtn, paymentMode === mode && styles.activeMode]}
                        onPress={() => setPaymentMode(mode)}
                      >
                        <Text style={[styles.modeText, paymentMode === mode && styles.activeModeText]}>{mode}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Remarks / Reference</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                multiline 
                numberOfLines={3}
                placeholder="Payment against Bill #104, Advance, etc." 
                placeholderTextColor="#999"
                value={remarks}
                onChangeText={setRemarks}
              />

              {/* Helpful Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={18} color="#2ecc71" />
                <Text style={styles.infoText}>
                  This will reduce your balance with the supplier.
                </Text>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Confirm Payment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  clickableOverlay: { ...StyleSheet.absoluteFillObject },
  keyboardView: { width: '100%', justifyContent: 'flex-end' },
  sheetContent: { 
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, 
    paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 15, 
    maxHeight: '80%', width: '100%', elevation: 20 
  },
  handleBar: { width: 45, height: 5, backgroundColor: '#e0e0e0', borderRadius: 10, alignSelf: 'center', marginTop: 12, marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 22, fontWeight: 'bold', color: '#2ecc71' }, // Green for payment/money out
  subTitle: { fontSize: 13, color: '#7f8c8d' },
  label: { fontSize: 13, color: '#7f8c8d', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16, color: '#333' },
  amountInput: { fontSize: 24, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  modeContainer: { flexDirection: 'row', backgroundColor: '#f2f2f2', borderRadius: 10, padding: 4, height: 50 },
  modeBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  activeMode: { backgroundColor: '#fff', elevation: 2 },
  modeText: { fontSize: 13, color: '#7f8c8d', fontWeight: '600' },
  activeModeText: { color: '#2ecc71' },
  textArea: { height: 80, textAlignVertical: 'top' },
  infoBox: { flexDirection: 'row', backgroundColor: '#f0faf5', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  infoText: { marginLeft: 10, fontSize: 12, color: '#27ae60', flex: 1 },
  saveBtn: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});

export default PaymentEntryModal;