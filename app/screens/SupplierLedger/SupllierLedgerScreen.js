import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/LoadingSpinner'; // Path check karein

export default function SupplierLedgerScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [suppliers, setSuppliers] = useState([
    { id: '1', name: 'Arjun Textiles', phone: '9876543210', gstin: '08AAAAA0000A1Z5', balance: '₹15,000' },
    { id: '2', name: 'Krishna Fab', phone: '9988776655', gstin: '08BBBBB1111B2Z6', balance: '₹4,200' },
  ]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000); // 2 sec loader
  }, []);

  // Filter list based on search
  const filteredSuppliers = suppliers.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.phone.includes(searchQuery)
  );

  if (isLoading) return <LoadingSpinner message="Opening Supplier Records..." />;

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput 
            placeholder="Search Supplier by Name or Phone..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addBtnCircle} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SupplierDetailPage', { supplier: item })}>
            <View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardSub}>GST: {item.gstin}</Text>
              <Text style={styles.cardSub}>📞 {item.phone}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardBalance}>{item.balance}</Text>
              <View style={styles.actionIcons}>
                <Ionicons name="pencil" size={18} color="#0077cc" style={{marginRight: 15}} />
                <Ionicons name="trash" size={18} color="#e74c3c" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Add New Supplier Modal (Popup) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Supplier</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TextInput style={styles.input} placeholder="Supplier Name *" />
              <TextInput style={styles.input} placeholder="Phone Number *" keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="GSTIN No." />
              <TextInput style={styles.input} placeholder="Address" />
              
              <View style={styles.divider} />
              <Text style={styles.subTitle}>Bank Details</Text>
              <TextInput style={styles.input} placeholder="Account Number" keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Bank Name" />
              <TextInput style={styles.input} placeholder="IFSC Code" />
              
              {/* ✅ Fixed Submit Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.submitText}>Save Supplier Ledger</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
  headerContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', alignItems: 'center', elevation: 4 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f2f5', borderRadius: 10, paddingHorizontal: 10, alignItems: 'center', height: 45 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  addBtnCircle: { backgroundColor: '#0077cc', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  cardName: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 2 },
  cardBalance: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c' },
  actionIcons: { flexDirection: 'row', marginTop: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0077cc' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  subTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  submitBtn: { backgroundColor: '#0077cc', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});