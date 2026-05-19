import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { COURSES } from '../constants';

interface UserData {
  uid: string;
  name: string;
  email: string;
  country?: string;
  plan: 'free' | 'trial' | 'monthly' | 'yearly';
  trialStart?: any;
  trialEnd?: any;
  subscriptionStatus: 'inactive' | 'pending_payment' | 'active';
  nameVerified: boolean;
  enrolled: string[];
  progress: Record<string, string[]>;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  login: (userData: UserData) => void;
  signup: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_AUTH_USER = {
  uid: "guest_user_free_mode",
  email: "",
  displayName: "Guest User",
} as FirebaseUser;

const GUEST_USER_DATA: UserData = {
  uid: "guest_user_free_mode",
  name: "Guest User",
  email: "",
  plan: 'free',
  subscriptionStatus: 'inactive',
  nameVerified: true,
  enrolled: COURSES.map(c => c.id),
  progress: {},
  createdAt: new Date(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        const allCourseIds = COURSES.map(c => c.id);
        data.enrolled = Array.from(new Set([...(data.enrolled || []), ...allCourseIds]));
        setUserData(data);
      } else if (uid === GUEST_AUTH_USER.uid) {
        // Initialize guest doc in Firestore if missing
        await setDoc(docRef, { ...GUEST_USER_DATA, enrolled: COURSES.map(c => c.id) }, { merge: true });
        setUserData({ ...GUEST_USER_DATA, enrolled: COURSES.map(c => c.id) });
      } else {
        setUserData(null);
      }
    } catch (err) {
      if (uid === GUEST_AUTH_USER.uid) {
        setUserData({ ...GUEST_USER_DATA, enrolled: COURSES.map(c => c.id) });
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchUserData(firebaseUser.uid)
          .catch((err) => {
            console.error("Auth init fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to load user data");
          })
          .finally(() => setLoading(false));
      } else {
        // If we are currently a guest, don't clear the state when auth says null
        setUser(current => {
          if (current?.uid === GUEST_AUTH_USER.uid) return current;
          setUserData(null);
          return null;
        });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (data: UserData) => {
    try {
      // This is now handled by onAuthStateChanged after the actual auth sign-in
      setUserData(data);
    } catch (err) {
      console.error("Login state update error:", err);
    }
  };

  const signup = async (data: UserData) => {
    try {
      // In signup, we assume Firebase Auth user is already created and signed in
      await setDoc(doc(db, 'users', data.uid), data, { merge: true });
      setUserData(data);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${data.uid}`);
      // Don't re-throw unless we want the UI to handle it specifically, 
      // but let's ensure it's logged.
    }
  };

  const continueAsGuest = async () => {
    setLoading(true);
    try {
      setUser(GUEST_AUTH_USER);
      await fetchUserData(GUEST_AUTH_USER.uid);
    } catch (err) {
      console.error("Guest flow error:", err);
      // Fallback
      setUserData(GUEST_USER_DATA);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      error,
      refreshUserData: () => user ? fetchUserData(user.uid) : Promise.resolve(),
      login,
      signup,
      logout,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
