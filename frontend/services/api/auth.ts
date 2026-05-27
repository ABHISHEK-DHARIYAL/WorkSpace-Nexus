import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const SANDBOX_USERS_KEY = 'workspace_nexus_sandbox_users';

type SandboxUserRecord = {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  isSocial: boolean;
  createdAt: string;
};

const normalizeEmail = (email: string) => (email || '').trim().toLowerCase();

const isSandboxAdmin = (email: string) => {
  const normalized = normalizeEmail(email);
  return [
    'heroofthevil311@gmail.com',
    'hshit7534@gmail.com',
    'rajveer@gmail.com',
    'rajveerhelloworld@gmail.com',
  ].includes(normalized);
};

const readSandboxUsers = (): Record<string, SandboxUserRecord> => {
  try {
    const raw = localStorage.getItem(SANDBOX_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to read sandbox users from localStorage:', err);
    return {};
  }
};

const writeSandboxUsers = (users: Record<string, SandboxUserRecord>) => {
  localStorage.setItem(SANDBOX_USERS_KEY, JSON.stringify(users));
};

const getCurrentSessionUserEmail = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return '';
    const parsed = JSON.parse(rawUser);
    return normalizeEmail(parsed?.email || '');
  } catch {
    return '';
  }
};

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
    case 'auth/requires-recent-login':
      return 'For security reasons, this action requires a recent sign-in. Please log out and sign in again before attempting to delete your account.';
    case 'auth/network-request-failed':
      return 'Network request failed. Please check your internet connection and try again.';
    default:
      return msg || 'An unexpected authentication error occurred.';
  }
};

export const authService = {
  loginSandbox: async (data: any) => {
    const email = normalizeEmail(data?.email || '');
    const password = data?.password || '';
    const users = readSandboxUsers();
    const user = users[email];

    if (!user) {
      throw new Error('No account found for this email. Please sign up first.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect email address or password. Please try again.');
    }

    return user;
  },

  signupSandbox: async (data: any) => {
    const email = normalizeEmail(data?.email || '');
    const password = data?.password || '';
    const users = readSandboxUsers();

    if (users[email]) {
      throw new Error('An account already exists for this email. Please sign in instead.');
    }

    const nowIso = new Date().toISOString();
    const user: SandboxUserRecord = {
      email,
      password,
      name: email.split('@')[0] || 'Member',
      role: isSandboxAdmin(email) ? 'admin' : 'user',
      isSocial: false,
      createdAt: nowIso,
    };

    users[email] = user;
    writeSandboxUsers(users);
    return user;
  },

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
    if (auth && auth.currentUser) {
      try {
        return await firebaseUpdatePassword(auth.currentUser, data.password);
      } catch (err: any) {
        throw new Error(mapAuthError(err));
      }
    }

    const email = getCurrentSessionUserEmail();
    if (!email) {
      throw new Error('No active sandbox account was found.');
    }

    const users = readSandboxUsers();
    const user = users[email];
    if (!user) {
      throw new Error('This account no longer exists. Please sign up again.');
    }

    users[email] = {
      ...user,
      password: data.password,
      isSocial: false,
    };
    writeSandboxUsers(users);

    console.log("Mock updatePassword resolved successfully.");
    return true;
  },

  deleteAccount: async () => {
    const userEmail = auth?.currentUser?.email?.toLowerCase();
    const userUid = auth?.currentUser?.uid;
    
    // 1. Delete all Firestore models associated with this user
    if (db && (userEmail || userUid)) {
      try {
        console.log("Beginning cascade deletion for user:", userEmail);
        
        // --- 1.1 Delete user document from "users" collection ---
        if (userEmail) {
          const userDocRef = doc(db, "users", userEmail);
          await deleteDoc(userDocRef);
          console.log("Deleted user document from 'users'");
        }
        
        // --- 1.2 Find and delete all listings (projects) owned by the user ---
        const listingsToDelete: string[] = [];
        const listingsRef = collection(db, "listings");
        
        // Query by user's email or by user's uid
        const queries = [];
        if (userEmail) queries.push(query(listingsRef, where("owner", "==", userEmail)));
        if (userUid) queries.push(query(listingsRef, where("owner", "==", userUid)));
        
        for (const q of queries) {
          const listingSnap = await getDocs(q);
          listingSnap.forEach(docSnap => {
            if (!listingsToDelete.includes(docSnap.id)) {
              listingsToDelete.push(docSnap.id);
            }
          });
        }
        
        console.log(`Found ${listingsToDelete.length} listings/projects to delete.`);
        
        for (const listingId of listingsToDelete) {
          // A. Delete pages associated with the listing
          const pagesRef = collection(db, "pages");
          const pagesQ = query(pagesRef, where("listingId", "==", listingId));
          const pagesSnap = await getDocs(pagesQ);
          
          for (const pageDoc of pagesSnap.docs) {
            // Delete highlights associated with this page
            const highlightsRef = collection(db, "highlights");
            const highlightsQ = query(highlightsRef, where("pageId", "==", pageDoc.id));
            const highlightsSnap = await getDocs(highlightsQ);
            for (const hDoc of highlightsSnap.docs) {
              await deleteDoc(hDoc.ref);
            }
            
            // Delete the page itself
            await deleteDoc(pageDoc.ref);
          }
          
          // B. Delete doc_pages (Document Nexus pages) associated with the project/listing
          const docPagesRef = collection(db, "doc_pages");
          const docPagesQ = query(docPagesRef, where("projectId", "==", listingId));
          const docPagesSnap = await getDocs(docPagesQ);
          for (const dpDoc of docPagesSnap.docs) {
            await deleteDoc(dpDoc.ref);
          }
          
          // C. Delete doc_indices (Document Nexus outline indices) associated with the project/listing
          const docIndicesRef = collection(db, "doc_indices");
          const docIndicesQ = query(docIndicesRef, where("projectId", "==", listingId));
          const docIndicesSnap = await getDocs(docIndicesQ);
          for (const diDoc of docIndicesSnap.docs) {
            await deleteDoc(diDoc.ref);
          }
          
          // D. Delete bookmarks & favorites of/associated with this project if any exist
          const bookmarksRef = collection(db, "bookmarks");
          const bookmarksQ = query(bookmarksRef, where("projectId", "==", listingId));
          const bookmarksSnap = await getDocs(bookmarksQ);
          for (const bDoc of bookmarksSnap.docs) {
            await deleteDoc(bDoc.ref);
          }
          
          const favoritesRef = collection(db, "favorites");
          const favoritesQ = query(favoritesRef, where("projectId", "==", listingId));
          const favoritesSnap = await getDocs(favoritesQ);
          for (const fDoc of favoritesSnap.docs) {
            await deleteDoc(fDoc.ref);
          }
          
          // E. Delete the listing document itself
          await deleteDoc(doc(db, "listings", listingId));
          console.log(`Permanently deleted listing: ${listingId} and all associated pages, highlights, and nexus content.`);
        }
        
        // --- 1.3 Find and delete workspaces owned by the user ---
        const workspacesRef = collection(db, "workspaces");
        const wsQueries = [];
        if (userEmail) wsQueries.push(query(workspacesRef, where("owner", "==", userEmail)));
        if (userUid) wsQueries.push(query(workspacesRef, where("owner", "==", userUid)));
        
        const workspacesToDelete: string[] = [];
        for (const q of wsQueries) {
          const wsSnap = await getDocs(q);
          wsSnap.forEach(docSnap => {
            if (!workspacesToDelete.includes(docSnap.id)) {
              workspacesToDelete.push(docSnap.id);
            }
          });
        }
        
        for (const wsId of workspacesToDelete) {
          await deleteDoc(doc(db, "workspaces", wsId));
          console.log(`Deleted workspace: ${wsId}`);
        }
        
        // --- 1.4 Delete bookmarks & favorites created by this user ---
        const myBookmarksQueries = [];
        if (userEmail) {
          const bookmarksRef = collection(db, "bookmarks");
          myBookmarksQueries.push(query(bookmarksRef, where("userEmail", "==", userEmail)));
          myBookmarksQueries.push(query(collection(db, "favorites"), where("userEmail", "==", userEmail)));
          myBookmarksQueries.push(query(collection(db, "follows"), where("userEmail", "==", userEmail)));
        }
        for (const mq of myBookmarksQueries) {
          const mSnap = await getDocs(mq);
          for (const docSnap of mSnap.docs) {
            await deleteDoc(docSnap.ref);
          }
        }
        
      } catch (dbErr) {
        console.error("Failed to perform complete Firestore cascade deletion during account purge:", dbErr);
        // Continue with user profile and Auth deletion anyway to not block the user
      }
    }
    
    // 2. Finally, delete user profile from Firebase Authentication itself
    if (auth && auth.currentUser) {
      try {
        const user = auth.currentUser;
        await firebaseDeleteUser(user);
        
        // Explicitly signOut to update dynamic listeners we have set up
        try {
          await auth.signOut();
        } catch (signOutErr) {
          console.warn("SignOut during account deletion: ", signOutErr);
        }
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/user-not-found') {
          console.warn("User already deleted or not found in Firebase Auth; proceeding with local cleanup.");
          try {
            await auth.signOut();
          } catch (signOutErr) {
            console.warn("SignOut clean: ", signOutErr);
          }
        } else {
          throw new Error(mapAuthError(err));
        }
      }
    }

    const email = getCurrentSessionUserEmail();
    if (email) {
      const users = readSandboxUsers();
      if (users[email]) {
        delete users[email];
        writeSandboxUsers(users);
      }
    }

    console.log("Mock deleteAccount resolved successfully.");
    return true;
  }
};
