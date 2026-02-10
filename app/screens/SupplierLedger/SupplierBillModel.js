import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const SupplierBillModal = ({ visible, onClose, billData }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transaction Bill</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close-circle" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {!billData ? (
              <View style={styles.noBillContainer}>
                <MaterialCommunityIcons name="file-remove-outline" size={80} color="#ccc" />
                <Text style={styles.noBillText}>No bill created or uploaded for this transaction.</Text>
              </View>
            ) : (
              <View style={styles.billPreview}>
                <MaterialCommunityIcons name="file-check" size={50} color="#2ecc71" />
                <Text style={styles.billFoundText}>Bill Found!</Text>
                <Text style={styles.fileLabel}>File: {billData.split('/').pop()}</Text>
                
                {/* Yahan Future mein Image ya PDF Viewer aayega */}
                <View style={styles.placeholderBox}>
                  <Text style={styles.placeholderText}>
                    [ Content Viewer Implementation Pending ]
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Footer Action */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    height: height * 0.7, 
    padding: 20 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noBillContainer: { alignItems: 'center' },
  noBillText: { marginTop: 15, fontSize: 16, color: '#888', textAlign: 'center', paddingHorizontal: 40 },
  billPreview: { alignItems: 'center', width: '100%' },
  billFoundText: { fontSize: 18, fontWeight: 'bold', color: '#2ecc71', marginTop: 10 },
  fileLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  placeholderBox: { 
    marginTop: 20, 
    width: '100%', 
    height: 150, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#eee', 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  placeholderText: { color: '#999', fontSize: 12 },
  closeBtn: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default SupplierBillModal;