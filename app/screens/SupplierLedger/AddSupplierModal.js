import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SuppliersController from '../../controllers/SuppliersController';
import { auth } from '../../api/firebase';

export default function AddSupplierModal({ visible, onClose, onSave, supplierToEdit }) {
  const [balanceType, setBalanceType] = useState('Cr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); 

  const [formData, setFormData] = useState({
    name: '', phone: '', gstin: '', address: '', amount: '', accNo: '', bankName: '', ifsc: ''
  });

  useEffect(() => {
    if (supplierToEdit && visible) {
      setFormData({ ...supplierToEdit, amount: supplierToEdit.amount?.toString() });
      setBalanceType(supplierToEdit.balanceType || 'Cr');
    } else if (visible) {
      setFormData({ name: '', phone: '', gstin: '', address: '', amount: '', accNo: '', bankName: '', ifsc: '' });
      setBalanceType('Cr');
      setErrors({});
    }
  }, [supplierToEdit, visible]);

  const validate = () => {
    let sErrors = {};
    
    // Name Validation
    if (!formData.name.trim()) {
      sErrors.name = "Supplier name is required!";
    }

    // Phone Validation (Checks if empty, not 10 digits, or contains non-numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      sErrors.phone = "Please enter a valid 10-digit mobile number!";
    }

    setErrors(sErrors);
    return Object.keys(sErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("User not logged in!");
      setIsSubmitting(false);
      return;
    }

    // Yahan check kar rhe hain ki ID hai ya nahi (Update vs Add)
    const supplierId = supplierToEdit?.id || null;
    
    // Controller ka correct function call: saveSupplier
    const result = await SuppliersController.saveSupplier(uid, formData, balanceType, supplierId);
    
    if (result.success) {
      onSave(); 
      onClose(); 
    } else {
      alert("Error: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{supplierToEdit ? "Edit Supplier" : "Add New Supplier"}</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput 
              style={[styles.input, errors.name && styles.inputError]} 
              placeholder="Supplier Name *" 
              value={formData.name} 
              onChangeText={(t) => { setFormData({...formData, name: t}); if(errors.name) setErrors({...errors, name: null}); }} 
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput 
              style={[styles.input, errors.phone && styles.inputError]} 
              placeholder="Phone Number *" 
              keyboardType="numeric" 
              maxLength={10}
              value={formData.phone} 
              onChangeText={(t) => { setFormData({...formData, phone: t}); if(errors.phone) setErrors({...errors, phone: null}); }} 
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <TextInput style={styles.input} placeholder="GSTIN No." value={formData.gstin} onChangeText={(t) => setFormData({...formData, gstin: t})} />
            <TextInput style={styles.input} placeholder="Address" value={formData.address} onChangeText={(t) => setFormData({...formData, address: t})} />

            <View style={styles.divider} />
            <Text style={styles.subTitle}>Opening Balance Details</Text>

            <View style={styles.balanceRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 10 }]} placeholder="Amount" keyboardType="numeric" value={formData.amount} onChangeText={(t) => setFormData({...formData, amount: t})} />
              <View style={styles.typeSelector}>
                <TouchableOpacity style={[styles.typeBtn, balanceType === 'Cr' ? styles.activeCr : null]} onPress={() => setBalanceType('Cr')}>
                  <Text style={balanceType === 'Cr' ? styles.activeText : styles.typeText}>Cr</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.typeBtn, balanceType === 'Dr' ? styles.activeDr : null]} onPress={() => setBalanceType('Dr')}>
                  <Text style={balanceType === 'Dr' ? styles.activeText : styles.typeText}>Dr</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.helperText, { color: balanceType === 'Cr' ? '#d32f2f' : '#2e7d32' }]}>
              {balanceType === 'Cr' 
                ? "* This is an outstanding payment you need to make." 
                : "* This is an advance balance or overpayment."
              }
            </Text>

            <View style={styles.divider} />
            <Text style={styles.subTitle}>Bank Details</Text>
            <TextInput style={styles.input} placeholder="Account Number" keyboardType="numeric" value={formData.accNo} onChangeText={(t) => setFormData({...formData, accNo: t})} />
            <TextInput style={styles.input} placeholder="Bank Name" value={formData.bankName} onChangeText={(t) => setFormData({...formData, bankName: t})} />
            <TextInput style={styles.input} placeholder="IFSC Code" value={formData.ifsc} onChangeText={(t) => setFormData({...formData, ifsc: t})} />

            <TouchableOpacity style={[styles.submitBtn, isSubmitting && {opacity: 0.7}]} onPress={handleSave} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{supplierToEdit ? "Update Ledger" : "Save Supplier Ledger"}</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fdfdfd' },
  inputError: { borderColor: '#ff4d4d' },
  errorText: { color: '#ff4d4d', fontSize: 11, marginTop: -10, marginBottom: 10, marginLeft: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  subTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  typeSelector: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 10, padding: 3 },
  typeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  activeCr: { backgroundColor: '#ff4d4d' },
  activeDr: { backgroundColor: '#2ecc71' },
  typeText: { color: '#666', fontWeight: 'bold' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  helperText: { fontSize: 11, color: '#999', fontStyle: 'italic', marginBottom: 15 },
  submitBtn: { backgroundColor: '#0077cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});