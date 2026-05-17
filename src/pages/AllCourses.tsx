import React from 'react';
import { COURSES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, BarChart, ChevronRight } from 'lucide-react';

export function AllCourses() {
  const { userData } = useAuth();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-display font-black">All Courses</h1>
        <p className="text-muted-text mt-1">Explore our expert-curated learning tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course, i) => {
          const isEnrolled = userData?.enrolled.includes(course.id);
          const progress = isEnrolled ? ((userData?.progress[course.id]?.length || 0) / course.modules.length) * 100 : 0;
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-card border border-brand-border rounded-3xl overflow-hidden flex flex-col group hover:border-primary/50 transition-all hover:translate-y-[-4px]"
            >
              <div className="h-40 bg-surface-elevated relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-rich-wine/20 group-hover:opacity-100 transition-opacity opacity-0" />
                <div className="text-7xl group-hover:scale-125 transition-transform duration-500 relative z-10">{course.emoji}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    course.level === 'Beginner' ? 'bg-green-500/10 text-green-400' : 
                    course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-text font-bold uppercase tracking-widest">
                    <Clock size={10} /> {course.duration}
                  </span>
                </div>
                <h3 className="text-xl font-display font-black mb-2">{course.title}</h3>
                <p className="text-sm text-muted-text mb-6 line-clamp-2">{course.description}</p>
                
                <div className="mt-auto pt-6 border-t border-brand-border">
                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-primary">Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-base rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <Link 
                        to={`/course/${course.id}`}
                        className="w-full bg-surface-elevated hover:bg-primary py-3 rounded-xl font-bold text-center block transition-colors text-sm"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  ) : (
                    <Link 
                      to={`/course/${course.id}`}
                      className="w-full bg-primary hover:bg-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-purple-glow text-sm"
                    >
                      View Course <ChevronRight size={16} />
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
