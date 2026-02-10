import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SupplierBillModal from './SupplierBillModel'; // Modal import karein

const TransactionList = ({ transactions }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Bill open karne ka function
  const handleViewBill = (billUrl) => {
    setSelectedBill(billUrl); // Agar billUrl undefined hai toh ye null setup karega
    setModalVisible(true);
  };

  const renderTransaction = ({ item }) => {
    const isPurchase = item.type === 'Purchase';

    return (
      <View style={styles.transCard}>
        <View style={styles.leftCol}>
          <Text style={styles.transDate}>{item.date}</Text>
          <Text style={styles.transRemark} numberOfLines={1}>
            {item.remark} <Text style={styles.modeText}>({item.mode})</Text>
          </Text>

          {/* View Bill Button */}
          <TouchableOpacity 
            style={styles.viewBillBtn} 
            onPress={() => handleViewBill(item.billUrl)}
          >
            <MaterialCommunityIcons name="file-document-outline" size={14} color="#3498db" />
            <Text style={styles.viewBillText}>View Bill</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.rightCol}>
          <Text style={[
            styles.transAmount, 
            { color: isPurchase ? '#e74c3c' : '#2ecc71' }
          ]}>
            {isPurchase ? `- ₹${item.amount}` : `+ ₹${item.amount}`}
          </Text>
          <Text style={styles.statusLabel}>{item.type}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderTransaction}
        ListHeaderComponent={<Text style={styles.secTitle}>Records History</Text>}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Reusable Modal Component */}
      <SupplierBillModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        billData={selectedBill} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  secTitle: { fontSize: 14, fontWeight: 'bold', marginVertical: 15, color: '#444' },
  transCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  leftCol: { flex: 1 },
  rightCol: { alignItems: 'flex-end', justifyContent: 'center' },
  transDate: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  transRemark: { fontSize: 12, color: '#666', marginTop: 2 },
  modeText: { fontStyle: 'italic', color: '#999' },
  transAmount: { fontSize: 16, fontWeight: 'bold' },
  statusLabel: { fontSize: 10, color: '#888', textTransform: 'uppercase' },
  viewBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f0f7ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d6e9f8'
  },
  viewBillText: { fontSize: 11, color: '#3498db', fontWeight: 'bold', marginLeft: 4 }
});

export default TransactionList;