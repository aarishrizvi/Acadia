import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, signInWithPopup, fbSignOut, testConnection } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { initializeDataStore } from '../services/dataService';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: (role: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BOOTSTRAP_ADMIN_EMAIL = 'arishrizvi_b-1636@kmclu.ac.in';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial connection test and data store seeding
    testConnection();
    initializeDataStore();

    // Check stored demo session or listen to Firebase
    const savedDemoUser = localStorage.getItem('acadia_demo_user');
    if (savedDemoUser) {
      try {
        const parsed = JSON.parse(savedDemoUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error('Error parsing stored demo user', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Clear demo override if real auth exists
        localStorage.removeItem('acadia_demo_user');
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          const isAdminEmail = user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            if (isAdminEmail && data.role !== 'admin') {
              data.role = 'admin';
              await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
              await setDoc(doc(db, 'admins', user.uid), { email: user.email, createdAt: new Date().toISOString() }, { merge: true });
            }
            setCurrentUser(data);
          } else {
            const newUser: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Learner',
              photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
              role: isAdminEmail ? 'admin' : 'student',
              bio: isAdminEmail ? 'Platform Super Administrator & Senior Instructor' : 'Passionate lifelong learner',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newUser);
            if (isAdminEmail) {
              await setDoc(doc(db, 'admins', user.uid), { email: user.email, createdAt: new Date().toISOString() });
            }
            setCurrentUser(newUser);
          }
        } catch (error) {
          console.warn('Could not sync user with Firestore, fallback local session:', error);
          const fallbackUser: UserProfile = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Acadia Member',
            photoURL: user.photoURL || undefined,
            role: user.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'student',
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(fallbackUser);
        }
      } else if (!savedDemoUser) {
        // Set a default demo profile (Instructor/Student) so the user experiences full functionality immediately
        const defaultProfile: UserProfile = {
          id: 'demo-instructor-1',
          email: 'instructor@acadia.edu',
          displayName: 'Prof. Julian Vance',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
          role: 'instructor',
          bio: 'Lead System Architect & Founder at Hyperion Code Labs. 12+ years in distributed systems.',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(defaultProfile);
        localStorage.setItem('acadia_demo_user', JSON.stringify(defaultProfile));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoUser = async (role: UserRole) => {
    setIsLoading(true);
    let demoUser: UserProfile;
    if (role === 'admin') {
      demoUser = {
        id: 'admin-arish',
        email: BOOTSTRAP_ADMIN_EMAIL,
        displayName: 'Arish Rizvi (Admin)',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        role: 'admin',
        bio: 'Super Admin & Lead Platform Architect for ACADIA LMS.',
        createdAt: new Date().toISOString(),
      };
    } else if (role === 'instructor') {
      demoUser = {
        id: 'instructor-julian',
        email: 'julian.vance@acadia.edu',
        displayName: 'Prof. Julian Vance',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        role: 'instructor',
        bio: 'Founder of Hyperion Code Labs. Senior Distributed Systems Consultant.',
        createdAt: new Date().toISOString(),
      };
    } else {
      demoUser = {
        id: 'student-alex',
        email: 'alex.rivers@student.acadia.edu',
        displayName: 'Alex Rivers',
        photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80',
        role: 'student',
        bio: 'Frontend enthusiast transitioning to full-stack cloud engineering.',
        createdAt: new Date().toISOString(),
      };
    }

    setCurrentUser(demoUser);
    localStorage.setItem('acadia_demo_user', JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const switchRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem('acadia_demo_user', JSON.stringify(updated));
    // If real user is logged in, try updating Firestore
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.id), { role: newRole }, { merge: true });
      } catch (e) {
        console.warn('Local role switched; Firestore sync warning:', e);
      }
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('acadia_demo_user');
      if (firebaseUser) {
        await fbSignOut(auth);
      }
      // Revert to demo student
      loginAsDemoUser('student');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBio = async (bio: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, bio };
    setCurrentUser(updated);
    localStorage.setItem('acadia_demo_user', JSON.stringify(updated));
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.id), { bio }, { merge: true });
      } catch (e) {
        console.warn('Could not persist bio to Firestore:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isLoading,
        loginWithGoogle,
        loginAsDemoUser,
        switchRole,
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
