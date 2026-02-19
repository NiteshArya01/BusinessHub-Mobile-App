import React, { useState } from 'react';
import { 
  View, Text, Modal, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, Dimensions,
  ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PaymentEntryModal = ({ visible, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Error State ---
  const [errors, setErrors] = useState({});

  // --- Validation Logic ---
  const validateForm = () => {
    let sErrors = {};

    if (!amount) {
      sErrors.amount = "Amount is required";
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      sErrors.amount = "Invalid amount";
    }

    if (!date) {
      sErrors.date = "Select a date";
    }

    if (!paymentMode) {
      sErrors.mode = "Select payment mode";
    }

    setErrors(sErrors);
    return Object.keys(sErrors).length === 0;
  };

  // --- Form Submission ---
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const paymentData = {
          type: 'Payment Out',
          amount: parseFloat(amount),
          date: date.toLocaleDateString('en-GB'),
          paymentMode,
          remarks: remarks.trim(),
          attachment: attachment ? attachment.uri : null,
          timestamp: new Date().toISOString(),
        };

        // Simulating API call or processing delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        onSave(paymentData);
        resetAndClose();
      } catch (error) {
        console.error("Submission Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetAndClose = () => {
    setAmount('');
    setRemarks('');
    setPaymentMode('');
    setDate(new Date());
    setAttachment(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.clickableOverlay} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.sheetContent}>
            <View style={styles.handleBar} />
            
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Give Payment</Text>
                <Text style={styles.subTitle}>Add payment details for Fashion Point</Text>
              </View>
              <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                <Ionicons name="close-circle" size={32} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
              
              <View style={styles.row}>
                {/* Date Section */}
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Date *</Text>
                  <TouchableOpacity 
                    style={[styles.defaultInput, errors.date && styles.inputError]} 
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.inputText}>{date ? date.toLocaleDateString('en-GB') : 'Select Date'}</Text>
                    <Ionicons name="calendar-outline" size={20} color={errors.date ? "#ff4d4d" : "#0077cc"} />
                  </TouchableOpacity>
                  <View style={styles.errorContainer}>
                    {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
                  </View>
                </View>

                {/* Amount Section */}
                <View style={styles.inputFlex}>
                  <Text style={styles.label}>Enter Amount *</Text>
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
                  <View style={styles.errorContainer}>
                    {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                  </View>
                </View>
              </View>

              {showPicker && (
                <DateTimePicker 
                  value={date} 
                  mode="date" 
                  display="default" 
                  onChange={(e, d) => {
                    setShowPicker(false); 
                    if(d) setDate(d); 
                    setErrors(prev => ({...prev, date: null}));
                  }} 
                />
              )}

              {/* Payment Mode */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Mode *</Text>
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
                      <Picker.Item label="Select Mode" value="" color="#9CA3AF" />
                      <Picker.Item label="Cash" value="Cash" />
                      <Picker.Item label="UPI / Online" value="UPI" />
                      <Picker.Item label="Bank Transfer" value="Bank" />
                      <Picker.Item label="Cheque" value="Cheque" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.errorContainer}>
                  {errors.mode && <Text style={styles.errorText}>{errors.mode}</Text>}
                </View>
              </View>

              {/* Remarks */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Remarks</Text>
                <TextInput 
                  style={[styles.defaultInput, styles.textArea]} 
                  placeholder="Any notes..." 
                  multiline
                  value={remarks}
                  onChangeText={setRemarks}
                />
              </View>

              {/* Attachment Section - Centered and Fixed */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Attachment</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={async () => {
                   let result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
                   if (!result.canceled) setAttachment(result.assets[0]);
                }}>
                  {attachment ? (
                    <View style={styles.centeredRow}>
                      <Ionicons name="document-text" size={20} color="#0077cc" />
                      <Text style={styles.attachmentName} numberOfLines={1}>{attachment.name}</Text>
                      <TouchableOpacity onPress={() => setAttachment(null)}>
                        <Ionicons name="close-circle" size={20} color="#ff4d4d" style={{ marginLeft: 8 }} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.centeredRow}>
                      <Ionicons name="cloud-upload-outline" size={22} color="#9CA3AF" />
                      <Text style={styles.uploadText}>Upload Bill (PDF/Image)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={[styles.saveBtn, isSubmitting && { opacity: 0.8 }]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Payment</Text>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  clickableOverlay: { ...StyleSheet.absoluteFillObject },
  keyboardView: { width: '100%' },
  sheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingBottom: 30, maxHeight: SCREEN_HEIGHT * 0.9 },
  handleBar: { width: 45, height: 5, backgroundColor: '#E5E7EB', borderRadius: 10, alignSelf: 'center', marginTop: 12, marginBottom: 15 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#0077cc' },
  subTitle: { fontSize: 13, color: '#6B7280' },
  label: { fontSize: 13, color: '#4B5563', marginBottom: 4, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputFlex: { flex: 1, marginRight: 8 },
  defaultInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, height: 50, backgroundColor: '#fff' },
  inputError: { borderColor: '#ff4d4d' },
  
  // Shake Fix: Reserve space for errors
  errorContainer: { height: 18, justifyContent: 'center' },
  errorText: { color: '#ff4d4d', fontSize: 11, fontWeight: '500' },
  
  textInputStyle: { flex: 1, fontSize: 16, color: '#000' },
  inputText: { flex: 1, fontSize: 16, color: '#000' },
  currencyPrefix: { fontSize: 16, color: '#6B7280', marginRight: 5 },
  inputGroup: { marginBottom: 5 },
  pickerBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, backgroundColor: '#fff', height: 50 },
  textArea: { height: 70, textAlignVertical: 'top', paddingTop: 10 },
  
  // Attachment Styling
  uploadBox: { 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#D1D5DB', 
    borderRadius: 10, 
    height: 60, 
    backgroundColor: '#F9FAFB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  centeredRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  uploadText: { color: '#9CA3AF', marginLeft: 10, fontSize: 14 },
  attachmentName: { color: '#0077cc', marginLeft: 8, fontSize: 14, fontWeight: '500', maxWidth: '70%' },
  
  saveBtn: { backgroundColor: '#0077cc', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 15, height: 55, justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});

export default PaymentEntryModal;