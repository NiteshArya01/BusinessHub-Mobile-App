import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const UpdateStockModal = ({ visible, item, onClose, onUpdate }) => {
  const [updateType, setUpdateType] = useState('Add'); 
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('Stock Inward');

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.flex1} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          {/* Header Section */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Stock</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Product Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.pName}>{item.name}</Text>
              <View style={styles.pDetailRow}>
                <Text style={styles.pDetailText}>Current Stock: <Text style={styles.boldText}>{item.quantity} pcs</Text></Text>
                <View style={styles.dotSeparator} />
                <Text style={styles.pDetailText}>HSN: <Text style={styles.boldText}>{item.hsn}</Text></Text>
              </View>
            </View>

            {/* Update Type Selector */}
            <Text style={styles.inputLabel}>Update Type *</Text>
            <View style={styles.tabContainer}>
              {['Add', 'Remove', 'Set'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.tabBtn, updateType === type && styles.tabBtnActive]}
                  onPress={() => setUpdateType(type)}
                >
                  <Text style={[styles.tabText, updateType === type && styles.tabTextActive]}>
                    {type} Stock
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity Input */}
            <Text style={styles.inputLabel}>Quantity *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 10"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Reason Selection */}
            <Text style={styles.inputLabel}>Reason *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. New Purchase"
              value={reason}
              onChangeText={setReason}
            />

            {/* Save Button - Pattern matched with Save Category */}
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => {
                onUpdate(item.id, { updateType, quantity, reason });
                onClose();
              }}
            >
              <Text style={styles.saveButtonText}>Update Stock</Text>
            </TouchableOpacity>
            
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  flex1: { flex: 1 },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 15, width: '100%', maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  closeBtn: { padding: 5 },
  closeText: { fontSize: 18, color: '#999' },
  scrollContent: { paddingBottom: 40 },
  summaryCard: { backgroundColor: '#F8F9FB', padding: 15, borderRadius: 15, marginTop: 20, borderWidth: 1, borderColor: '#ECEFF1' },
  pName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  pDetailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  pDetailText: { fontSize: 13, color: '#666' },
  boldText: { fontWeight: 'bold', color: '#333' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CCC', marginHorizontal: 10 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 8, marginTop: 20 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#F5F7FA', marginHorizontal: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  tabBtnActive: { backgroundColor: '#E3F2FD', borderColor: '#0077cc' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#888' },
  tabTextActive: { color: '#0077cc' },
  textInput: { backgroundColor: '#F8F9FB', padding: 14, borderRadius: 12, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#ECEFF1' },
  saveButton: { backgroundColor: '#0077cc', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default UpdateStockModal;