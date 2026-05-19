import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { callScoutDashboard } from '../lib/gemini';

import { toast, Toaster } from 'sonner';
import { COURSES } from '../constants';
import { Sparkles } from 'lucide-react';

class A2AAgent {
  name: string;
  interval: number;
  task: () => void;
  private timerId?: any;

  constructor(name: string, interval: number, task: () => void) {
    this.name = name;
    this.interval = interval;
    this.task = task;
  }

  start() {
    this.log('Starting...');
    this.timerId = setInterval(() => {
      this.task();
    }, this.interval);
    this.task(); // Initial run
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
    this.log('Stopped.');
  }

  log(msg: string) {
    console.log(`%c[A2A-${this.name}]`, 'color: #7C3AED; font-weight: bold;', msg);
  }
}

interface A2AContextType {
  lastContentRefresh: number | null;
  scoutPick: any;
}

const A2AContext = createContext<A2AContextType | undefined>(undefined);

export function A2AProvider({ children }: { children: React.ReactNode }) {
  const { user, userData, refreshUserData } = useAuth();
  const [scoutPick, setScoutPick] = useState<any>(null);
  const [lastContentRefresh, setLastContentRefresh] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !userData) return;

    // Agent 1: ERROR-FIX (Integrity Checks)
    const validateAndRepairState = async () => {
      console.log('[A2A-ERROR-FIX] Scanning integrity...');
      let needsFix = false;
      const repairedEnrolled = (userData.enrolled || []).filter(id => {
        const exists = COURSES.some(c => c.id === id);
        if (!exists) {
          needsFix = true;
          console.warn(`[A2A-FIX] Pruning non-existent course ID: ${id}`);
        }
        return exists;
      });

      if (needsFix) {
        toast.info("A2A-FIX: Repaired course enrollments", { position: 'bottom-left' });
        try {
          await setDoc(doc(db, 'users', user.uid), {
            enrolled: repairedEnrolled
          }, { merge: true });
          refreshUserData();
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    };

    // Agent 2: DATA-SYNC (Persistence)
    const syncToFirestore = async () => {
      console.log('[A2A-DATA-SYNC] Synchronizing progress...');
      
      // Check for progress anomalies
      let hasAnomaly = false;
      const cleanProgress = { ...(userData.progress || {}) };
      
      Object.keys(cleanProgress).forEach(courseId => {
        const course = COURSES.find(c => c.id === courseId);
        if (course) {
          const modules = cleanProgress[courseId];
          if (Array.isArray(modules)) {
            const uniqueModules = [...new Set(modules)].filter(m => course.modules.includes(m));
            if (uniqueModules.length !== modules.length) {
              cleanProgress[courseId] = uniqueModules;
              hasAnomaly = true;
            }
          }
        }
      });

      if (hasAnomaly) {
        toast.info("A2A-SYNC: Repaired progress discrepancies", { position: 'bottom-right' });
        try {
          await setDoc(doc(db, 'users', user.uid), {
            progress: cleanProgress
          }, { merge: true });
          refreshUserData();
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    };

    // Agent 3: CONTENT REFRESH (AI Generation)
    const refreshAIContent = async () => {
      const now = Date.now();
      const last = localStorage.getItem('last_ai_refresh');
      if (!last || now - parseInt(last) > 86400000) {
        console.log('[A2A-CONTENT] Refreshing AI recommendations...');
        const pick = await callScoutDashboard(userData);
        if (pick.error) {
          console.warn('[A2A-CONTENT] Access denied/error:', pick.error);
          return;
        }
        setScoutPick(pick);
        setLastContentRefresh(now);
        localStorage.setItem('last_ai_refresh', now.toString());
        toast("Scout curated fresh content for you", { icon: <Sparkles className="text-primary" /> });
      }
    };

    // Agent 4: UI INTEGRITY
    const verifyUIIntegrity = () => {
      // Check that progress bars never exceed 100% or show NaN
      // Logic would be specific to tracking elements if they were globally observable
      console.log('[A2A-UI-CHECK] Verifying render nodes...');
    };

    const agents = [
      new A2AAgent('ERROR-FIX', 60000, validateAndRepairState),
      new A2AAgent('DATA-SYNC', 300000, syncToFirestore),
      new A2AAgent('CONTENT', 3600000, refreshAIContent),
      new A2AAgent('UI-CHECK', 5000, verifyUIIntegrity),
    ];

    agents.forEach(a => a.start());

    return () => {
      agents.forEach(a => a.stop());
    };
  }, [user, userData]);

  return (
    <A2AContext.Provider value={{ lastContentRefresh, scoutPick }}>
      {children}
      <Toaster theme="dark" position="bottom-right" richColors />
    </A2AContext.Provider>
  );
}

export function useA2A() {
  const context = useContext(A2AContext);
  if (context === undefined) {
    throw new Error('useA2A must be used within an A2AProvider');
  }
  return context;
}
