import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, Globe, Linkedin, ShieldCheck, Camera, Save } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const { userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    country: userData?.country || '',
    linkedin: userData?.linkedin || ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', userData.uid), formData);
      await refreshUserData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-black">My Profile</h1>
        <p className="text-muted-text mt-1">Manage your identity and public presence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Verification */}
        <div className="space-y-6">
          <div className="bg-surface-card border border-brand-border rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-rich-wine flex items-center justify-center text-4xl font-display font-black text-white border-4 border-surface-elevated group-hover:rotate-6 transition-transform">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-surface-card text-white hover:bg-secondary transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-display font-black mb-1">{userData?.name}</h2>
            <p className="text-sm text-muted-text mb-6">Student since 2026</p>
            
            <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${
              userData?.nameVerified ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            }`}>
              <ShieldCheck size={14} /> {userData?.nameVerified ? 'Verified Identity' : 'Identity Pending'}
            </div>
          </div>

          <div className="bg-surface-card border border-brand-border rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg mb-2">Learning Stats</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Courses Enrolled</span>
              <span className="font-bold">{userData?.enrolled.length || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Average Score</span>
              <span className="font-bold">88%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <motion.form 
            onSubmit={handleSave}
            className="bg-surface-card border border-brand-border rounded-3xl p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-text">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                  <input 
                    className="w-full bg-surface-elevated/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-text">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                  <input 
                    className="w-full bg-surface-elevated/30 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-muted-text cursor-not-allowed"
                    value={userData?.email || ''}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-text">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                  <input 
                    className="w-full bg-surface-elevated/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-text">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                  <input 
                    className="w-full bg-surface-elevated/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-text">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                <input 
                  className="w-full bg-surface-elevated/50 border border-brand-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400 text-sm font-bold flex items-center gap-1"
                  >
                    <Check size={16} /> Profile Updated Successfully
                  </motion.div>
                )}
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-purple-glow flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

function Check({ size, className }: any) {
  return <ShieldCheck size={size || 20} className={className} />;
}
