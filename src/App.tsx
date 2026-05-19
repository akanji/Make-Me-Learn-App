import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { A2AProvider } from './context/A2AContext';
import { Layout } from './components/Layout';
import { Splash } from './pages/Splash';
import { Dashboard } from './pages/Dashboard';
import { AllCourses } from './pages/AllCourses';
import { CourseDetail } from './pages/CourseDetail';
import { AiTutor } from './pages/AiTutor';
import { Assessments } from './pages/Assessments';
import { AssessmentsList } from './pages/AssessmentsList';
import { Certificates } from './pages/Certificates';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { CreativeStudio } from './pages/CreativeStudio';
import { MyLearning } from './pages/MyLearning';
import { motion, AnimatePresence } from 'motion/react';
import { Medal } from 'lucide-react';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-purple-glow" />
    </div>
  );

  if (!user) return <Splash />;

  // Paywall check
  const isTrialEnded = userData?.plan === 'trial' && userData.trialEnd && userData.trialEnd.toDate() < new Date();
  
  if (isTrialEnded && userData.subscriptionStatus === 'inactive' && location.pathname !== '/settings') {
    return <Paywall />;
  }

  return <Layout>{children}</Layout>;
}

function Paywall() {
  return (
    <div className="fixed inset-0 z-[100] bg-surface-base flex items-center justify-center p-6">
      <div className="bg-surface-card border border-brand-border p-10 rounded-3xl max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
          <Medal size={40} />
        </div>
        
        <h2 className="text-4xl font-display font-black mb-4">Your Free Trial Has Ended</h2>
        <p className="text-muted-text text-lg mb-10">Choose a plan to continue your learning journey and unlock all AI features.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
          <div className="bg-surface-elevated p-6 rounded-2xl border border-primary/30">
            <h3 className="font-bold mb-1">Monthly Plan</h3>
            <p className="text-2xl font-display font-black">$9.99<span className="text-xs text-muted-text">/mo</span></p>
            <p className="text-xs text-muted-text mt-2">Billed monthly</p>
          </div>
          <div className="bg-surface-elevated p-6 rounded-2xl border border-dark-brand/30">
            <h3 className="font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-rich-wine">Yearly Plan</h3>
            <p className="text-2xl font-display font-black">$99.99<span className="text-xs text-muted-text">/yr</span></p>
            <p className="text-xs text-muted-text mt-2">Save 17% annually</p>
          </div>
        </div>

        <Link 
          to="/settings"
          className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-black text-xl shadow-purple-glow transition-all block"
        >
          Explore Plans →
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <A2AProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><AllCourses /></ProtectedRoute>} />
              <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/tutor" element={<ProtectedRoute><AiTutor /></ProtectedRoute>} />
              <Route path="/creative" element={<ProtectedRoute><CreativeStudio /></ProtectedRoute>} />
              <Route path="/assessments" element={<ProtectedRoute><AssessmentsList /></ProtectedRoute>} /> {/* List courses to pick assessment */}
              <Route path="/assessment/:id" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
              <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </A2AProvider>
    </AuthProvider>
  );
}
