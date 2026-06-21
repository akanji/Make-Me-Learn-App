import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDocs, collection, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithCustomToken } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function Splash() {
  const { login, signup, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  
  const promptSubscriptionSelection = (userId: string) => {
    navigate('/settings');
  };

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTabChange = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: ''
  });

  const validateForm = () => {
    if (mode === 'signup' && !formData.name.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Invalid email format";
    
    if (mode !== 'reset') {
      if (!formData.password) return "Password is required";
      if (formData.password.length < 6) return "Password must be at least 6 characters";
    }
    
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, formData.email.toLowerCase());
      toast.success("Password reset email sent!");
      setSuccessMessage("Check your inbox for a secure link to reset your password.");
      setTimeout(() => {
        handleTabChange('login');
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const isSignInTab = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'reset') return handleResetPassword(e);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const email = formData.email.toLowerCase();
      const password = formData.password;

      if (isSignInTab) {
        try {
          // Attempt authentication via Express endpoint /api/auth/signin
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Authentication failed.");
          }

          const data = await response.json();
          if (data.isCustomAuth && data.userData) {
            login(data.userData);
            toast.success("Welcome back!");
            return;
          }

          if (data.customToken) {
            await signInWithCustomToken(auth, data.customToken).catch((err) => {
              console.warn("Client token signin failed, using custom local login state:", err);
              if (data.userData) {
                login(data.userData);
                return;
              }
              throw err;
            });
            toast.success("Welcome back!");
            return;
          }

          // Fallback to client-side login directly if token is missing
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Welcome back!");
        } catch (err: any) {
          // Check for legacy migration
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || (err.message && (err.message.includes("Authentication failed") || err.message.includes("credentials")))) {
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const legacyUser = querySnapshot.docs[0].data();
              if (legacyUser.password === password) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const updatedData: any = { ...legacyUser, uid: firebaseUser.uid };
                delete updatedData.password;
                await signup(updatedData as any);
                toast.success("Welcome back! Your account has been securely migrated.");
                return;
              }
            }
          }
          throw err;
        }
      } else {
        // Attempt registration via Express endpoint /api/auth/signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: formData.name,
            country: formData.country
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Signup failed.");
        }

        const data = await response.json();
        if (data.isCustomAuth && data.userData) {
          await signup(data.userData);
          toast.success("Account created successfully!");
          promptSubscriptionSelection(data.uid);
          return;
        }

        if (data.customToken) {
          await signInWithCustomToken(auth, data.customToken).catch(async (err) => {
            console.warn("Client token signup signin failed, registering custom session status:", err);
            if (data.userData) {
              await signup(data.userData);
              return;
            }
            throw err;
          });
          toast.success("Account created successfully!");
          promptSubscriptionSelection(data.uid);
          return;
        }

        // Fallback to pure client-side signup if token missing
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const trialStart = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);

        const newUserData: any = {
          uid: firebaseUser.uid,
          name: formData.name,
          email: email,
          country: formData.country,
          plan: 'trial',
          trialStart: Timestamp.fromDate(trialStart),
          trialEnd: Timestamp.fromDate(trialEnd),
          subscriptionStatus: 'inactive',
          nameVerified: false,
          enrolled: [],
          progress: {},
          createdAt: serverTimestamp()
        };

        await signup(newUserData);
        toast.success("Account created successfully!");
        promptSubscriptionSelection(firebaseUser.uid);
      }
    } catch (err: any) {
      let message = "An unexpected error occurred.";
      const errorCode = err.code || (err.message?.includes('auth/') ? err.message.match(/auth\/[a-z0-9-]+/)?.[0] : null);
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        message = "Invalid email or password. Please check your credentials.";
      } else if (errorCode === 'auth/email-already-in-use') {
        message = "This email is already in use. If you have an account, please sign in.";
      } else if (errorCode === 'auth/weak-password') {
        message = "Password is too weak. It must be at least 6 characters.";
      } else if (err.message && !err.message.includes('Firebase:')) {
        message = err.message;
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rich-wine/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-surface-card border border-brand-border rounded-3xl p-8 lg:p-12 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-purple-glow mb-4 animate-float">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight mb-2 uppercase">
            {mode === 'reset' ? 'Reset Password' : 'MAKE ME LEARN'}
          </h1>
          <p className="text-muted-text">
            {mode === 'reset' ? 'Enter your email to receive a secure link' : 'Premium AI-Powered Learning Platform'}
          </p>
        </div>

        {mode !== 'reset' ? (
          <div className="flex bg-surface-base/50 p-1 rounded-2xl mb-8 relative border border-brand-border h-14">
            <div className="flex-1 relative z-10">
              <button 
                onClick={() => handleTabChange('login')}
                className={`w-full h-full rounded-xl font-bold transition-colors duration-300 ${mode === 'login' ? 'text-white' : 'text-muted-text hover:text-white'}`}
              >
                Sign In
              </button>
            </div>
            <div className="flex-1 relative z-10">
              <button 
                onClick={() => handleTabChange('signup')}
                className={`w-full h-full rounded-xl font-bold transition-colors duration-300 ${mode === 'signup' ? 'text-white' : 'text-muted-text hover:text-white'}`}
              >
                Create Account
              </button>
            </div>
            <motion.div 
              layoutId="active-pill"
              className="absolute inset-y-1 bg-primary/80 backdrop-blur-sm rounded-xl shadow-[0_0_20px_rgba(107,33,168,0.4)]"
              initial={false}
              animate={{ 
                left: mode === 'login' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)' 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                mass: 0.8
              }}
            />
          </div>
        ) : (
          <button 
            onClick={() => handleTabChange('login')}
            className="flex items-center gap-2 text-muted-text hover:text-primary transition-colors mb-6 font-bold"
          >
            <ArrowLeft size={18} /> Back to Sign In
          </button>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 overflow-hidden"
            >
              <Lock size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 overflow-hidden"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              <Input icon={User} placeholder="Full Name" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} required />
              <Input icon={MapPin} placeholder="Country" value={formData.country} onChange={(v: string) => setFormData({...formData, country: v})} />
            </motion.div>
          )}

          <Input icon={Mail} type="email" placeholder="Email Address" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />
          
          {mode !== 'reset' && (
            <div className="space-y-2">
              <Input icon={Lock} type="password" placeholder="Password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} required />
              {mode === 'login' && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => setMode('reset')}
                    className="text-xs font-bold text-muted-text hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-purple-glow transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'reset' ? 'Send Reset Link' : (mode === 'login' ? 'Sign In' : 'Start 7-Day Free Trial')}
          </button>

          {!loading && mode !== 'reset' && (
            <button 
              type="button" 
              onClick={() => continueAsGuest()}
              className="w-full bg-surface-elevated hover:bg-surface-elevated/80 text-white py-4 rounded-2xl font-bold text-lg border border-brand-border transition-all flex items-center justify-center gap-2"
            >
              Continue as Guest
            </button>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-muted-text">
          By continuing, you agree to our <span className="text-white underline cursor-pointer">Terms of Service</span> and <span className="text-white underline cursor-pointer">Privacy Policy</span>.
        </div>
      </motion.div>
    </div>
  );
}

function Input({ icon: Icon, value, onChange, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text group-focus-within:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <input 
        className="w-full bg-surface-elevated/50 border border-brand-border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:bg-surface-elevated transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
