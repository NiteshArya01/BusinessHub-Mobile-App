import React, { useState, useMemo } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, Modal, SafeAreaView, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Kapda Dukan Item List ---
const GARMENTS_DATA = [
  { id: '1', name: 'Cotton Shirt - Full', price: '850' },
  { id: '2', name: 'Denim Jeans (Blue)', price: '1200' },
  { id: '3', name: 'T-Shirt (Round Neck)', price: '450' },
  { id: '4', name: 'Designer Saree', price: '2500' },
  { id: '5', name: 'Kids Wear Set', price: '650' },
  { id: '6', name: 'Formal Trousers', price: '950' },
  { id: '7', name: 'Kurta Pajama Set', price: '1500' },
  { id: '8', name: 'Lehenga Choli', price: '4500' },
];

const InventoryBill = ({ items, onAddRow, onDeleteRow, onUpdateItem, onSave }) => {
  const [discount, setDiscount] = useState('0');
  const [isPreview, setIsPreview] = useState(false);
  
  // Picker States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Functions ---
  const openPicker = (rowId) => {
    setActiveRowId(rowId);
    setPickerVisible(true);
  };

  const selectItem = (item) => {
    onUpdateItem(activeRowId, 'name', item.name);
    onUpdateItem(activeRowId, 'price', item.price); 
    setPickerVisible(false);
    setSearchQuery('');
  };

  const filteredInventory = GARMENTS_DATA.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Calculations ---
  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => {
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.price) || 0;
      return acc + (q * p);
    }, 0);

    const cgst = subtotal * 0.025; // 2.5%
    const sgst = subtotal * 0.025; // 2.5%
    const discAmount = parseFloat(discount) || 0;
    const netTotal = (subtotal + cgst + sgst) - discAmount;
    const roundedTotal = Math.round(netTotal);
    const roundOff = (roundedTotal - netTotal).toFixed(2);

    return { subtotal, cgst, sgst, discAmount, roundedTotal, roundOff };
  }, [items, discount]);

  // --- PREVIEW SCREEN UI ---
  if (isPreview) {
    return (
      <View style={styles.previewContainer}>
        <Text style={styles.previewHeader}>Bill Summary Preview</Text>
        <View style={styles.previewTable}>
          {items.map((item, i) => (
            <View key={i} style={styles.previewRow}>
              <Text style={styles.previewText}>{item.name || 'Unnamed'} x {item.qty || 0}</Text>
              <Text style={styles.previewText}>₹{(parseFloat(item.qty) * parseFloat(item.price) || 0).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <SummaryLine label="Subtotal" value={totals.subtotal} />
          <SummaryLine label="CGST (2.5%)" value={totals.cgst} />
          <SummaryLine label="SGST (2.5%)" value={totals.sgst} />
          <SummaryLine label="Discount" value={-totals.discAmount} color="#e74c3c" />
          <SummaryLine label="Round Off" value={totals.roundOff} />
          <View style={[styles.previewRow, { marginTop: 10 }]}>
            <Text style={styles.totalLabelLarge}>Grand Total</Text>
            <Text style={styles.totalAmountLarge}>₹{totals.roundedTotal}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsPreview(false)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finalSaveBtn} onPress={() => onSave({ items, totals })}>
            <Ionicons name="checkmark-done" size={20} color="#fff" />
            <Text style={styles.finalSaveBtnText}>Confirm Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- MAIN ENTRY SCREEN UI ---
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Itemized Garment Entry</Text>
      
      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          {/* Item Selector Box */}
          <TouchableOpacity 
            style={[styles.rowInput, { flex: 2, flexDirection: 'row', justifyContent: 'space-between' }]}
            onPress={() => openPicker(item.id)}
          >
            <Text numberOfLines={1} style={{ color: item.name ? '#333' : '#999', fontSize: 13 }}>
              {item.name || "Select Clothes"}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#999" />
          </TouchableOpacity>

          <TextInput 
            style={[styles.rowInput, { flex: 0.7, marginHorizontal: 5 }]} 
            placeholder="Qty" 
            keyboardType="numeric"
            value={item.qty}
            onChangeText={(val) => onUpdateItem(item.id, 'qty', val)}
          />

          <TextInput 
            style={[styles.rowInput, { flex: 1 }]} 
            placeholder="Price" 
            keyboardType="numeric"
            value={item.price}
            onChangeText={(val) => onUpdateItem(item.id, 'price', val)}
          />

          {items.length > 1 && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDeleteRow(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={onAddRow}>
        <Ionicons name="add-circle" size={18} color="#0077cc" />
        <Text style={styles.addBtnText}>Add Row</Text>
      </TouchableOpacity>

      <View style={styles.adjContainer}>
        <Text style={styles.adjLabel}>Discount (₹)</Text>
        <TextInput 
          style={styles.adjInput} 
          placeholder="0" 
          keyboardType="numeric"
          value={discount}
          onChangeText={setDiscount}
        />
      </View>

      <View style={styles.totalBox}>
        <View>
          <Text style={styles.gstInfo}>GST (5%): ₹{(totals.cgst + totals.sgst).toFixed(2)}</Text>
          <Text style={styles.totalLabel}>Grand Total</Text>
        </View>
        <Text style={styles.totalAmount}>₹{totals.roundedTotal}</Text>
      </View>

      <TouchableOpacity style={styles.previewBtn} onPress={() => setIsPreview(true)}>
        <Text style={styles.previewBtnText}>Save & Preview</Text>
      </TouchableOpacity>

      {/* --- ITEM SELECTOR MODAL --- */}
      <Modal visible={pickerVisible} animationType="slide" transparent={true}>
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Garment</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search clothes (Shirt, Jeans...)" 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList 
              data={filteredInventory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.itemOption} onPress={() => selectItem(item)}>
                  <View>
                    <Text style={styles.itemOptionText}>{item.name}</Text>
                    <Text style={styles.itemOptionPrice}>Std. Rate: ₹{item.price}</Text>
                  </View>
                  <Ionicons name="add" size={20} color="#0077cc" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper for Preview Lines
const SummaryLine = ({ label, value, color = '#2c3e50' }) => (
  <View style={styles.previewRow}>
    <Text style={[styles.previewSubText, { color }]}>{label}</Text>
    <Text style={[styles.previewSubText, { color }]}>₹{parseFloat(value).toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  formSection: { paddingVertical: 5 },
  label: { fontSize: 13, color: '#7f8c8d', marginBottom: 10, fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rowInput: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#fff', alignItems: 'center' },
  deleteBtn: { marginLeft: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  addBtnText: { color: '#0077cc', fontWeight: 'bold', marginLeft: 5 },
  
  adjContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 5 },
  adjLabel: { fontSize: 14, color: '#2c3e50' },
  adjInput: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 8, width: 80, textAlign: 'right' },

  totalBox: { 
    marginTop: 20, padding: 15, backgroundColor: '#f0f7ff', borderRadius: 15, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#d0e3f5' 
  },
  gstInfo: { fontSize: 11, color: '#5dade2' },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#27ae60' },

  previewBtn: { backgroundColor: '#0077cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  previewBtnText: { color: '#fff', fontWeight: 'bold' },

  // Picker Styles
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  pickerContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '70%', padding: 20 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  searchInput: { backgroundColor: '#f2f2f2', padding: 14, borderRadius: 12, marginBottom: 15, fontSize: 15 },
  itemOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemOptionText: { fontSize: 16, color: '#333', fontWeight: '500' },
  itemOptionPrice: { fontSize: 12, color: '#7f8c8d' },

  // Preview Mode Styles
  previewContainer: { padding: 5 },
  previewHeader: { fontSize: 18, fontWeight: 'bold', color: '#0077cc', marginBottom: 15, textAlign: 'center' },
  previewTable: { backgroundColor: '#fff', borderRadius: 15, padding: 18, borderWidth: 1, borderColor: '#eee' },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  previewText: { fontSize: 14, color: '#2c3e50', fontWeight: '600' },
  previewSubText: { fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  totalLabelLarge: { fontSize: 18, fontWeight: 'bold' },
  totalAmountLarge: { fontSize: 22, fontWeight: 'bold', color: '#27ae60' },
  buttonRow: { flexDirection: 'row', marginTop: 20 },
  editBtn: { flex: 1, padding: 15, backgroundColor: '#bdc3c7', borderRadius: 12, marginRight: 10, alignItems: 'center' },
  editBtnText: { color: '#fff', fontWeight: 'bold' },
  finalSaveBtn: { flex: 2, padding: 15, backgroundColor: '#27ae60', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  finalSaveBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 }
});

export default InventoryBill;