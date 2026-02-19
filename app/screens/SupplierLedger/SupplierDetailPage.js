import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { fetchSupplierLedgerPaginated,savePaymentEntry } from '../../controllers/PurchaseController';

// Custom Components
import LoadingSpinner from '../../components/LoadingSpinner';
import TransactionFilters from './TransactionFilters';
import TransactionList from './TransactionList';
import PurchaseEntryModal from './PurchaseEntryModal';
import PaymentEntryModal from './PaymentEntryModal';

const defaultFilter = {
  type: null,
  entrySide: null,
  dateFilter: "today",
  fromDate: null,
  toDate: null
};

export default function SupplierDetailPage({ route, navigation }) {
  const { supplier } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  
  const [transType, setTransType] = useState('Purchase');
  const [showDetails, setShowDetails] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All'); 
  const [dateFilter, setDateFilter] = useState('Weekly');

  const [amount, setAmount] = useState('');
  const [billNo, setBillNo] = useState('');
 
  // States to control visibility
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  // Transaction data state
  const [transactions, setTransactions] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filter State
  const [filters, setFilters] = useState(defaultFilter);


  useEffect(() => {
    if (supplier?.id) {
      resetAndLoad();
    }
  }, [supplier?.id]);

  const resetAndLoad = async () => {
    setLastDoc(null);
    setTransactions([]);
    await loadTransactions(true);
  };

  const loadTransactions = async (isFirstLoad = false) => {
    if (!supplier?.id) return;

    if (isFirstLoad) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const result = await fetchSupplierLedgerPaginated({
        supplierId: supplier.id,
        lastDoc: isFirstLoad ? null : lastDoc,
        pageSize: 20
      });

      if (result.success) {
        if (isFirstLoad) {
          setTransactions(result.data);
        } else {
          setTransactions(prev => [...prev, ...result.data]);
        }

        setLastDoc(result.lastVisible);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);

    const result = await fetchSupplierLedgerPaginated({
      supplierId: supplier.id,
      lastDoc
    });

    if (result.success) {
      setTransactions(prev => [...prev, ...result.data]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    }

    setIsFetchingMore(false);
  };

  const handleTransectionEdit = (transaction) => {
    Alert.alert("Edit", `You want to edit transaction: ${transaction.id}`);
    // Yahan aap edit logic implement kar sakte hain
  }

  const handleTransectionDelete = (transaction) => {
    Alert.alert(
      "Confirm Delete", 
    )
  }

  const handleOpenModal = (type) => {
    if (type === 'Purchase') {
      setTransType(type);
      setAmount('');
      setBillNo('');
      setPurchaseModalVisible(true);
    } else if (type === 'Payment') {
      setPaymentModalVisible(true);
    }
  };

  const handleSaveEntry = () => {
    // Logic to save entry goes here
    setModalVisible(false);
    Alert.alert("Success", `${transType} added successfully`);
  };



const handleSavePayment = async (data) => {
  try {
    // 1. Data ko prepare karo (partyId modal se nahi mil raha tha, use yahan add karo)
    // Maan lijiye aapke paas 'currentSupplier' ki state hai
    const paymentData = {
      ...data,
      partyId: supplier.id, // Supplier ki ID yahan se pass hogi
      type: 'Payment'
    };

    //console.log("Saving to Firebase...", paymentData);

    // 2. Controller call karo
    const result = await savePaymentEntry(paymentData);

    if (result.success) {
      // 3. Success Feedback
      Alert.alert("Success", "Payment saved successfully!");
      
      // 4. Local state update karo ya ledger refresh karo
      resetAndLoad();
      
      // Modal close karne ki tension nahi, wo resetAndClose() se handle ho jayega
    } else {
      // 4. Error Feedback
      Alert.alert("Error", result.message);
    }
  } catch (error) {
    console.error("Save Error:", error);
    Alert.alert("Error", "Kuch gadbad ho gayi!");
  }
};

  if (isLoading) return <LoadingSpinner message={`Opening ${supplier?.name}'s Ledger...`} />;

  return (
    <View style={styles.container}>
    {/* 1. TOP HEADER (Premium Redesign) */}
    <View style={styles.topHeader}>
      {/* Supplier Title & Aligned Quick Actions */}
      <View style={styles.headerTopRow}>
        <View style={styles.nameContainer}>
          <Text style={styles.supName} numberOfLines={1}>
            {supplier?.name || 'Supplier Name'}
          </Text>
          
          {/* Wholesaler ki jagah ab Mobile Number */}
          <View style={styles.phoneBadge}>
            <Ionicons name="call-outline" size={12} color="#fff" />
            <Text style={styles.phoneText}> {supplier?.phone || '+91 00000 00000'}</Text>
          </View>
        </View>
        
        {/* Icons Aligned Perfectly */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: '#fff' }]} 
            onPress={() => {/* Call Logic */}}
          >
            <Ionicons name="call" size={18} color="#004a80" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.iconCircle, { backgroundColor: '#25D366' }]} 
            onPress={() => {/* WhatsApp Logic */}}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Balance Card (Same high contrast style) */}
      <View style={styles.balanceMainCard}>
        <View>
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <Text style={styles.balanceAmt}>
            ₹{supplier?.amount || supplier?.balance} 
            <Text style={[styles.balTypeText, {color: supplier?.balanceType === 'Cr' ? '#d32f2f' : '#2e7d32'}]}>
              {" "}{supplier?.balanceType || 'Cr'}
            </Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.detailsMinimalBtn} 
          onPress={() => setShowDetails(!showDetails)}
        >
          <Ionicons 
            name={showDetails ? "chevron-up-circle" : "information-circle"} 
            size={28} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Collapsible Info Section (Simplified) */}
      {showDetails && (
        <View style={styles.expandedInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#444" />
            <Text style={styles.infoValue}>{supplier?.address || 'No Address'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={16} color="#444" />
            <Text style={styles.infoValue}>GST: {supplier?.gstin || 'N/A'}</Text>
          </View>
          {/* Bank Details Strip */}
          <View style={styles.bankStrip}>
            <View style={styles.bankHeader}>
              <Ionicons name="business" size={14} color="#0077cc" />
              <Text style={styles.bankLabel}> BANK DETAILS</Text>
            </View>
            <Text style={styles.bankValue}>
              {supplier?.bankName || 'HDFC Bank'} • {supplier?.accNo || 'XXXXXXXX4521'}
            </Text>
            <Text style={styles.ifscValue}>IFSC: {supplier?.ifsc || 'HDFC0001234'}</Text>
          </View>
        </View>
      )}
    </View>

    {/* 2. TRANSACTION FILTERS COMPONENT */}
      
      <TransactionFilters
        onApplyFilter={(data) => {
          setFilters(data);
          // Check karo fetchTransactions define hai ya nahi
          if (typeof fetchTransactions === 'function') {
            fetchTransactions({ ...data, page: 1 });
          }
        }}
        onExportPDF={() => console.log("Exporting PDF...")}
        onExportExcel={() => console.log("Exporting Excel...")}
        onSync={() => console.log("Syncing...")}
      />
      {/* Tera List Component niche aayega */}
 

      {/* 3. TRANSACTION LIST COMPONENT */}

      <TransactionList
        transactions={transactions}
        onLoadMore={handleLoadMore}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        onEdit={handleTransectionEdit}
        onDelete={handleTransectionDelete}
      />

      {/* 4. BOTTOM ACTION BUTTONS */}
      <View style={styles.actionFooter}>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#e74c3c'}]} onPress={() => handleOpenModal('Purchase')}>
          <Text style={styles.btnText}>+ Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#2ecc71'}]} onPress={() => handleOpenModal('Payment')}>
          <Text style={styles.btnText}>- Give Payment</Text>
        </TouchableOpacity>
      </View>

      {/* 5. REUSABLE ENTRY MODAL */}
      <PurchaseEntryModal 
        visible={purchaseModalVisible}
        supplier={supplier}
        onClose={() => setPurchaseModalVisible(false)}
        refreshList={()=>{
          resetAndLoad();
          // loadTransactions();
        }}
      />


       {/* Payment Entry Modal */}
      <PaymentEntryModal 
        visible={paymentModalVisible} 
        onClose={() => setPaymentModalVisible(false)} 
        onSave={handleSavePayment} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa' },
topHeader: {
    backgroundColor: '#0077cc',//'#004a80', 
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Isse text aur icons ek hi line mein rahenge
    marginBottom: 20,
  },
  nameContainer: {
    flex: 1, // Isse naam lamba hone par icons dabenge nahi
    marginRight: 10,
  },
  supName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  phoneText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center', // Vertical alignment fix
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // Soft Shadow for Icons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceMainCard: {
    backgroundColor: '#004a80',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  balanceLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: 'bold',
  },
  balanceAmt: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
  },
  balTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandedInfo: {
    backgroundColor: '#f1f1f1',
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoValue: {
    color: '#333',
    fontSize: 14,
    marginLeft: 8,
  },
  bankStrip: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0077cc',
    marginTop: 5,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0077cc',
  },
  bankValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  ifscValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  balanceSection: { alignItems: 'center' },
  supName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceAmt: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  balanceLabel: { color: '#d1e9ff', fontSize: 12 },
  detailsToggle: { flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, marginTop: 12 },
  detailsToggleText: { color: '#fff', fontSize: 11, marginRight: 5 },
  detailsContainer: { marginTop: 15, padding: 12, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoText: { color: '#fff', fontSize: 12, marginLeft: 5 },
  filterSection: { backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipContainer: { flexDirection: 'row', flex: 0.5 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 15, backgroundColor: '#f0f2f5', marginRight: 6 },
  activeChip: { backgroundColor: '#0077cc' },
  chipText: { fontSize: 12, color: '#666' },
  activeChipText: { color: '#fff', fontWeight: 'bold' },
  timelineBox: { flex: 0.48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, borderWidth: 1, borderColor: '#ddd', height: 40 },
  picker: { flex: 1, transform: [{scale: 0.9}] },
  actionFooter: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 15, backgroundColor: '#fff', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#eee' },
  btn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});