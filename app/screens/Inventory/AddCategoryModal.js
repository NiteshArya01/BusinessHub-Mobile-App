import React from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Modal, KeyboardAvoidingView, Platform 
} from 'react-native';

export default function AddCategoryModal({ visible, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.flex1} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{paddingTop: 10}}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Electronics" placeholderTextColor="#aaa" />
            
            <TouchableOpacity style={styles.btnSave} onPress={onClose}>
              <Text style={styles.btnText}>Save Category</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  flex1: { flex: 1 },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 15, width: '100%', paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  closeBtn: { padding: 5 },
  closeText: { fontSize: 18, color: '#999' },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F8F9FB', padding: 14, borderRadius: 12, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#ECEFF1' },
  btnSave: { backgroundColor: '#0077cc', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  btnText: { fontWeight: 'bold', color: '#FFF', fontSize: 16 },
});