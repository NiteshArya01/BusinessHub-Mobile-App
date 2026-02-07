import { auth, db } from '../api/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { createUserProfile } from '../models/UsersModel'; // Data structure ke liye

export const UserController = {
  // ✅ Sirf Register function par focus
  registerUser: async (email, password, businessName) => {
    try {
      // 1. Firebase Auth se user account banana
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Model ka use karke user profile data taiyaar karna
      const userProfile = createUserProfile(user.uid, businessName, email);

      // 3. Firestore database mein 'users' collection ke andar save karna
      await setDoc(doc(db, "users", user.uid), userProfile);

      return { success: true, user: userProfile };
    } catch (error) {
      let msg = "Registration failed!";
      if (error.code === 'auth/email-already-in-use') msg = "Ye email pehle se registered hai!";
      if (error.code === 'auth/weak-password') msg = "Password kam se kam 6 characters ka rakhein!";
      
      return { success: false, error: msg };
    }
  }
};