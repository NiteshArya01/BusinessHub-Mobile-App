// controllers/PurchaseController.js
import { db,auth } from '../api/firebase'; // Aapki firebase file
import { uploadFileToCloudinary } from '../api/cloudinaryService';
import { collection,query,addDoc,getDoc,deleteDoc, serverTimestamp, doc, updateDoc, increment,where,orderBy,getDocs,limit,startAfter } from 'firebase/firestore';


export const savePurchaseEntry = async (voucherData) => {

  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    const amount = parseFloat(voucherData.amount);
    const ledgerRef = collection(db, "supplierLedger");

    let balanceEffect = 0;
    let docRef;
    let finalFileUrl = null;

    // 1. FILE UPLOAD LOGIC (NEW OR EDIT)
    // Agar voucherData.files ke andar 'uri' hai, matlab naya file select hua hai
    if (voucherData.files && voucherData.files.uri) {
      const uploadResult = await uploadFileToCloudinary({
        uri: voucherData.files.uri,
        type: voucherData.files.mimeType,
        name: voucherData.files.name,
      });

      if (uploadResult) {
        finalFileUrl = uploadResult; // Cloudinary URL mil gaya
      }
    }

    // 🟢 NEW ENTRY
    if (!voucherData.id) {
      const newEntry = {
        userId: user.uid,
        supplierId: voucherData.partyId,
        entryType: voucherData.type,
        amount,
        date: voucherData.date,
        createdAt: serverTimestamp(),        
        details: {
          billNumber: voucherData.billNo || "",
          remarks: voucherData.remarks || "",
          attachment: finalFileUrl || "", // Agar file nahi hai to blank save hoga
        }
      };

      docRef = await addDoc(ledgerRef, newEntry);
      balanceEffect = amount;

    } 
    // 🟡 UPDATE ENTRY
    else {
      const docRefPath = doc(db, "supplierLedger", voucherData.id);

      // Old amount fetch karo balance calculate karne ke liye
      const oldSnap = await getDoc(docRefPath);
      if (!oldSnap.exists()) throw new Error("Document not found!");
      
      const oldData = oldSnap.data();
      const oldAmount = oldData.amount;
      balanceEffect = amount - oldAmount;

      // Update Object tayyar karo
      const updateData = {
        amount,
        date: voucherData.date,
        details: {
          billNumber: voucherData.billNo || "",
          remarks: voucherData.remarks || "",
          attachment: oldData.details?.attachment || ""
        }
      };

      // 🔥 SPECIAL LOGIC FOR FILE:
      // Agar naya file upload hua hai (finalFileUrl null nahi hai), tabhi update karo
      // Agar finalFileUrl null hai, matlab user ne koi nayi file select nahi ki, 
      // isliye hum is field ko touch hi nahi karenge (purana wala safe rahega)
      if (finalFileUrl) {
        updateData.details.attachment = finalFileUrl;
      }

      await updateDoc(docRefPath, updateData);
      docRef = { id: voucherData.id };
    }

    // 🔄 Balance Update
    const partyRef = doc(db, "suppliers", voucherData.partyId);
    await updateDoc(partyRef, {
      totalBalance: increment(balanceEffect)
    });

    return {
      success: true,
      id: docRef.id,
      message: "Purchase saved successfully!",
      url: finalFileUrl // Ye controller ko wapas de dete hain confirmation ke liye
    };

  } catch (error) {
    console.error("Purchase Save Error:", error);
    return { success: false, message: error.message };
  }
};





export const savePaymentEntry = async (paymentData) => {
  
  try {
    const user = auth.currentUser;

    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    const amount = parseFloat(paymentData.amount);
    const ledgerRef = collection(db, "supplierLedger");

    let balanceEffect = 0;
    let docId = null;

    let finalFileUrl = null;

    // 1. FILE UPLOAD LOGIC (NEW OR EDIT)
    // Agar voucherData.files ke andar 'uri' hai, matlab naya file select hua hai
    if (paymentData.files && paymentData.files.uri) {
      const uploadResult = await uploadFileToCloudinary({
        uri: paymentData.files.uri,
        type: paymentData.files.mimeType,
        name: paymentData.files.name,
      });

      if (uploadResult) {
        finalFileUrl = uploadResult; // Cloudinary URL mil gaya
      }
    }
    // 🟢 NEW PAYMENT
    if (!paymentData.id) {

      const newEntry = {
        userId: user.uid,
        supplierId: paymentData.partyId,
        entryType: "Payment",
        amount: amount,
        date: paymentData.date,
        createdAt: serverTimestamp(),
        details: {
          mode: paymentData.paymentMode || "",
          remarks: paymentData.remarks || "",
          attachment: finalFileUrl || null,
        }
      };

      const docRef = await addDoc(ledgerRef, newEntry);

      docId = docRef.id;

      // Payment balance ko reduce karta hai
      balanceEffect = -Math.abs(amount);
    }

    // 🟡 UPDATE PAYMENT
else {
  const docRefPath = doc(db, "supplierLedger", paymentData.id);

  // 1. Old data fetch karo
  const oldSnap = await getDoc(docRefPath);
  if (!oldSnap.exists()) {
    return { success: false, message: "Payment entry not found." };
  }

  const oldData = oldSnap.data();
  const oldAmount = oldData.amount;

  // 2. Balance effect calculate karo
  const difference = amount - oldAmount;
  balanceEffect = -difference;

  // 3. 🔥 Smart Attachment Logic
  // Agar naya file upload hua hai (finalFileUrl), toh woh use karo.
  // Agar nahi hua, toh jo database mein pehle se hai (oldData.details.attachment), use hi rehne do.
  const attachmentToSave = finalFileUrl || (oldData.details?.attachment || null);

  await updateDoc(docRefPath, {
    amount: amount,
    date: paymentData.date,
    details: {
      mode: paymentData.paymentMode || "",
      remarks: paymentData.remarks || "",
      attachment: attachmentToSave, // Purana wala ya naya URL
    }
  });

  docId = paymentData.id;
}

    // 🔄 Supplier Balance Update
    const partyRef = doc(db, "suppliers", paymentData.partyId);

    await updateDoc(partyRef, {
      totalBalance: increment(balanceEffect)
    });

    return {
      success: true,
      id: docId,
      message: "Payment saved successfully!"
    };

  } catch (error) {
    console.error("Payment Save Error:", error);
    return { success: false, message: error.message };
  }
};


export const fetchSupplierLedger = async (supplierId) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    if (!supplierId) {
      return { success: false, message: "Supplier ID missing." };
    }

    const ledgerRef = collection(db, "supplierLedger");

    const q = query(
      ledgerRef,
      where("userId", "==", user.uid),      // 🔐 Security
      where("supplierId", "==", supplierId), // 🎯 Selected supplier
      orderBy("createdAt", "desc")          // 📅 Latest first
    );

    const querySnapshot = await getDocs(q);

    const ledgerData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: ledgerData
    };

  } catch (error) {
    console.error("Fetch Ledger Error:", error);
    return {
      success: false,
      message: error.message
    };
  }
};


export const fetchSupplierLedgerPaginated = async ({
  supplierId,
  lastDoc = null,
  pageSize = 20
}) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    if (!supplierId) {
      return { success: false, message: "Supplier ID missing." };
    }

    const ledgerRef = collection(db, "supplierLedger");

    let q;

    if (lastDoc) {
      q = query(
        ledgerRef,
        where("userId", "==", user.uid),
        where("supplierId", "==", supplierId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        ledgerRef,
        where("userId", "==", user.uid),
        where("supplierId", "==", supplierId),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };

  } catch (error) {
    console.error("Pagination Fetch Error:", error);
    return { success: false, message: error.message };
  }
};


/**
 * Deletes a purchase transaction and reverts the supplier's balance.
 * @param {string} transactionId - The unique ID of the ledger entry.
 */
export const deletePurchaseTransaction = async (transactionId) => {
  try {
    // 1. Fetch the existing transaction to get amount and supplier details
    const docRef = doc(db, "supplierLedger", transactionId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { 
        success: false, 
        message: "Transaction record not found in the database." 
      };
    }

    const { supplierId, amount } = snap.data();

    /**
     * BALANCE REVERSION LOGIC:
     * Since a Purchase adds to the liability (+Amount), 
     * deleting it must subtract the amount (-Amount) from the supplier's total balance.
     */
    const balanceAdjustment = -Math.abs(amount);

    // 2. Revert Supplier's Total Balance
    const supplierRef = doc(db, "suppliers", supplierId);
    await updateDoc(supplierRef, {
      totalBalance: increment(balanceAdjustment)
    });

    // 3. Remove the entry from Ledger
    await deleteDoc(docRef);

    return { 
      success: true, 
      message: "Transaction deleted and account balance adjusted successfully." 
    };

  } catch (error) {
    console.error("Delete Transaction Error:", error);
    return { 
      success: false, 
      message: "An error occurred while attempting to delete the record." 
    };
  }
};