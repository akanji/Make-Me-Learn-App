import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserData {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  linkedin?: string;
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
  user: any | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  login: (userData: UserData) => void;
  signup: (userData: UserData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        setUserData(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('learn_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser.uid).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data: UserData) => {
    const authUser = { uid: data.uid, email: data.email };
    setUser(authUser);
    setUserData(data);
    localStorage.setItem('learn_user', JSON.stringify(authUser));
  };

  const signup = async (data: UserData) => {
    try {
      await setDoc(doc(db, 'users', data.uid), data);
      login(data);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${data.uid}`);
    }
  };

  const logout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('learn_user');
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
      logout
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
