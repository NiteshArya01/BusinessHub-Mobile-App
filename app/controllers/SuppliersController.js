import { db } from '../api/firebase'; 
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default class SuppliersController {
  // 1. FETCH
// SuppliersController.js

  static async fetchSuppliers(uid) {
    try {
      // Query ko update kiya gaya hai: createdBy AND isActive == true
      const q = query(
        collection(db, "suppliers"), 
        where("createdBy", "==", uid),
        where("isActive", "==", true) 
      );

      const querySnapshot = await getDocs(q);
      const suppliers = [];
      querySnapshot.forEach((doc) => {
        suppliers.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: suppliers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 2. SAVE (ADD or UPDATE)
  static async saveSupplier(uid, formData, balanceType, id = null) {
    try {
      const data = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        gstin: formData.gstin || '',
        address: formData.address || '',
        amount: parseFloat(formData.amount) || 0, // Number mein convert kiya
        balanceType: balanceType,
        accNo: formData.accNo || '',
        bankName: formData.bankName || '',
        ifsc: formData.ifsc || '',
        updatedAt: serverTimestamp(),
      };

      if (id) {
        const docRef = doc(db, "suppliers", id);
        await updateDoc(docRef, data);
      } else {
        data.createdBy = uid;
        data.isActive = true;
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "suppliers"), data);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 3. DELETE
  static async deleteSupplier(id) {
    // try {
    //   await deleteDoc(doc(db, "suppliers", id));
    //   return { success: true };
    // } catch (error) {
    //   return { success: false, error: error.message };
    // }
    try {
      const docRef = doc(db, "suppliers", id);
      await updateDoc(docRef, { 
        isActive: false,
        updatedAt: serverTimestamp() 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}