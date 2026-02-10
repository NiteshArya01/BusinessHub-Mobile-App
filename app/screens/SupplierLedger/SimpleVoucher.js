import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SimpleVoucher = ({ billNo, setBillNo, selectedFile, onPickFile, onRemoveFile }) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Bill Number *</Text>
      <TextInput style={styles.input} placeholder="e.g. BILL-001" value={billNo} onChangeText={setBillNo} />
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '48%' }}>
          <Text style={styles.label}>Date *</Text>
          <TextInput style={styles.input} placeholder="DD/MM/YYYY" />
        </View>
        <View style={{ width: '48%' }}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput style={styles.input} placeholder="₹ 0.00" keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.label}>Remarks</Text>
      <TextInput 
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
        multiline 
        placeholder="Remarks: Mention the bill or purpose of payment..." 
      />

      <Text style={styles.label}>Bill Attachment</Text>
      {!selectedFile ? (
        <TouchableOpacity style={styles.uploadBtn} onPress={onPickFile}>
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.uploadBtnText}>Upload Bill (PDF/Image)</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.fileCard}>
          <Ionicons name={selectedFile.name.endsWith('.pdf') ? "document-text" : "image"} size={24} color="#0077cc" />
          <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
          <TouchableOpacity onPress={onRemoveFile}><Ionicons name="trash-outline" size={20} color="#e74c3c" /></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 13, color: '#7f8c8d', marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#bdc3c7', borderRadius: 10, padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, backgroundColor: '#fafafa' },
  uploadBtnText: { color: '#666' },
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef6ff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#d0e3f5' },
  fileName: { marginLeft: 10, flex: 1, fontSize: 14 }
});

export default SimpleVoucher;