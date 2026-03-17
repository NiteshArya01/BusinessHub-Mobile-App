import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';

const TransactionFilters = ({
  onApplyFilter,
  onExportPDF,
  onExportExcel,
  onSync,
}) => {
  const today = new Date();
  const primaryBlue = "#0077cc";
  const paymentDark = "#1e293b"; 
  const allNeutral = "#475569"; // Neutral color for 'All'

  const [filter, setFilter] = useState({
    type: "All", // Default set to All
    dateFilter: "Today",
    fromDate: today,
    toDate: today,
  });

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("from");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const periods = ["Today", "Week", "Month", "Year", "Custom"];

  useEffect(() => {
    if (filter.dateFilter !== "Custom") {
      onApplyFilter?.(filter);
    }
  }, [filter.type, filter.dateFilter]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateFilter = (key, value) => {
    triggerHaptic();
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handlePeriodSelect = (item) => {
    setShowPeriodDropdown(false);
    if (item === "Custom") {
      setShowCustomModal(true);
    }
    updateFilter("dateFilter", item);
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (!selectedDate) return;
    if (pickerMode === "from") updateFilter("fromDate", selectedDate);
    else updateFilter("toDate", selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Report Section</Text>
        
        <View style={styles.mainRow}>
          {/* 1. Toggle Switch (All, Purchase, Payment) */}
          <View style={styles.toggleWrapper}>
            {/* ALL Option */}
            <TouchableOpacity
              onPress={() => updateFilter("type", "All")}
              style={[styles.toggleTab, filter.type === "All" && { backgroundColor: allNeutral }]}
            >
              <Text style={[styles.toggleText, filter.type === "All" ? styles.whiteText : {color: '#64748b'}]}>
                All
              </Text>
            </TouchableOpacity>

            {/* PURCHASE Option */}
            <TouchableOpacity
              onPress={() => updateFilter("type", "Purchase")}
              style={[styles.toggleTab, filter.type === "Purchase" && { backgroundColor: primaryBlue }]}
            >
              <Text style={[styles.toggleText, filter.type === "Purchase" ? styles.whiteText : {color: '#64748b'}]}>
                Purchase
              </Text>
            </TouchableOpacity>

            {/* PAYMENT Option */}
            <TouchableOpacity
              onPress={() => updateFilter("type", "Payment")}
              style={[styles.toggleTab, filter.type === "Payment" && { backgroundColor: paymentDark }]}
            >
              <Text style={[styles.toggleText, filter.type === "Payment" ? styles.whiteText : {color: '#64748b'}]}>
                Payment
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Period Dropdown */}
          <TouchableOpacity 
            style={styles.dropdownBtn} 
            onPress={() => { triggerHaptic(); setShowPeriodDropdown(!showPeriodDropdown); setShowActionMenu(false); }}
          >
            <Text style={styles.dropdownValueText}>{filter.dateFilter}</Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>

          {/* 3. Three Dot Menu */}
          <TouchableOpacity 
            style={styles.moreBtn} 
            onPress={() => { triggerHaptic(); setShowActionMenu(!showActionMenu); setShowPeriodDropdown(false); }}
          >
            <CircleMenuIcon color="#444" />
          </TouchableOpacity>
        </View>

        {/* PERIOD DROPDOWN OVERLAY */}
        {showPeriodDropdown && (
          <View style={styles.periodMenu}>
            {periods.map((p) => (
              <TouchableOpacity key={p} style={styles.menuItem} onPress={() => handlePeriodSelect(p)}>
                <Text style={[styles.menuItemText, filter.dateFilter === p && {color: primaryBlue}]}>{p}</Text>
                {filter.dateFilter === p && (
                  <Ionicons name="checkmark-circle" size={16} color={primaryBlue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ACTION MENU OVERLAY */}
        {showActionMenu && (
          <View style={styles.actionMenu}>
            <TouchableOpacity style={styles.actionItem} onPress={() => {onExportPDF?.(); setShowActionMenu(false);}}>
              <MaterialCommunityIcons name="file-pdf-box" size={20} color="#E11D48" />
              <Text style={styles.actionText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => {onExportExcel?.(); setShowActionMenu(false);}}>
              <MaterialCommunityIcons name="file-excel" size={20} color="#16A34A" />
              <Text style={styles.actionText}>Export Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionItem, {borderBottomWidth: 0}]} onPress={() => {onSync?.(); setShowActionMenu(false);}}>
              <Ionicons name="logo-google" size={18} color={primaryBlue} />
              <Text style={styles.actionText}>Sync Google Sheets</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* CUSTOM DATE MODAL */}
      <Modal visible={showCustomModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCustomModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Custom Date Range</Text>
                
                <View style={styles.inputSection}>
                  <Text style={styles.label}>From Date:</Text>
                  <TouchableOpacity style={styles.dateBox} onPress={() => { setPickerMode("from"); setShowPicker(true); }}>
                    <Text style={styles.dateText}>{filter.fromDate.toDateString()}</Text>
                    <Ionicons name="calendar-outline" size={20} color={primaryBlue} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.label}>To Date:</Text>
                  <TouchableOpacity style={styles.dateBox} onPress={() => { setPickerMode("to"); setShowPicker(true); }}>
                    <Text style={styles.dateText}>{filter.toDate.toDateString()}</Text>
                    <Ionicons name="calendar-outline" size={20} color={primaryBlue} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBtns}>
                  <TouchableOpacity style={styles.cBtn} onPress={() => setShowCustomModal(false)}>
                    <Text style={styles.btnLabel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.aBtn, {backgroundColor: primaryBlue}]} 
                    onPress={() => { setShowCustomModal(false); onApplyFilter?.(filter); }}
                  >
                    <Text style={[styles.btnLabel, {color: '#fff'}]}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {showPicker && <DateTimePicker value={today} mode="date" display="default" onChange={onDateChange} />}
    </View>
  );
};

// Simple Icon component for the three dots
const CircleMenuIcon = ({color}) => (
  <View style={{flexDirection: 'column', gap: 2}}>
    {[1, 2, 3].map(i => <View key={i} style={{width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color}} />)}
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingVertical: 5, zIndex: 100 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 12, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, zIndex: 10 },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: "#94a3b8", marginBottom: 10, marginLeft: 2 },
  mainRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  toggleWrapper: { flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 12, padding: 3, flex: 1.5, marginRight: 8 },
  toggleTab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  toggleText: { fontSize: 12, fontWeight: "700" },
  whiteText: { color: "#fff" },
  dropdownBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0", marginRight: 5, minWidth: 85, justifyContent: 'space-between' },
  dropdownValueText: { fontSize: 12, fontWeight: "600", color: "#334155" },
  moreBtn: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  periodMenu: { position: "absolute", top: 65, right: 60, backgroundColor: "#fff", width: 140, borderRadius: 12, elevation: 12, borderWidth: 1, borderColor: "#f1f5f9", zIndex: 100, paddingVertical: 5 },
  actionMenu: { position: "absolute", top: 65, right: 10, backgroundColor: "#fff", width: 210, borderRadius: 12, elevation: 12, borderWidth: 1, borderColor: "#f1f5f9", zIndex: 100 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  menuItemText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  actionItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  actionText: { marginLeft: 12, fontSize: 13, fontWeight: "600", color: "#1e293b" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "88%", backgroundColor: "#fff", borderRadius: 28, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 25 },
  inputSection: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 8 },
  dateBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 14, padding: 14 },
  dateText: { fontSize: 15, fontWeight: "500", color: "#1e293b" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 10 },
  cBtn: { flex: 1, padding: 16, backgroundColor: "#f1f5f9", borderRadius: 16, alignItems: "center" },
  aBtn: { flex: 1, padding: 16, borderRadius: 16, alignItems: "center" },
  btnLabel: { fontSize: 15, fontWeight: "600" }
});

export default TransactionFilters;