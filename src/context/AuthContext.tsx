import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  auth,
  db,
  googleAuthProvider,
  signInWithPopup,
  fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  testConnection,
} from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { initializeDataStore } from '../services/dataService';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: 'student' | 'instructor'
  ) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  loginQuickUser: (role: 'student' | 'instructor' | 'admin') => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'arishrizvi_b-1636@kmclu.ac.in';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to fetch or create user in Firestore
  const syncUserProfile = async (
    user: FirebaseUser,
    explicitRole?: UserRole,
    overrideName?: string
  ): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    const isAdminEmail = user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (isAdminEmail && data.role !== 'admin') {
          data.role = 'admin';
          await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
          await setDoc(doc(db, 'admins', user.uid), {
            email: user.email,
            createdAt: new Date().toISOString(),
          });
        }
        return data;
      }
    } catch (err) {
      console.warn('Error reading user document:', err);
    }

    const assignedRole: UserRole = isAdminEmail
      ? 'admin'
      : explicitRole || 'student';

    const newProfile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName:
        overrideName ||
        user.displayName ||
        user.email?.split('@')[0] ||
        'Acadia Scholar',
      photoURL:
        user.photoURL ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          user.displayName || user.email || 'User'
        )}`,
      role: assignedRole,
      bio:
        assignedRole === 'admin'
          ? 'Platform Super Administrator'
          : assignedRole === 'instructor'
          ? 'Lead Technical Instructor & Course Author'
          : 'Lifelong Learner & Technical Student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, newProfile, { merge: true });
      if (assignedRole === 'admin') {
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Error saving user profile to Firestore:', err);
    }

    return newProfile;
  };

  useEffect(() => {
    testConnection();
    initializeDataStore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await syncUserProfile(user);
          setCurrentUser(profile);
        } catch (err) {
          console.error('Failed to sync authenticated profile:', err);
          setCurrentUser(null);
        }
      } else {
        // Visitor is not logged in
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = await syncUserProfile(cred.user);
      setCurrentUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: 'student' | 'instructor'
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, { displayName });
      const profile = await syncUserProfile(cred.user, role, displayName);
      setCurrentUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const profile = await syncUserProfile(cred.user);
      setCurrentUser(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper login for rapid demonstration using authentic database accounts
  const loginQuickUser = async (role: 'student' | 'instructor' | 'admin'): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      let email = 'student@acadia.edu';
      let password = 'AcadiaStudent2026!';
      let name = 'Alex Rivers';

      if (role === 'admin') {
        email = BOOTSTRAP_ADMIN_EMAIL;
        password = 'AcadiaAdmin2026!';
        name = 'Arish Rizvi (Admin)';
      } else if (role === 'instructor') {
        email = 'instructor@hyperion.edu';
        password = 'AcadiaInstructor2026!';
        name = 'Prof. Julian Vance';
      }

      // Try signing in; if account doesn't exist, create it in Firebase Auth
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await syncUserProfile(cred.user, role, name);
        setCurrentUser(profile);
        return profile;
      } catch (signInErr: any) {
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential' ||
          signInErr.code === 'auth/wrong-password'
        ) {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: name });
          const profile = await syncUserProfile(cred.user, role, name);
          setCurrentUser(profile);
          return profile;
        }
        throw signInErr;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBio = async (bio: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, bio, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    try {
      await setDoc(doc(db, 'users', currentUser.id), { bio }, { merge: true });
    } catch (err) {
      console.warn('Could not persist bio update:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginQuickUser,
        logout,
        updateBio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
