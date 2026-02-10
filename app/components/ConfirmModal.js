import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={[styles.iconCircle, { backgroundColor: type === 'danger' ? '#fee2e2' : '#e0f2fe' }]}>
            <Ionicons 
              name={type === 'danger' ? "trash-outline" : "alert-circle-outline"} 
              size={30} 
              color={type === 'danger' ? "#ef4444" : "#0077cc"} 
            />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.confirmBtn, { backgroundColor: type === 'danger' ? '#ef4444' : '#0077cc' }]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertBox: { backgroundColor: '#fff', borderRadius: 20, padding: 25, width: '100%', alignItems: 'center', elevation: 5 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  btnRow: { flexDirection: 'row', width: '100%', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  cancelBtnText: { color: '#666', fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '600' },
});