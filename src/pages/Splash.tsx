import React, { useState } from 'react';
import { doc, getDocs, collection, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function Splash() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      if (formData.password.length < 4) return "Password must be at least 4 characters";
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
      // Mock reset for direct access
      toast.success("In direct mode, you can just re-register or use any password if you forget.");
      setSuccessMessage("Direct Access: Password reset not required. Try signing in.");
      setTimeout(() => {
        setMode('login');
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

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
      if (mode === 'login') {
        const q = query(collection(db, 'users'), where('email', '==', formData.email.toLowerCase()));
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, 'users');
          return; // should not reach here as handleFirestoreError throws
        }
        
        if (querySnapshot.empty) {
          throw new Error("No account found with this email.");
        }

        const userData = querySnapshot.docs[0].data() as any;
        // Simple password check (Note: In a real app we'd hash, but user asked for "direct" and "no auth error")
        if (userData.password && userData.password !== formData.password) {
          throw new Error("Incorrect password.");
        }

        login(userData);
        toast.success("Welcome to Learning!");
      } else {
        // Sign up
        const q = query(collection(db, 'users'), where('email', '==', formData.email.toLowerCase()));
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, 'users');
          return;
        }
        
        if (!querySnapshot.empty) {
          throw new Error("Email already registered. Try signing in.");
        }

        const uid = btoa(formData.email.toLowerCase()).replace(/=/g, '');
        const trialStart = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);

        const newUserData: any = {
          uid,
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password, // Storing for direct login simplicity as requested
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
      }
    } catch (err: any) {
      console.error(err);
      const message = err.message || "An unexpected error occurred.";
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
                onClick={() => setMode('login')}
                className={`w-full h-full rounded-xl font-bold transition-colors duration-300 ${mode === 'login' ? 'text-white' : 'text-muted-text hover:text-white'}`}
              >
                Sign In
              </button>
            </div>
            <div className="flex-1 relative z-10">
              <button 
                onClick={() => setMode('signup')}
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
            onClick={() => setMode('login')}
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
