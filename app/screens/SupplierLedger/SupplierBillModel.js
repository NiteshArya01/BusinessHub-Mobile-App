import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// 🔥 FIX: Importing from the legacy path as required by the new Expo version
import * as FileSystem from 'expo-file-system/legacy'; 
import * as Sharing from 'expo-sharing';

const { height } = Dimensions.get('window');

const SupplierBillModal = ({ visible, onClose, billData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isPdf = billData?.toLowerCase().endsWith('.pdf');

  /**
   * Orchestrates the secure download and cross-platform sharing of the attachment.
   */
  const handleDownloadAndOpen = async () => {
    if (!billData) return;

    try {
      setIsProcessing(true);
      
      const fileExtension = isPdf ? 'pdf' : 'jpg';
      const fileName = `Document_${Date.now()}.${fileExtension}`;
      // Using cacheDirectory for temporary storage before sharing
      const fileUri = FileSystem.cacheDirectory + fileName;

      // Executing the download via the legacy FileSystem API
      const downloadResult = await FileSystem.downloadAsync(billData, fileUri);

      if (downloadResult.status === 200) {
        // Checking for system sharing availability
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("System Error", "The sharing module is not supported on this device.");
        }
      } else {
        throw new Error("Server responded with a non-200 status code.");
      }
    } catch (error) {
      console.error("File Access Error:", error);
      Alert.alert(
        "Download Error", 
        "An unexpected error occurred while accessing the document. Please try again later."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal 
      animationType="slide" 
      transparent={true} 
      visible={visible} 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.dismissOverlay} 
          activeOpacity={1} 
          onPress={onClose} 
        />

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.mainTitle}>Document Preview</Text>
              <Text style={styles.subTitleText}>Cloud-Based Attachment</Text>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isProcessing}>
              <MaterialCommunityIcons name="close-circle" size={30} color="#bdc3c7" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentBody}>
            {!billData ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="file-search-outline" size={80} color="#ecf0f1" />
                <Text style={styles.emptyStateText}>No attachment associated with this entry.</Text>
              </View>
            ) : isPdf ? (
              <View style={styles.pdfCardContainer}>
                <MaterialCommunityIcons name="file-pdf-box" size={100} color="#e74c3c" />
                <Text style={styles.pdfHeader}>Portable Document Format (PDF)</Text>
                <Text style={styles.fileNameLabel} numberOfLines={1}>
                  {billData.split('/').pop()}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.primaryActionBtn, isProcessing && styles.btnDisabled]} 
                  onPress={handleDownloadAndOpen}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="cloud-download-outline" size={22} color="#fff" />
                      <Text style={styles.btnLabel}>Download & View File</Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.instructionText}>Click to open in your system's default viewer.</Text>
              </View>
            ) : (
              <View style={styles.imageWrapper}>
                {isImageLoading && <ActivityIndicator style={styles.loaderCenter} size="large" color="#3498db" />}
                <Image
                  source={{ uri: billData }}
                  style={styles.previewImage}
                  resizeMode="contain"
                  onLoadEnd={() => setIsImageLoading(false)}
                />
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.footerCloseBtn} 
            onPress={onClose}
            disabled={isProcessing}
          >
            <Text style={styles.footerCloseText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  dismissOverlay: { ...StyleSheet.absoluteFillObject },
  sheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 25, paddingBottom: 35 },
  dragHandle: { width: 45, height: 5, backgroundColor: '#f1f1f1', borderRadius: 10, alignSelf: 'center', marginTop: 12, marginBottom: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 20, fontWeight: '800', color: '#2c3e50' },
  subTitleText: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
  contentBody: { minHeight: 320, backgroundColor: '#fcfcfc', borderRadius: 20, borderWidth: 1, borderColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  pdfCardContainer: { alignItems: 'center', padding: 25 },
  pdfHeader: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginTop: 10 },
  fileNameLabel: { fontSize: 11, color: '#bdc3c7', marginBottom: 25, width: 200, textAlign: 'center' },
  primaryActionBtn: { backgroundColor: '#e74c3c', flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 25, borderRadius: 14, alignItems: 'center', elevation: 4 },
  btnLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  btnDisabled: { backgroundColor: '#bdc3c7' },
  instructionText: { fontSize: 11, color: '#95a5a6', marginTop: 15, fontStyle: 'italic' },
  imageWrapper: { width: '100%', height: 350 },
  previewImage: { width: '100%', height: '100%' },
  loaderCenter: { position: 'absolute', alignSelf: 'center', top: '45%' },
  emptyState: { alignItems: 'center' },
  emptyStateText: { marginTop: 15, fontSize: 14, color: '#bdc3c7', textAlign: 'center' },
  footerCloseBtn: { backgroundColor: '#34495e', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  footerCloseText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default SupplierBillModal;