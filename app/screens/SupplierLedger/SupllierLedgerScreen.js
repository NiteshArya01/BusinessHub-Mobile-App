import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/LoadingSpinner'; 
import AddSupplierModal from './AddSupplierModal'; 
import SuppliersController from '../../controllers/SuppliersController';
import { auth } from '../../api/firebase';
import ConfirmModal from '../../components/ConfirmModal';
export default function SupplierLedgerScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // New state for loading during delete
  const loadSuppliers = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const result = await SuppliersController.fetchSuppliers(uid);
    if (result.success) setSuppliers(result.data);
    setIsLoading(false);
  };

  useEffect(() => { loadSuppliers(); }, []);

  // const confirmDelete = (id) => {
  //   Alert.alert("Delete Supplier", "Kya aap is ledger ko delete karna chahte hain?", [
  //     { text: "Nahi" },
  //     { text: "Haan, Delete", style: 'destructive', onPress: async () => {
  //         const res = await SuppliersController.deleteSupplier(id);
  //         if(res.success) loadSuppliers();
  //     }}
  //   ]);
  // };

  // Jab delete icon par click ho
  const handleDeleteClick = (id) => {
    setSelectedSupplierId(id);
    setDeleteModalVisible(true);
  };

  // Jab user "Confirm" kare
const handleConfirmDelete = async () => {
    if (selectedSupplierId) {
      setIsDeleting(true); // Loading start
      const res = await SuppliersController.deleteSupplier(selectedSupplierId);
      if (res.success) {
        await loadSuppliers(); // List refresh
        setDeleteModalVisible(false);
        setSelectedSupplierId(null); // ID clear karein
      } else {
        Alert.alert("Error", "Could not delete supplier.");
      }
      setIsDeleting(false); // Loading stop
    }
  };

  const filteredSuppliers = suppliers.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone.includes(searchQuery)
  );

  if (isLoading) return <LoadingSpinner message="Opening Records..." />;

  return (
    <View style={styles.container}>
      {/* Search & Add Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput 
            placeholder="Search Name/Phone" 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setSelectedSupplier(null); setModalVisible(true); }}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

<FlatList
  data={filteredSuppliers}
  keyExtractor={(item) => item.id}
  // --- Ye section add karein ---
  ListEmptyComponent={() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No Record Found</Text>
    </View>
  )}
  // -----------------------------
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('SupplierDetailPage', { supplier: item })}
    >
      <View style={{flex: 1}}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSub}>📞 {item.phone}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.cardBalance, { color: item.balanceType === 'Cr' ? '#e74c3c' : '#2ecc71' }]}>
          ₹{item.amount || 0} {item.balanceType}
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => { setSelectedSupplier(item); setModalVisible(true); }}>
            <Ionicons name="pencil" size={18} color="#0077cc" style={{marginRight: 15}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteClick(item.id)}>
            <Ionicons name="trash" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )}
  contentContainerStyle={{ padding: 15, flexGrow: 1 }} // flexGrow: 1 zaroori hai center karne ke liye
/>
      {/* <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('SupplierDetailPage', { supplier: item })}
          >
            <View style={{flex: 1}}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardSub}>📞 {item.phone}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.cardBalance, { color: item.balanceType === 'Cr' ? '#e74c3c' : '#2ecc71' }]}>
                ₹{item.amount || 0} {item.balanceType}
              </Text>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => { setSelectedSupplier(item); setModalVisible(true); }}>
                  <Ionicons name="pencil" size={18} color="#0077cc" style={{marginRight: 15}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteClick(item.id)}>
                  <Ionicons name="trash" size={18} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 15 }}
      /> */}

      <AddSupplierModal 
        visible={modalVisible} 
        supplierToEdit={selectedSupplier}
        onClose={() => setModalVisible(false)} 
        onSave={loadSuppliers} 
      />

      <ConfirmModal 
        visible={deleteModalVisible}
        title="Delete Ledger?"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
        confirmText="Yes, Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
  headerContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', alignItems: 'center', elevation: 3 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f2f5', borderRadius: 8, paddingHorizontal: 10, alignItems: 'center', height: 40 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  addBtn: { backgroundColor: '#0077cc', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', elevation: 1 },
  cardName: { fontSize: 15, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 2 },
  cardBalance: { fontSize: 15, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  emptyContainer: {
    flex: 1,                // Puri available jagah lega
    justifyContent: 'center', // Vertical center
    alignItems: 'center',     // Horizontal center
    // Agar header ki wajah se thoda niche dikhana hai toh 
    // paddingBottom ya marginBottom add kar sakte hain
    paddingBottom: 100,      
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    fontWeight: '500',
  },
});