import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  ClipboardCheck, 
  Award, 
  UserCircle, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'All Courses', icon: BookOpen, path: '/courses' },
    { name: 'My Learning', icon: GraduationCap, path: '/my-learning' },
    { name: 'AI Tutor', icon: MessageSquare, path: '/tutor' },
    { name: 'Creative Studio', icon: Zap, path: '/creative' },
    { name: 'Assessments', icon: ClipboardCheck, path: '/assessments' },
    { name: 'Certificates', icon: Award, path: '/certificates' },
    { name: 'Profile', icon: UserCircle, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-surface-card border-r border-brand-border z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-purple-glow">
            <GraduationCap className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-muted-text">
            MAKE ME LEARN
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-rich-wine/20 text-white border-l-4 border-rich-wine" 
                  : "text-muted-text hover:bg-surface-elevated hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-brand-border mt-auto">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-surface-elevated/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-rich-wine flex items-center justify-center text-white font-bold border border-white/20">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{userData?.name || 'Guest'}</p>
              <p className="text-xs text-muted-text truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-text hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useAuth();

  const trialRemainingCount = () => {
    if (!userData?.trialEnd) return 0;
    const diff = userData.trialEnd.toDate().getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = trialRemainingCount();

  return (
    <div className="min-h-screen bg-surface-base">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-72 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Trial Banner */}
        {userData?.plan === 'trial' && daysLeft > 0 && (
          <div className="bg-primary px-4 py-2 flex items-center justify-between text-white text-sm font-medium">
            <div className="flex items-center gap-2">
              <span>🎉 Free Trial: {daysLeft} days remaining — Upgrade to keep learning</span>
            </div>
            <NavLink 
              to="/settings"
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
            >
              Upgrade →
            </NavLink>
          </div>
        )}

        <header className="lg:hidden p-4 border-b border-brand-border flex items-center justify-between bg-surface-card/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary w-6 h-6" />
            <span className="font-display font-bold">MAKE ME LEARN</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-muted-text">
            <Menu />
          </button>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
