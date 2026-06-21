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
  const [user, setUser] = useState<FirebaseUser | null>(() => {
    try {
      const saved = localStorage.getItem('_my_learn_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      }
    } catch {}
    return null;
  });
  const [userData, setUserData] = useState<UserData | null>(() => {
    try {
      const saved = localStorage.getItem('_my_learn_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.userData || null;
      }
    } catch {}
    return null;
  });
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
        // Sync custom local storage session with latest DB data
        const saved = localStorage.getItem('_my_learn_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.userData = data;
            localStorage.setItem('_my_learn_session', JSON.stringify(parsed));
          } catch {}
        }
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
    // If we already loaded a custom session, set loading to false immediately
    const saved = localStorage.getItem('_my_learn_session');
    if (saved) {
      setLoading(false);
    }

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
        // If we are currently in a custom session or guest session, don't wipe it
        setUser(current => {
          if (current?.uid === GUEST_AUTH_USER.uid) return current;
          
          try {
            const savedSession = localStorage.getItem('_my_learn_session');
            if (savedSession) {
              const parsed = JSON.parse(savedSession);
              if (parsed.user) {
                return parsed.user;
              }
            }
          } catch {}
          
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
      setUserData(data);
      const mockUser = {
        uid: data.uid,
        email: data.email,
        displayName: data.name
      } as FirebaseUser;
      setUser(mockUser);
      localStorage.setItem('_my_learn_session', JSON.stringify({ user: mockUser, userData: data }));
    } catch (err) {
      console.error("Login state update error:", err);
    }
  };

  const signup = async (data: UserData) => {
    try {
      await setDoc(doc(db, 'users', data.uid), data, { merge: true });
      setUserData(data);
      const mockUser = {
        uid: data.uid,
        email: data.email,
        displayName: data.name
      } as FirebaseUser;
      setUser(mockUser);
      localStorage.setItem('_my_learn_session', JSON.stringify({ user: mockUser, userData: data }));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${data.uid}`);
    }
  };

  const continueAsGuest = async () => {
    setLoading(true);
    try {
      setUser(GUEST_AUTH_USER);
      await fetchUserData(GUEST_AUTH_USER.uid);
      localStorage.setItem('_my_learn_session', JSON.stringify({ user: GUEST_AUTH_USER, userData: GUEST_USER_DATA }));
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
      localStorage.removeItem('_my_learn_session');
      await signOut(auth).catch(() => {});
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
