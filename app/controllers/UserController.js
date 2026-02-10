import { auth, db } from '../api/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, writeBatch } from 'firebase/firestore'; // writeBatch add kiya
import { createUserProfile } from '../models/UsersModel';

export const UserController = {
  registerUser: async (email, password, businessName) => {
    try {
      // 1. Firebase Auth se user account banana
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Models taiyaar karna
      const userProfile = createUserProfile(user.uid, businessName, email);

      // Default Subscription Model (Naya)
      const userSubscription = {
        uid: user.uid,
        planId: 'free_trial',
        planName: 'Free Trial',
        startDate: new Date().toISOString(),
        // 7 din ki validity
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        paymentStatus: 'pending',
        lastPaymentId: null,
        invoiceLimit: 20,         // Default limit
        invoicesCreated: 0,
        storageLimitMB: 50,       // Fashion Point ke bills ke liye 50MB free
        storageUsedMB: 0,
        autoRenew: false,
        createdAt: new Date().toISOString()
      };

      // 3. Batch Write ka use karke dono documents save karna
      const batch = writeBatch(db);
      
      const userRef = doc(db, "users", user.uid);
      const subRef = doc(db, "userSubscriptions", user.uid); // Document ID = UID (taaki fetch karne mein aasaani ho)

      batch.set(userRef, userProfile);
      batch.set(subRef, userSubscription);

      // Final commit
      await batch.commit();

      return { success: true, user: userProfile };
    } catch (error) {
      console.error("Signup Error:", error);
      let msg = "Registration failed!";
      if (error.code === 'auth/email-already-in-use') msg = "This email is already registered!";
      if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters!";
      
      return { success: false, error: msg };
    }
  }
};