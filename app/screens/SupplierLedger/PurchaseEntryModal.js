import React, { useState } from 'react';
import { 
  View, Text, Modal, TouchableOpacity, ScrollView, 
  StyleSheet, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import SimpleVoucher from './SimpleVoucher'; 
import InventoryBill from './InventoryBill';

const PurchaseEntryModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState('simple');
  const [billNo, setBillNo] = useState('');
  const [items, setItems] = useState([{ id: Date.now(), name: '', qty: '', price: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // --- Functions ---

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
    if (!result.canceled) setSelectedFile(result.assets[0]);
  };

  const deleteRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Jab InventoryBill ya SimpleVoucher se data finalize hoga
  const handleFinalSave = (finalData) => {
    // Yahan finalData mein items, GST, totals, etc. sab milega
    console.log("Saving Final Transaction:", finalData);
    
    Alert.alert(
      "Success", 
      `${activeTab === 'simple' ? 'Voucher' : 'Inventory Bill'} has been saved!`,
      [{ text: "OK", onPress: () => {
        resetAndClose();
      }}]
    );
  };

  const resetAndClose = () => {
    setBillNo('');
    setItems([{ id: Date.now(), name: '', qty: '', price: '' }]);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.clickableOverlay} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardView}
        >
          <View style={styles.sheetContent}>
            <View style={styles.handleBar} />
            
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>New Entry</Text>
                <Text style={styles.subTitle}>Select entry type below</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={32} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
              <TabButton 
                title="Voucher Entry" 
                active={activeTab === 'simple'} 
                onPress={() => setActiveTab('simple')} 
                icon="receipt-outline"
              />
              <TabButton 
                title="Inventory Bill" 
                active={activeTab === 'itemized'} 
                onPress={() => setActiveTab('itemized')} 
                icon="cube-outline"
              />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {activeTab === 'simple' ? (
                <View>
                  <SimpleVoucher 
                    billNo={billNo} setBillNo={setBillNo}
                    selectedFile={selectedFile} onPickFile={pickDocument}
                    onRemoveFile={() => setSelectedFile(null)}
                  />
                  {/* Simple Entry ke liye direct Save button */}
                  <TouchableOpacity 
                    style={styles.saveBtn} 
                    onPress={() => handleFinalSave({ type: 'voucher', billNo, file: selectedFile })}
                  >
                    <Text style={styles.saveBtnText}>Save Voucher</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Inventory Bill khud apna Preview aur Save handle karega */
                <InventoryBill 
                  items={items} 
                  onAddRow={() => setItems([...items, { id: Date.now(), name: '', qty: '', price: '' }])} 
                  onDeleteRow={deleteRow}
                  onUpdateItem={updateItem}
                  onSave={handleFinalSave}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// Helper for Tab Buttons
const TabButton = ({ title, active, onPress, icon }) => (
  <TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
    <Ionicons name={icon} size={18} color={active ? '#0077cc' : '#7f8c8d'} style={{ marginRight: 6 }} />
    <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
  },
  clickableOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: { 
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheetContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    paddingHorizontal: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 10, 
    maxHeight: '92%', 
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  handleBar: {
    width: 45,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  sheetHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 16, fontWeight: 'bold', color: '#0077cc' },
  subTitle: { fontSize: 13, color: '#7f8c8d', marginTop: -2 },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#f2f4f7', 
    borderRadius: 14, 
    padding: 4, 
    marginBottom: 20 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  activeTab: { 
    backgroundColor: '#fff', 
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 }
  },
  tabText: { color: '#7f8c8d', fontWeight: '600', fontSize: 13 },
  activeTabText: { color: '#0077cc' },
  saveBtn: { 
    backgroundColor: '#0077cc', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: Platform.OS === 'android' ? 10 : 0,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default PurchaseEntryModal;