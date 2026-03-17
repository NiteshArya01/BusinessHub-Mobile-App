import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TextInput, 
  SafeAreaView,
  StatusBar 
} from 'react-native';
import AddItemModal from './AddItemModal';
import ItemList from './ItemList';

// Data setup
const DUMMY_ITEMS = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', hsn: '8471', gst: '18', quantity: 25, purchaseRate: 400, wholesalePrice: 550, retailPrice: 800 },
  { id: 2, name: 'Basmati Rice', category: 'Grocery', hsn: '1006', gst: '5', quantity: 100, purchaseRate: 80, wholesalePrice: 95, retailPrice: 120 },
  { id: 3, name: 'Smart Watch', category: 'Electronics', hsn: '8517', gst: '18', quantity: 10, purchaseRate: 1500, wholesalePrice: 2000, retailPrice: 2999 },
  { id: 4, name: 'Keyboard K120', category: 'Electronics', hsn: '8471', gst: '18', quantity: 15, purchaseRate: 300, wholesalePrice: 450, retailPrice: 600 },
];

export default function StockManagerScreen() {
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic: Ab sirf item ke name par filter karega
  const filteredData = DUMMY_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- Search & Add Section (As per Image) --- */}
      <View style={styles.topActionContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search Item"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setItemModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* --- Main Item List --- */}
      <View style={styles.listContainer}>
        <ItemList items={filteredData} />
      </View>

      {/* --- Add Item Modal --- */}
      <AddItemModal 
        visible={itemModalVisible} 
        onClose={() => setItemModalVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB', // Halka gray background
  },
  topActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF', // Search area white rahega
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F3F4', // Screenshot jaisa input background
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#70757A',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    paddingVertical: 0, // Android fix
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#0077cc', // Blue plus button
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    // Shadow details
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -3, // Centering plus icon
  },
  listContainer: {
    flex: 1,
    marginTop: 5,
  },
});