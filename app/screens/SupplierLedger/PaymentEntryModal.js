import React, { useState, useEffect } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Dimensions,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PaymentEntryModal = ({ visible, onClose, onSave, initialData = null }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Handle Edit Mode: Populate data if initialData exists ---
  useEffect(() => {
    if (initialData && visible) {
      setAmount(initialData.amount?.toString() || '');
      // Date handling: Convert string back to Date object if needed
      const [day, month, year] = initialData.date.split('/');
      setDate(new Date(year, month - 1, day));
      setPaymentMode(initialData.details?.mode || '');
      setRemarks(initialData.details?.remarks || '');
      // We don't set selectedFile here because we only track "NEW" uploads in this state
      setSelectedFile(null); 
    } else if (visible) {
      resetFields();
    }
  }, [initialData, visible]);

  const onPickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Keeping the whole asset object to pass uri, name, and mimeType
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("System Error", "Unable to access the document picker.");
    }
  };

  const onRemoveFile = () => setSelectedFile(null);

  const validateForm = () => {
    let sErrors = {};
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) sErrors.amount = "Please enter a valid amount";
    if (!date) sErrors.date = "Transaction date is required";
    if (!paymentMode) sErrors.mode = "Select a payment method";
    setErrors(sErrors);
    return Object.keys(sErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const paymentData = {
          id: initialData?.id || null, // Essential for Edit Mode
          amount: parseFloat(amount),
          date: date.toLocaleDateString('en-GB'),
          paymentMode,
          remarks: remarks.trim(),
          // Passing the OBJECT, not just the URI string
          files: selectedFile ? {
            uri: selectedFile.uri,
            mimeType: selectedFile.mimeType,
            name: selectedFile.name
          } : null,
          partyId: initialData?.partyId || initialData?.supplierId, // Ensure partyId is present
        };

        await onSave(paymentData);
        resetAndClose();
      } catch (error) {
        console.error("Submission Error:", error);
        Alert.alert("Submission Failed", "An error occurred while saving the transaction.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetFields = () => {
    setAmount('');
    setRemarks('');
    setPaymentMode('');
    setDate(new Date());
    setSelectedFile(null);
    setErrors({});
  };

  const resetAndClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.clickableOverlay} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <View style={styles.sheetContent}>
            <View style={styles.handleBar} />
            
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{initialData ? "Update Payment" : "Payment Entry"}</Text>
                <Text style={styles.subTitle}>Enter transaction details below</Text>
              </View>
              <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                <Ionicons name="close-circle" size={32} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
              
              <View style={styles.row}>
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Transaction Date *</Text>
                  <TouchableOpacity 
                    style={[styles.defaultInput, errors.date && styles.inputError]} 
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.inputText}>{date.toLocaleDateString('en-GB')}</Text>
                    <Ionicons name="calendar-outline" size={20} color={errors.date ? "#ff4d4d" : "#0077cc"} />
                  </TouchableOpacity>
                  <View style={styles.errorContainer}>{errors.date && <Text style={styles.errorText}>{errors.date}</Text>}</View>
                </View>

                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Amount (INR) *</Text>
                  <View style={[styles.defaultInput, errors.amount && styles.inputError]}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput 
                      style={styles.textInputStyle} 
                      placeholder="0.00" 
                      keyboardType="decimal-pad"
                      value={amount}
                      onChangeText={(val) => {
                        setAmount(val);
                        if(errors.amount) setErrors(prev => ({...prev, amount: null}));
                      }}
                    />
                  </View>
                  <View style={styles.errorContainer}>{errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}</View>
                </View>
              </View>

              {showPicker && (
                <DateTimePicker 
                  value={date} 
                  mode="date" 
                  display="default" 
                  onChange={(e, d) => { setShowPicker(false); if(d) setDate(d); }} 
                />
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Method *</Text>
                <View style={[styles.pickerBox, errors.mode && styles.inputError]}>
                  <MaterialCommunityIcons name="wallet-outline" size={20} color={errors.mode ? "#ff4d4d" : "#0077cc"} style={{ marginLeft: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Picker
                      selectedValue={paymentMode}
                      onValueChange={(val) => {
                        setPaymentMode(val);
                        if(errors.mode) setErrors(prev => ({...prev, mode: null}));
                      }}
                    >
                      <Picker.Item label="Select Method" value="" color="#9CA3AF" />
                      <Picker.Item label="Cash Payment" value="Cash" />
                      <Picker.Item label="UPI / Digital" value="UPI" />
                      <Picker.Item label="Bank Transfer" value="Bank" />
                      <Picker.Item label="Cheque" value="Cheque" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.errorContainer}>{errors.mode && <Text style={styles.errorText}>{errors.mode}</Text>}</View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Additional Remarks</Text>
                <TextInput 
                  style={[styles.defaultInput, styles.textArea]} 
                  placeholder="Optional notes regarding this payment..." 
                  multiline
                  value={remarks}
                  onChangeText={setRemarks}
                />
              </View>

              <Text style={styles.label}>Supporting Document (Receipt/Screenshot)</Text>
              {!selectedFile ? (
                <TouchableOpacity style={styles.uploadBtn} onPress={onPickFile}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                  <Text style={styles.uploadBtnText}>Choose Image or PDF</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.fileCard}>
                  <MaterialCommunityIcons 
                    name={selectedFile.name.toLowerCase().endsWith('.pdf') ? "file-pdf-box" : "image-area"} 
                    size={28} 
                    color="#0077cc" 
                  />
                  <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                  <TouchableOpacity onPress={onRemoveFile}>
                    <Ionicons name="trash-bin-outline" size={22} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity 
                style={[styles.saveBtn, isSubmitting && { opacity: 0.8 }]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View style={styles.loaderRow}>
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.saveBtnText}></Text>
                  </View>
                ) : (
                  <Text style={styles.saveBtnText}>{initialData ? "Update Record" : "Save Payment"}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  clickableOverlay: { ...StyleSheet.absoluteFillObject },
  keyboardView: { width: '100%' },
  sheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingBottom: 30, maxHeight: SCREEN_HEIGHT * 0.9 },
  handleBar: { width: 45, height: 5, backgroundColor: '#E5E7EB', borderRadius: 10, alignSelf: 'center', marginTop: 12, marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  sheetTitle: { fontSize: 22, fontWeight: 'bold', color: '#0077cc' },
  subTitle: { fontSize: 13, color: '#95a5a6', marginTop: 2 },
  label: { fontSize: 13, color: '#34495e', marginBottom: 6, fontWeight: '700', marginTop: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputFlex: { flex: 1, marginRight: 8 },
  defaultInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 12, paddingHorizontal: 12, height: 55, backgroundColor: '#f9f9f9' },
  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff5f5' },
  errorContainer: { height: 20, justifyContent: 'center' },
  errorText: { color: '#ff4d4d', fontSize: 11, fontWeight: '600' },
  textInputStyle: { flex: 1, fontSize: 16, color: '#000' },
  inputText: { flex: 1, fontSize: 16, color: '#000' },
  currencyPrefix: { fontSize: 16, color: '#7f8c8d', fontWeight: 'bold', marginRight: 5 },
  inputGroup: { marginBottom: 2 },
  pickerBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderRadius: 12, backgroundColor: '#f9f9f9', height: 55 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#cbd5e0', borderRadius: 12, height: 65, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  uploadBtnText: { color: '#718096', marginLeft: 10, fontSize: 14, fontWeight: '500' },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf8ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#bee3f8' },
  fileName: { flex: 1, marginLeft: 10, fontSize: 14, color: '#2b6cb0', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0077cc', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, height: 60, justifyContent: 'center', elevation: 2 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  loaderRow: { flexDirection: 'row', alignItems: 'center' }
});

export default PaymentEntryModal;