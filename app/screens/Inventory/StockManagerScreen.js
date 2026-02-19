import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AddItemModal from './AddItemModal';
import AddCategoryModal from './AddCategoryModal';
import CategoryFilter from './CategoryFilter';
import ItemList from './ItemList';

// Data variables fix kar diye hain
const DUMMY_ITEMS = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', hsn: '8471', gst: '18', quantity: 25, purchaseRate: 400, wholesalePrice: 550, retailPrice: 800 },
  { id: 2, name: 'Basmati Rice', category: 'Grocery', hsn: '1006', gst: '5', quantity: 100, purchaseRate: 80, wholesalePrice: 95, retailPrice: 120 },
  { id: 3, name: 'Smart Watch', category: 'Electronics', hsn: '8517', gst: '18', quantity: 10, purchaseRate: 1500, wholesalePrice: 2000, retailPrice: 2999 },
  { id: 4, name: 'Wireless Mouse', category: 'Electronics', hsn: '8471', gst: '18', quantity: 25, purchaseRate: 400, wholesalePrice: 550, retailPrice: 800 },
  { id: 5, name: 'Basmati Rice', category: 'Grocery', hsn: '1006', gst: '5', quantity: 100, purchaseRate: 80, wholesalePrice: 95, retailPrice: 120 },
  { id: 6, name: 'Smart Watch', category: 'Electronics', hsn: '8517', gst: '18', quantity: 10, purchaseRate: 1500, wholesalePrice: 2000, retailPrice: 2999 },
];

const DUMMY_CATS = ['Electronics', 'Grocery', 'Hardware', 'Clothes'];

export default function StockManagerScreen() {
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Yahan ALL_ITEMS ki jagah DUMMY_ITEMS kar diya hai
  const filteredData = DUMMY_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <View style={styles.container}>
      {/* Top Action Buttons */}
      <View style={styles.horizontalActionWrapper}>
        <TouchableOpacity 
          style={[styles.horizontalCard, { borderLeftColor: '#4CAF50' }]} 
          onPress={() => setItemModalVisible(true)}
        >
          <View style={[styles.miniIcon, { backgroundColor: '#E8F5E9' }]}>
            <Text style={{fontSize: 18}}>📦</Text>
          </View>
          <Text style={styles.horizontalCardText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.horizontalCard, { borderLeftColor: '#0077cc' }]} 
          onPress={() => setCategoryModalVisible(true)}
        >
          <View style={[styles.miniIcon, { backgroundColor: '#E3F2FD' }]}>
            <Text style={{fontSize: 18}}>📁</Text>
          </View>
          <Text style={styles.horizontalCardText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      {/* Filter & Search Section - Ab ye sahi variables use karega */}
      <View style={{ marginTop: 20 }}>
        <CategoryFilter 
          categories={DUMMY_CATS} 
          selectedCat={selectedCat}
          onSelectCat={setSelectedCat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </View>

      {/* Item List Component */}
      <ItemList items={filteredData} />

      {/* Modals */}
      <AddItemModal visible={itemModalVisible} onClose={() => setItemModalVisible(false)} />
      <AddCategoryModal visible={categoryModalVisible} onClose={() => setCategoryModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  horizontalActionWrapper: { 
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    paddingTop: 15, 
    justifyContent: 'space-between' 
  },
  horizontalCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '48%', 
    backgroundColor: '#fff', 
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#F0F0F0', 
    borderLeftWidth: 4, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  miniIcon: { 
    width: 35, 
    height: 35, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  horizontalCardText: { fontSize: 13, fontWeight: '700', color: '#333' },
});