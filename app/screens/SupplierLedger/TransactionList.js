import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import SupplierBillModal from './SupplierBillModel';

const TransactionList = ({
  transactions = [],
  onLoadMore,
  isFetchingMore = false,
  hasMore = false,
  onEdit,
  onDelete
}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const onEndReachedCalledDuringMomentum = useRef(false);

  // 📄 Open Bill Modal
  const handleViewBill = (billUrl) => {
    if (!billUrl) return;
    setSelectedBill(billUrl);
    setModalVisible(true);
  };

  // 🔄 Pagination Handler
  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum.current &&
      !isFetchingMore &&
      hasMore
    ) {
      onLoadMore?.();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  const renderTransaction = ({ item }) => {

    const isPayment = item.entryType === "payment";
    const isPurchase =
      item.entryType === "purchaseVoucher" ||
      item.entryType === "purchaseInventory";

    return (
      <View style={styles.transCard}>

        {/* LEFT SECTION */}
        <View style={styles.leftCol}>
          <Text style={styles.transDate}>{item.date}</Text>

          <Text style={styles.transRemark} numberOfLines={1}>
            Bill No:
            <Text style={{ fontWeight: 'bold', color: '#333' }}>
              {item.details?.billNumber || " N/A"}
            </Text>

            {item.details?.remarks && (
              <Text style={styles.modeText}>
                {" "}({item.details.remarks})
              </Text>
            )}
          </Text>

          {/* ✅ Always Visible View Bill Button */}
          <TouchableOpacity
            style={[
              styles.viewBillBtn,
              !item.details?.attachment && styles.disabledBtn
            ]}
            disabled={!item.details?.attachment}
            onPress={() => handleViewBill(item.details?.attachment)}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={14}
              color="#3498db"
            />
            <Text style={styles.viewBillText}>
              {item.details?.attachment ? "View Bill" : "No Bill"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* RIGHT SECTION */}
        <View style={styles.rightCol}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name={isPayment ? "arrow-down-circle" : "arrow-up-circle"}
              size={18}
              color={isPayment ? '#2ecc71' : '#e74c3c'}
              style={{ marginRight: 4 }}
            />

            <Text
              style={[
                styles.transAmount,
                { color: isPayment ? '#2ecc71' : '#e74c3c' }
              ]}
            >
              {isPayment ? `- ₹${item.amount}` : `+ ₹${item.amount}`}
            </Text>
          </View>

          <Text style={styles.statusLabel}>
            {item.entryType}
          </Text>

          <View style={styles.actionIconGroup}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onEdit?.(item)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={18}
                color="#f39c12"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onDelete?.(item)}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color="#e74c3c"
              />
            </TouchableOpacity>
          </View>

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

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}

        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}

        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <Text style={styles.secTitle}>Records History</Text>
        }

        ListEmptyComponent={() =>
          !isFetchingMore && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="document-text-outline"
                size={50}
                color="#ccc"
              />
              <Text style={styles.emptyText}>No Record Found</Text>
            </View>
          )
        }

        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ paddingVertical: 15 }}>
              <ActivityIndicator size="small" color="#3498db" />
            </View>
          ) : null
        }

        contentContainerStyle={styles.listContainer}
      />

      <SupplierBillModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        billData={selectedBill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100
  },

  secTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#444'
  },

  transCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2
  },

  leftCol: { flex: 1.3 },

  rightCol: {
    flex: 0.7,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },

  transDate: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333'
  },

  transRemark: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },

  modeText: {
    fontStyle: 'italic',
    color: '#999'
  },

  transAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  statusLabel: {
    fontSize: 10,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 5
  },

  viewBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#ebf5fb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },

  disabledBtn: {
    opacity: 0.5
  },

  viewBillText: {
    fontSize: 12,
    color: '#3498db',
    marginLeft: 4,
    fontWeight: '500'
  },

  actionIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12
  },

  iconBtn: { padding: 4 },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    fontWeight: '500'
  }
});

export default TransactionList;