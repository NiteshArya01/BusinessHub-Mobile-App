import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import UpdateStockModal from './UpdateStockModal.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ItemList = ({ items = [], onEdit, onDelete, onUpdateSuccess }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const openMenu = (event, item) => {
    // Relative position calculate karne ke liye
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height + 5,
        right: SCREEN_WIDTH - (pageX + width),
      });
      setSelectedItem(item);
      setMenuVisible(true);
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSubText}>
            HSN: {item.hsn}  |  GST: {item.gst}%
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyText}>{item.quantity} Qty</Text>
          </View>

          <TouchableOpacity
            onPress={(e) => openMenu(e, item)}
            style={styles.menuIconBtn}
          >
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>PURCHASE</Text>
          <Text style={styles.priceValue}>₹{item.purchaseRate}</Text>
        </View>
        <View style={[styles.priceColumn, styles.borderLateral]}>
          <Text style={styles.priceLabel}>WHOLESALE</Text>
          <Text style={styles.priceValue}>₹{item.wholesalePrice}</Text>
        </View>
        <View style={styles.priceColumn}>
          <Text style={[styles.priceLabel, {color: '#0077cc'}]}>RETAIL</Text>
          <Text style={styles.retailValue}>₹{item.retailPrice}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modern Relative Dropdown Menu */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View 
            style={[
              styles.dropdownWrapper, 
              { top: menuPosition.top, right: menuPosition.right }
            ]}
          >
            {/* 1. Update Stock Option */}
            <TouchableOpacity 
              style={styles.menuOption} 
              onPress={() => { setMenuVisible(false); setUpdateModalVisible(true); }}
            >
              <View style={styles.iconCircle}><Text style={styles.iconBlue}>🔄</Text></View>
              <Text style={styles.optionText}>Update Stock</Text>
            </TouchableOpacity>

            {/* 2. Edit Option */}
            <TouchableOpacity 
              style={styles.menuOption} 
              onPress={() => { onEdit(selectedItem); closeMenu(); }}
            >
              <View style={styles.iconCircle}><Text style={styles.iconBlue}>✎</Text></View>
              <Text style={styles.optionText}>Edit Product</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Delete Option */}
            <TouchableOpacity 
              style={styles.menuOption} 
              onPress={() => { onDelete(selectedItem); closeMenu(); }}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFF5F5' }]}><Text style={styles.iconRed}>🗑</Text></View>
              <Text style={[styles.optionText, { color: '#FF5252' }]}>Delete Product</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Sheet Modal Integration */}
      <UpdateStockModal 
        visible={updateModalVisible} 
        item={selectedItem} 
        onClose={() => setUpdateModalVisible(false)} 
        onUpdate={(id, data) => {
          onUpdateSuccess(id, data);
          setUpdateModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F2F4F7', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1A1C1E' },
  itemSubText: { fontSize: 12, color: '#6C757D', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  qtyBadge: { backgroundColor: '#E8F2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  qtyText: { color: '#0077cc', fontWeight: '700', fontSize: 12 },
  menuIconBtn: { padding: 4 },
  menuIcon: { fontSize: 22, color: '#999', fontWeight: 'bold' },
  priceContainer: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#F1F3F5' },
  priceColumn: { flex: 1, alignItems: 'center' },
  borderLateral: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E9ECEF' },
  priceLabel: { fontSize: 9, fontWeight: '700', color: '#ADB5BD', marginBottom: 4, textTransform: 'uppercase' },
  priceValue: { fontSize: 14, fontWeight: '700', color: '#343A40' },
  retailValue: { fontSize: 15, fontWeight: '800', color: '#0077cc' },

  // Dropdown Menu Styles
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownWrapper: {
    position: 'absolute',
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  menuOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconBlue: { fontSize: 14, color: '#0077cc' },
  iconRed: { fontSize: 14, color: '#FF5252' },
  optionText: { fontSize: 14, fontWeight: '600', color: '#444' },
  divider: { height: 1, backgroundColor: '#F1F1F1', marginVertical: 6, marginHorizontal: 10 },
});

export default ItemList;