import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export const AuthController = {
  login: async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, message: "Email and password are required." };
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };

    } catch (error) {
      console.error("Auth Error:", error.code);
      
      let msg = "Login failed. Please try again.";

      switch (error.code) {
        case 'auth/invalid-email':
          msg = "Invalid email format.";
          break;
        case 'auth/user-not-found':
          msg = "Account not found. Please sign up.";
          break;
        case 'auth/wrong-password':
          msg = "Incorrect password.";
          break;
        case 'auth/too-many-requests':
          msg = "Too many attempts. Try again later.";
          break;
        case 'auth/network-request-failed':
          msg = "No internet connection.";
          break;
        case 'auth/user-disabled':
          msg = "Account disabled. Contact support.";
          break;
      }
      
      return { success: false, message: msg };
    }
  }
};