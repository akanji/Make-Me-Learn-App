import React from 'react';
import { COURSES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ClipboardCheck, Lock, Unlock, ChevronRight, BookOpen, Clock, AlertCircle } from 'lucide-react';

export function AssessmentsList() {
  const { userData } = useAuth();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto" id="assessments-list-wrapper">
      <div>
        <h1 className="text-4xl font-display font-black flex items-center gap-3">
          Course Assessments <ClipboardCheck className="text-primary" />
        </h1>
        <p className="text-muted-text mt-1">Verify your expertise and earn certified credentials</p>
      </div>

      <div className="bg-surface-card border border-brand-border/60 p-6 rounded-2xl flex items-center gap-4 text-sm text-muted-text max-w-3xl">
        <AlertCircle className="text-primary flex-shrink-0" size={20} />
        <p>
          <strong className="text-white">Strict Lock Requirement:</strong> Assessments and Certificates are locked for each course until you study and complete all learning modules. Once you finish a course, its assessment unlocks. Scoring <strong className="text-primary font-black">70% or higher</strong> will instantly auto-generate your verified PDF certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="assessments-cards-grid">
        {COURSES.map((course, i) => {
          const completedModules = userData?.progress?.[course.id] || [];
          const progressPercent = Math.round((completedModules.length / course.modules.length) * 100);
          const isUnlocked = completedModules.length === course.modules.length;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-surface-card border rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 ${
                isUnlocked 
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_4px_25px_rgba(16,185,129,0.05)]' 
                  : 'border-brand-border hover:border-primary/30'
              }`}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{course.emoji}</div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    isUnlocked 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-neutral-500/10 text-muted-text border-brand-border'
                  }`}>
                    {isUnlocked ? <Unlock size={10} /> : <Lock size={10} />}
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>

                <h3 className="text-xl font-display font-black mb-2">{course.title}</h3>
                <p className="text-xs text-muted-text mb-6 line-clamp-2">{course.description}</p>

                <div className="mt-auto space-y-4 pt-4 border-t border-brand-border/60">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Study Progress</span>
                    <span className={isUnlocked ? 'text-emerald-400 font-extrabold' : 'text-primary'}>
                      {progressPercent}% ({completedModules.length}/{course.modules.length} Modules)
                    </span>
                  </div>

                  <div className="h-2 bg-surface-base rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isUnlocked ? (
                    <Link 
                      to={`/assessment/${course.id}`}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-center block transition-colors text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      Start Final Assessment
                    </Link>
                  ) : (
                    <Link 
                      to={`/course/${course.id}`}
                      className="w-full bg-surface-elevated hover:bg-surface-base text-off-white py-3 rounded-xl font-bold text-center block transition-colors text-sm border border-white/5"
                    >
                      Resume Modules ({course.modules.length - completedModules.length} left)
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
