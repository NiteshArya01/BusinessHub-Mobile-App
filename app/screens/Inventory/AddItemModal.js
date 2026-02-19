import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Modal, Switch 
} from 'react-native';

export default function AddItemModal({ visible, onClose }) {
  const [isGstIncluded, setIsGstIncluded] = useState(false);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.flex1} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Category & Brand */}
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Category</Text>
                <TextInput style={styles.input} placeholder="Category" placeholderTextColor="#aaa" />
              </View>
              <View style={[styles.flex1, { marginLeft: 10 }]}>
                <Text style={styles.label}>Brand Name</Text>
                <TextInput style={styles.input} placeholder="e.g. Nike, HP" placeholderTextColor="#aaa" />
              </View>
            </View>
            
            <Text style={styles.label}>Product Name</Text>
            <TextInput style={styles.input} placeholder="Enter product name" placeholderTextColor="#aaa" />

            {/* Size & Color */}
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Size</Text>
                <TextInput style={styles.input} placeholder="XL, 10, 32" placeholderTextColor="#aaa" />
              </View>
              <View style={[styles.flex1, { marginLeft: 10 }]}>
                <Text style={styles.label}>Color</Text>
                <TextInput style={styles.input} placeholder="Red, Black" placeholderTextColor="#aaa" />
              </View>
            </View>

            {/* GST Rate & Toggle Section */}
            <View style={styles.row}>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.label}>GST Rate (%)</Text>
                <TextInput style={styles.input} placeholder="18" keyboardType="numeric" />
              </View>
              <View style={styles.toggleWrapper}>
                <Text style={[styles.toggleLabel, isGstIncluded ? styles.activeGst : null]}>
                  {isGstIncluded ? "Incl. GST" : "Excl. GST"}
                </Text>
                <Switch
                  trackColor={{ false: "#D1D1D1", true: "#BBDEFB" }}
                  thumbColor={isGstIncluded ? "#0077cc" : "#f4f3f4"}
                  onValueChange={() => setIsGstIncluded(previousState => !previousState)}
                  value={isGstIncluded}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>HSN Code</Text>
                <TextInput style={styles.input} placeholder="HSN" keyboardType="numeric" />
              </View>
              <View style={[styles.flex1, { marginLeft: 10 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput style={styles.input} placeholder="0" keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.label}>Purchase Rate</Text>
            <TextInput style={styles.input} placeholder="₹ 0.00" keyboardType="numeric" />

            {/* Pricing Section */}
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Wholesale Price</Text>
                <TextInput style={styles.input} placeholder="₹ 0.00" keyboardType="numeric" />
              </View>
              <View style={[styles.flex1, { marginLeft: 10 }]}>
                <Text style={styles.label}>Retail Price</Text>
                <TextInput style={styles.input} placeholder="₹ 0.00" keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.label}>Remark</Text>
            <TextInput 
              style={[styles.input, { height: 60, textAlignVertical: 'top' }]} 
              placeholder="Add any notes..." 
              multiline 
            />
            
            <TouchableOpacity style={styles.btnSave}>
              <Text style={styles.btnText}>Save Product</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  flex1: { flex: 1 },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 15, width: '100%', height: '92%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  closeBtn: { padding: 5 },
  closeText: { fontSize: 18, color: '#999' },
  scrollContent: { paddingBottom: 50 },
  label: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 5, marginTop: 12 },
  input: { backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#ECEFF1' },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  
  // Toggle Styles
  toggleWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 10, paddingBottom: 5 },
  toggleLabel: { fontSize: 11, fontWeight: 'bold', color: '#888', marginBottom: 2 },
  activeGst: { color: '#0077cc' },

  btnSave: { backgroundColor: '#0077cc', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  btnText: { fontWeight: 'bold', color: '#FFF', fontSize: 16 },
});