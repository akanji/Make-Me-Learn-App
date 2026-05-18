import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useA2A } from '../context/A2AContext';
import { COURSES } from '../constants';
import { ScoutAvatar } from '../components/ScoutAvatar';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Award, Flame, ChevronRight, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { userData } = useAuth();
  const { scoutPick } = useA2A();

  const enrolledCourses = COURSES.filter(c => userData?.enrolled.includes(c.id));
  const stats = [
    { label: 'Enrolled', value: userData?.enrolled.length || 0, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Completed', value: Object.values(userData?.progress || {}).filter(p => p.length >= 10).length, icon: GraduationCap, color: 'text-green-400' },
    { label: 'Certificates', value: 0, icon: Award, color: 'text-purple-400' },
    { label: 'Day Streak', value: 5, icon: Flame, color: 'text-orange-400' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black">Welcome to our Learning and Development Platform</h1>
          <p className="text-muted-text mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="bg-surface-card border border-brand-border px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-text uppercase font-bold tracking-widest">Global Rank</p>
            <p className="text-xl font-display font-bold">#1,248</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-card border border-brand-border p-6 rounded-3xl hover:border-primary/50 transition-colors group"
          >
            <div className={`p-3 rounded-xl bg-surface-elevated w-fit mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-2xl font-display font-black">{stat.value}</p>
            <p className="text-sm text-muted-text font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">Continue Learning</h2>
              <Link to="/my-learning" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {enrolledCourses.length > 0 ? enrolledCourses.slice(0, 3).map(course => {
                const progress = ((userData?.progress[course.id]?.length || 0) / course.modules.length) * 100;
                return (
                  <Link key={course.id} to={`/course/${course.id}`} className="block bg-surface-card border border-brand-border p-5 rounded-3xl group hover:border-primary transition-all">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{course.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-xs text-muted-text">Module {userData?.progress[course.id]?.length || 0} of {course.modules.length}</p>
                      </div>
                      <PlayCircle className="text-muted-text group-hover:text-primary transition-colors" size={24} />
                    </div>
                    <div className="mt-4 h-2 bg-surface-base rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                  </Link>
                );
              }) : (
                <div className="bg-surface-elevated/30 border border-dashed border-brand-border rounded-3xl p-10 text-center">
                  <p className="text-muted-text mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="bg-primary px-6 py-2 rounded-xl font-bold inline-block">Browse Courses</Link>
                </div>
              )}
            </div>
          </section>

          {/* All Courses Quick View */}
          <section>
            <h2 className="text-xl font-display font-bold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSES.filter(c => !userData?.enrolled.includes(c.id)).slice(0, 4).map(course => (
                <Link key={course.id} to={`/course/${course.id}`} className="bg-surface-card border border-brand-border p-4 rounded-3xl flex items-center gap-4 hover:border-primary transition-all">
                  <div className="text-3xl w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center">{course.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{course.title}</h3>
                    <p className="text-xs text-muted-text">{course.duration} • {course.level}</p>
                  </div>
                  <ChevronRight size={18} className="text-muted-text" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar/Widgets */}
        <div className="space-y-8">
          {/* Scout's Pick Today */}
          <section className="bg-gradient-to-br from-surface-elevated to-surface-card border border-brand-border rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
            
            <div className="flex items-center gap-3 mb-6 relative">
              <ScoutAvatar className="w-12 h-12" />
              <div>
                <h2 className="font-display font-bold text-lg leading-tight">Scout's Pick</h2>
                <p className="text-xs text-primary font-black uppercase tracking-widest">Today's Focus</p>
              </div>
            </div>

            {scoutPick ? (
              <div className="space-y-4 relative">
                <div className="bg-surface-base/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-muted-text uppercase font-bold mb-1">Module</p>
                  <p className="text-sm font-bold text-off-white">{scoutPick.module}</p>
                </div>
                <div className="bg-surface-base/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-muted-text uppercase font-bold mb-1">Scout's Tip</p>
                  <p className="text-sm font-medium text-off-white italic">"{scoutPick.tip}"</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-primary" />
                    <p className="text-xs text-primary font-bold uppercase">Challenge</p>
                  </div>
                  <p className="text-sm font-bold">{scoutPick.challenge}</p>
                </div>
                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors text-sm">
                  Start Training →
                </button>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-surface-elevated rounded-2xl" />
                <div className="h-16 bg-surface-elevated rounded-2xl" />
                <div className="h-16 bg-surface-elevated rounded-2xl" />
              </div>
            )}
          </section>

          {/* AI Recommendations */}
          <section className="bg-surface-card border border-brand-border rounded-3xl p-6">
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              <Sparkles size={18} className="text-primary" /> AI Recommended
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-surface-elevated/50 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">#1</div>
                <p className="text-xs font-medium">Why you should learn React next</p>
              </div>
              <div className="p-3 bg-surface-elevated/50 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">#2</div>
                <p className="text-xs font-medium">Salary trends for UI Designers</p>
              </div>
              <div className="p-3 bg-surface-elevated/50 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">#3</div>
                <p className="text-xs font-medium">Top 5 Python APIs in 2024</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
