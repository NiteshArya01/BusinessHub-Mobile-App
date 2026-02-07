import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserMenu = ({ onLogout }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      {/* Header Profile Icon */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.headerBtn}>
        <View style={styles.circle}>
          <Text style={styles.letter}>N</Text>
        </View>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <View style={styles.userInfoHeader}>
              <Text style={styles.userName}>Nitesh Kumar</Text>
              <Text style={styles.userEmail}>admin@terabook.com</Text>
            </View>
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-outline" size={18} color="#444" />
              <Text style={styles.menuText}>My Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={18} color="#444" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={() => { setVisible(false); onLogout(); }}>
              <Ionicons name="log-out-outline" size={18} color="#e91e63" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBtn: { marginRight: 15 },
  circle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  letter: { color: '#0077cc', fontWeight: 'bold', fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'transparent' },
  dropdown: { 
    position: 'absolute', top: 55, right: 10, backgroundColor: '#fff', width: 180, 
    borderRadius: 12, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, padding: 10 
  },
  userInfoHeader: { padding: 8 },
  userName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  userEmail: { fontSize: 11, color: '#888' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  menuText: { marginLeft: 10, fontSize: 14, color: '#444' },
  logoutItem: { marginTop: 5, borderTopWidth: 1, borderTopColor: '#f9f9f9', paddingTop: 12 },
  logoutText: { marginLeft: 10, fontSize: 14, color: '#e91e63', fontWeight: 'bold' }
});

export default UserMenu;