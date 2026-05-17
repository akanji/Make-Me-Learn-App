import React from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../constants';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PlayCircle, ChevronRight, GraduationCap } from 'lucide-react';

export function MyLearning() {
  const { userData } = useAuth();
  const enrolledCourses = COURSES.filter(c => userData?.enrolled.includes(c.id));

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-black">My Learning</h1>
        <p className="text-muted-text mt-1">Pick up where you left off</p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course, i) => {
            const completed = userData?.progress[course.id] || [];
            const progress = (completed.length / course.modules.length) * 100;
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-card border border-brand-border rounded-3xl overflow-hidden flex flex-col group hover:border-primary/50 transition-all shadow-xl"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{course.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-black group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-xs text-muted-text">{completed.length} of {course.modules.length} modules complete</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-bold text-muted-text">
                      <span>Course Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-base rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Next Module</p>
                    <div className="p-3 bg-surface-elevated/50 rounded-xl border border-white/5 text-sm font-medium">
                      {course.modules[completed.length] || 'All modules complete!'}
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/course/${course.id}`}
                  className="bg-primary hover:bg-secondary text-white py-4 font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {progress === 100 ? 'Review Course' : 'Resume Learning'} <PlayCircle size={18} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-card border border-dashed border-brand-border rounded-3xl p-20 text-center">
          <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center text-muted-text mx-auto mb-6">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-2xl font-display font-black mb-2">Your learning path is empty</h2>
          <p className="text-muted-text mb-8 max-w-sm mx-auto">Enroll in your first course to start your journey with Scout AI.</p>
          <Link to="/courses" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-purple-glow transition-all inline-block">
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}
