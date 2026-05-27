import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export const mapAuthError = (err: any): string => {
  const code = err?.code || '';
  const msg = err?.message || '';
  
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered in Workspace Nexus.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email address or password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Social login popup was closed before authentication completed.';
    case 'auth/unauthorized-domain':
      return 'This deployment domain is unauthorized for Google OAuth. Please configure it in your Firebase settings.';
    default:
      return msg || 'An unexpected authentication error occurred.';
  }
};

export const authService = {
  login: async (data: any) => {
    if (!auth) {
      throw new Error("Firebase Auth is unconfigured.");
    }
    try {
      return await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  signup: async (data: any) => {
    if (!auth) {
      throw new Error("Firebase Auth is unconfigured.");
    }
    try {
      return await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  updatePassword: async (data: any) => {
    if (!auth || !auth.currentUser) {
      throw new Error("No active user session.");
    }
    try {
      return await firebaseUpdatePassword(auth.currentUser, data.password);
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  deleteAccount: async () => {
    if (!auth || !auth.currentUser) {
      throw new Error("No active user session.");
    }
    try {
      return await firebaseDeleteUser(auth.currentUser);
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  }
};
