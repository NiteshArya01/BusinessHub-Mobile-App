// controllers/PurchaseController.js
import { db,auth } from '../api/firebase'; // Aapki firebase file
import { collection,query,addDoc, serverTimestamp, doc, updateDoc, increment,where,orderBy,getDocs,limit,startAfter } from 'firebase/firestore';

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

    // 🟢 NEW ENTRY
    if (!voucherData.id) {

      const newEntry = {
        userId: user.uid,
        supplierId: voucherData.partyId,
        entryType: voucherData.type, // purchaseVoucher / purchaseInventory
        amount,
        date: voucherData.date,
        createdAt: serverTimestamp(),
        details: {
          billNumber: voucherData.billNo || "",
          remarks: voucherData.remarks || ""
        }
      };

      docRef = await addDoc(ledgerRef, newEntry);

      balanceEffect = amount; // full add

    } 
    // 🟡 UPDATE ENTRY
    else {

      const docRefPath = doc(db, "supplierLedger", voucherData.id);

      // 🔥 Old amount fetch karo
      const oldSnap = await getDoc(docRefPath);
      const oldAmount = oldSnap.data().amount;

      // difference nikalo
      balanceEffect = amount - oldAmount;

      await updateDoc(docRefPath, {
        amount,
        date: voucherData.date,
        details: {
          billNumber: voucherData.billNo || "",
          remarks: voucherData.remarks || ""
        }
      });

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
      message: "Purchase saved successfully!"
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

    // 🟢 NEW PAYMENT
    if (!paymentData.id) {

      const newEntry = {
        userId: user.uid,
        supplierId: paymentData.partyId,
        entryType: "payment",
        amount: amount,
        date: paymentData.date,
        createdAt: serverTimestamp(),
        details: {
          mode: paymentData.paymentMode || "",
          remarks: paymentData.remarks || "",
          attachment: paymentData.attachment || null,
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

      // 🔥 Old amount fetch karo
      const oldSnap = await getDoc(docRefPath);

      if (!oldSnap.exists()) {
        return { success: false, message: "Payment entry not found." };
      }

      const oldAmount = oldSnap.data().amount;

      // Difference nikaalo
      const difference = amount - oldAmount;

      // Payment me difference bhi minus hoga
      balanceEffect = -difference;

      await updateDoc(docRefPath, {
        amount: amount,
        date: paymentData.date,
        details: {
          mode: paymentData.paymentMode || "",
          remarks: paymentData.remarks || "",
          attachment: paymentData.attachment || null,
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



// 2. Fetch Purchases with Filters (New)
// export const fetchPurchases = async (filters = {}) => {
//   try {
//     const { supplierId } = filters;
//     const currentUser = auth.currentUser; // Current login user ki ID

//     if (!currentUser) {
//       return { success: false, message: "User not logged in" };
//     }

//     if (!supplierId) {
//       return { success: false, message: "Supplier ID is missing" };
//     }

//     const purchaseRef = collection(db, 'purchases');
    
//     // 1. Pehla filter: Sirf current user ka data (Security)
//     // 2. Doosra filter: Sirf us specific supplier ka data
//     const q = query(
//       purchaseRef,
//       where("userId", "==", currentUser.uid),     // Login user check
//       where("supplierId", "==", supplierId),      // Particular supplier check
//       orderBy("createdAt", "desc")                // Latest transactions first
//     );

//     const querySnapshot = await getDocs(q);

//     const results = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     return { success: true, data: results };

//   } catch (error) {
//     console.error("Firebase Fetch Error:", error);
//     return { success: false, message: error.message };
//   }
// };

// make supplier payment entry in ledger and update balance
// export const savePaymentEntry = async (paymentData) => {
//   try {
//     const user = auth.currentUser;
//     if (!user) {
//       return { success: false, message: "User not logged in." };
//     }

//     const ledgerRef = collection(db, 'supplierLedger');

//     // --- 1. Structured Payment Data ---
//     const newEntry = {
//       userId: user.uid,
//       supplierId: paymentData.partyId,
//       date: paymentData.date,
//       totalAmount: parseFloat(paymentData.amount), // Main field for easy calculation
//       entryType: 'Payment', // Filter karne ke liye
//       createdAt: serverTimestamp(),
      
//       // Payment specific details ek object ke andar
//       paymentDetails: {
//         mode: paymentData.paymentMode,
//         remarks: paymentData.remarks || "",
//         attachment: paymentData.attachment || null,
//       }
//     };

//     // 2. Save Entry
//     const docRef = await addDoc(ledgerRef, newEntry);

//     // 3. Update Supplier Balance (Minus logic)
//     const partyRef = doc(db, 'suppliers', paymentData.partyId);
//     const amountToSubtract = -Math.abs(parseFloat(paymentData.amount));

//     await updateDoc(partyRef, {
//       totalBalance: increment(amountToSubtract)
//     });

//     return { success: true, id: docRef.id, message: "Payment added to ledger!" };

//   } catch (error) {
//     console.error("Payment Save Error:", error);
//     return { success: false, message: error.message };
//   }
// };