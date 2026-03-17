import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { savePurchaseEntry } from '../../controllers/PurchaseController'; 

const SimpleVoucher = ({ party, onEntrySuccess, editTransaction }) => {
  const [billNo, setBillNo] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const clearForm = () => {
  setBillNo('');
  setAmount('');
  
  // New entry ke liye aaj ki date default rakhte hain
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  setDate(`${day}/${month}/${year}`);
  
  setRemarks('');
  setSelectedFile(null);
  setErrors({});
};

useEffect(() => {
  if (editTransaction) {
    // 🟢 EDIT MODE: Data fill karo
    setBillNo(editTransaction.details?.billNumber || '');
    setAmount(editTransaction.amount ? editTransaction.amount.toString() : '');
    setDate(editTransaction.date || '');
    setRemarks(editTransaction.details?.remarks || '');
    // Agar file URL hai toh use handle karein (optional)
  } else {
    // ⚪ NEW ENTRY MODE: Sab saaf kar do
    clearForm();
  }
}, [editTransaction]);



  // --- File Picking Handler ---
  const onPickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // Image aur PDF dono allow hain
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]); // Naye Expo versions mein assets array milta hai
      }
    } catch (error) {
      Alert.alert("Error", "File select karne mein dikkat hui.");
    }
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
  };


  // --- Manual Date Input Handler with Auto-Slash ---
  const handleDateChange = (text) => {
    // Sirf numbers allow karne ke liye
    let cleaned = text.replace(/\D/g, '');
    let newDate = '';

    // Auto-slash logic (DD/MM/YYYY)
    if (cleaned.length > 0) {
      newDate = cleaned.substring(0, 2);
      if (cleaned.length > 2) {
        newDate += '/' + cleaned.substring(2, 4);
      }
      if (cleaned.length > 4) {
        newDate += '/' + cleaned.substring(4, 8);
      }
    }

    setDate(newDate);

    // Validation: Agar date format complete aur sahi hai, toh error hata do
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (dateRegex.test(newDate)) {
      setErrors((prev) => ({ ...prev, date: null }));
    }
  };

  // --- Date Picker Handler ---
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formatted = `${day}/${month}/${year}`;
      setDate(formatted);
      setErrors((prev) => ({ ...prev, date: null })); // Picker se select karne par error hatana
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!billNo.trim()) tempErrors.billNo = "Enter your bill no.";
    
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!date || !dateRegex.test(date)) tempErrors.date = "Select valid date";
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      tempErrors.amount = "Enter a valid amount";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);


    const voucherData = {
      id: editTransaction?.id || null,
      partyId: party.id,
      billNo,
      date,
      amount: parseFloat(amount),
      remarks,
      type: 'Voucher',
      files:selectedFile
    };

    try {
      const result = await savePurchaseEntry(voucherData);
      if (result.success) {
        Alert.alert("Success", "Voucher recorded successfully!");
        
        onEntrySuccess();
        clearForm();
      } else {
        Alert.alert("Error", result.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Bill Number *</Text>
      <TextInput 
        style={[styles.input, errors.billNo && styles.inputError]} 
        placeholder="Enter your bill no." 
        value={billNo} 
        onChangeText={(val) => { setBillNo(val); setErrors({...errors, billNo: null}); }} 
      />
      {errors.billNo && <Text style={styles.errorText}>{errors.billNo}</Text>}
      
      <View style={styles.row}>
        {/* Date Field with Calendar Icon */}
        <View style={styles.col}>
          <Text style={styles.label}>Date *</Text>
          <View style={[styles.inputContainer, errors.date && styles.inputError]}>
            <TextInput 
              style={styles.dateInput} 
              placeholder="DD/MM/YYYY" 
              keyboardType="numeric"
              maxLength={10}
              value={date}
              onChangeText={handleDateChange}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.calendarIcon}>
              <Ionicons name="calendar-outline" size={20} color="#0077cc" />
            </TouchableOpacity>
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Enter Amount *</Text>
          <TextInput 
            style={[styles.input, errors.amount && styles.inputError]} 
            placeholder="₹ 0.00" 
            keyboardType="numeric" 
            value={amount}
            onChangeText={(val) => { setAmount(val); setErrors({...errors, amount: null}); }}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />
      )}

      <Text style={styles.label}>Remarks</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        multiline 
        placeholder="Any notes against this purchase..." 
        value={remarks}
        onChangeText={setRemarks}
      />
      {/* Bill Attachment Section */}
      <Text style={styles.label}>Bill Attachment</Text>
      {!selectedFile ? (
        <TouchableOpacity style={styles.uploadBtn} onPress={onPickFile}>
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.uploadBtnText}>Upload Bill (PDF/Image)</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.fileCard}>
          <Ionicons 
            name={selectedFile.name.toLowerCase().endsWith('.pdf') ? "document-text" : "image"} 
            size={24} 
            color="#0077cc" 
          />
          <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
          <TouchableOpacity onPress={onRemoveFile}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity 
        style={[styles.saveBtn, loading && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Voucher</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: { paddingVertical: 5 },
  label: { fontSize: 13, color: '#7f8c8d', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, marginBottom: 4, fontSize: 15, backgroundColor: '#fff' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 12, 
    backgroundColor: '#fff',
    marginBottom: 4
  },
  dateInput: { flex: 1, padding: 14, fontSize: 15 },
  calendarIcon: { paddingRight: 12 },
  inputError: { borderColor: '#ff4d4d' },
  errorText: { color: '#ff4d4d', fontSize: 11, marginBottom: 12, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: '48%' },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#0077cc', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // Naye Styles for File Upload
  uploadBtn: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderStyle: 'dashed', 
    borderRadius: 12, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#f9f9f9',
    marginBottom: 10
  },
  uploadBtnText: { marginLeft: 8, color: '#666', fontSize: 14 },
  fileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f0f7ff', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 10 
  },
  fileName: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' }
});

export default SimpleVoucher;