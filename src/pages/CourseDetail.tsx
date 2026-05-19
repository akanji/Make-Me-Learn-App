import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COURSES, ModuleContent } from '../constants';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ScoutAvatar } from '../components/ScoutAvatar';
import { Markdown } from '../components/Markdown';
import { callScoutVideos, callScoutNotes, callScoutModuleNotes } from '../lib/gemini';
import { VideoPlayer } from '../components/VideoPlayer';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Video, 
  Lock, 
  Sparkles, 
  ChevronLeft,
  Download,
  Copy,
  Check,
  Zap,
  Info,
  ExternalLink,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, refreshUserData } = useAuth();
  const course = COURSES.find(c => c.id === id);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'videos' | 'notes'>('overview');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedSyllabus, setGeneratedSyllabus] = useState<Record<string, ModuleContent>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  const isEnrolled = userData?.enrolled.includes(course.id);
  const completedModules = userData?.progress[course.id] || [];
  const progressPercent = (completedModules.length / course.modules.length) * 100;
  const isAssessmentUnlocked = completedModules.length === course.modules.length;

  const handleEnroll = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        enrolled: arrayUnion(course.id),
        progress: {
          [course.id]: []
        }
      }, { merge: true });
      await refreshUserData();
      setActiveTab('modules');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userData.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleName: string) => {
    if (!userData || !isEnrolled) return;
    const isCompleted = completedModules.includes(moduleName);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        progress: {
          [course.id]: isCompleted ? arrayRemove(moduleName) : arrayUnion(moduleName)
        }
      }, { merge: true });
      await refreshUserData();
      
      // Trigger confetti if this was the last module
      if (!isCompleted && completedModules.length + 1 === course.modules.length) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899', '#3B82F6']
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userData.uid}`);
    }
  };

  const fetchVideos = async () => {
    if (videos.length > 0) return;
    setLoading(true);
    try {
      const data = await callScoutVideos(course.title, userData);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateNotes = async () => {
    if (notes) return;
    setLoading(true);
    try {
      const data = await callScoutNotes(course.title, course.modules, userData);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = async (moduleName: string) => {
    setSelectedModule(moduleName);
    const content = course.syllabus?.[moduleName] || generatedSyllabus[moduleName];
    
    if (!content) {
      setModuleLoading(true);
      try {
        const data = await callScoutModuleNotes(course.title, moduleName, userData);
        if (data.error) {
          toast.error(data.error);
          setSelectedModule(null);
          return;
        }
        setGeneratedSyllabus(prev => ({ ...prev, [moduleName]: data }));
      } catch (err) {
        console.error(err);
        setSelectedModule(null);
      } finally {
        setModuleLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'videos') fetchVideos();
    if (activeTab === 'notes') generateNotes();
  }, [activeTab]);

  const copyToClipboard = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNotes = () => {
    if (!notes) return;
    const element = document.createElement("a");
    const file = new Blob([notes], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${course.title}-notes.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Hero Header */}
      <div className="h-64 lg:h-80 bg-surface-elevated relative flex flex-col justify-end p-6 lg:p-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-surface-base to-transparent z-0" />
        <Link to="/courses" className="absolute top-6 left-6 flex items-center gap-2 text-muted-text hover:text-white transition-colors z-10 text-sm font-bold bg-surface-base/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5">
          <ChevronLeft size={16} /> Back to Courses
        </Link>
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-7xl lg:text-8xl">{course.emoji}</div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-primary/30">{course.level}</span>
                <span className="text-muted-text text-sm font-medium">{course.duration} track</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight">{course.title}</h1>
            </div>
          </div>
          {isEnrolled ? (
            <div className="bg-surface-card/50 backdrop-blur-md border border-brand-border p-4 rounded-2xl md:min-w-64">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-primary italic">Learning Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-surface-base rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-purple-glow transition-all flex items-center gap-2"
            >
              Enroll Now for Free <Sparkles size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex border-b border-brand-border gap-8 overflow-x-auto scroller-hide">
              {['overview', 'modules', 'videos', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 px-2 font-display font-bold text-lg capitalize transition-all relative ${
                    activeTab === tab ? 'text-white' : 'text-muted-text hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-1 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <section className="bg-surface-card border border-brand-border p-10 rounded-3xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-5 grayscale pointer-events-none">
                      <ScoutAvatar className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-2 text-primary">
                        <Info size={24} />
                        <h2 className="text-2xl font-display font-black">Course Overview</h2>
                      </div>
                      <p className="text-xl text-off-white leading-relaxed font-medium">
                        {course.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
                          <h4 className="text-xs font-black uppercase text-muted-text mb-2 tracking-widest">Level</h4>
                          <p className="font-bold">{course.level}</p>
                        </div>
                        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
                          <h4 className="text-xs font-black uppercase text-muted-text mb-2 tracking-widest">Modules</h4>
                          <p className="font-bold">{course.modules.length} Lessons</p>
                        </div>
                        <div className="bg-surface-elevated p-6 rounded-2xl border border-white/5">
                          <h4 className="text-xs font-black uppercase text-muted-text mb-2 tracking-widest">Access</h4>
                          <p className="font-bold">Lifetime Free</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-xl font-display font-bold flex items-center gap-2">
                       <FileText className="text-secondary" /> Learning Outcomes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.modules.slice(0, 4).map((m, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-surface-card border border-brand-border rounded-2xl">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-secondary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-off-white">Master {m}</p>
                            <p className="text-xs text-muted-text mt-1">Deep dive into industry standards.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {!isEnrolled && (
                    <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center space-y-6">
                      <h3 className="text-2xl font-display font-black">Ready to start?</h3>
                      <button 
                        onClick={handleEnroll}
                        className="bg-primary hover:bg-secondary text-white px-10 py-5 rounded-2xl font-black text-xl shadow-purple-glow transition-all"
                      >
                        Enroll Now
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'modules' && (
                <motion.div 
                  key="modules"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {selectedModule ? (
                    <div className="space-y-6">
                      <button 
                        onClick={() => setSelectedModule(null)}
                        className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                      >
                        <ChevronLeft size={16} /> Back to Modules
                      </button>
                      
                      {moduleLoading ? (
                        <div className="bg-surface-card border border-brand-border p-10 rounded-3xl space-y-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <ScoutAvatar className="w-16 h-16" />
                          </motion.div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold">Scout is building your study guide...</h3>
                            <p className="text-muted-text max-w-sm">Generating AI notes, missions, and curating resources for {selectedModule}.</p>
                          </div>
                          <div className="w-full max-w-md h-1.5 bg-surface-base rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 5, ease: 'linear' }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-surface-card border border-brand-border p-8 rounded-3xl space-y-8">
                          {(() => {
                            const content = course.syllabus?.[selectedModule] || generatedSyllabus[selectedModule];
                            if (!content) return <p>Failed to load module content.</p>;
                            return (
                              <>
                                <div>
                                  <h2 className="text-2xl font-display font-black mb-4">{selectedModule}</h2>
                                  <div className="flex items-center justify-between">
                                     <button 
                                      onClick={() => toggleModule(selectedModule)}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        completedModules.includes(selectedModule)
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-surface-elevated text-muted-text border border-white/5'
                                      }`}
                                    >
                                      {completedModules.includes(selectedModule) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                      {completedModules.includes(selectedModule) ? 'Completed' : 'Mark as Complete'}
                                    </button>
                                  </div>
                                </div>

                                <section>
                                  <div className="flex items-center gap-2 mb-4 text-primary">
                                    <FileText size={20} />
                                    <h3 className="font-bold">AI Study Notes</h3>
                                  </div>
                                  <div className="prose prose-invert max-w-none bg-surface-base/50 p-6 rounded-2xl border border-white/5">
                                    <Markdown content={content.aiNotes} />
                                  </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <section className="bg-surface-elevated/30 p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-4 text-secondary">
                                      <Sparkles size={18} />
                                      <h3 className="font-bold text-sm">Scout Mission</h3>
                                    </div>
                                    <p className="text-sm text-off-white italic">"{content.scoutMission}"</p>
                                  </section>
                                  <section className="bg-surface-elevated/30 p-6 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-4 text-primary">
                                      <ScoutAvatar className="w-6 h-6" />
                                      <h3 className="font-bold text-sm">Tutor Focus</h3>
                                    </div>
                                    <p className="text-sm text-off-white">{content.tutorFocus}</p>
                                  </section>
                                </div>

                                <section>
                                  <div className="flex items-center gap-2 mb-4 text-green-400">
                                    <Zap size={20} />
                                    <h3 className="font-bold">Labs & Exercises</h3>
                                  </div>
                                  <div className="bg-surface-base/50 p-6 rounded-2xl border border-white/5 italic text-sm">
                                    {content.labs}
                                  </div>
                                </section>

                                {content.videos && content.videos.length > 0 && (
                                  <section>
                                    <div className="flex items-center gap-2 mb-4 text-red-400">
                                      <Video size={20} />
                                      <h3 className="font-bold">Tutorial Videos</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {content.videos.map((v, idx) => (
                                        <VideoPlayer key={idx} title={v.title} url={v.url} />
                                      ))}
                                    </div>
                                  </section>
                                )}

                                {content.onlineLinks && content.onlineLinks.length > 0 && (
                                  <section>
                                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                                      <Sparkles size={20} />
                                      <h3 className="font-bold">Online Resources</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                      {content.onlineLinks.map((link, idx) => (
                                        <a 
                                          key={idx} 
                                          href={link.url} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="px-4 py-2 bg-surface-elevated/50 hover:bg-surface-elevated rounded-lg border border-white/5 text-xs font-bold transition-all"
                                        >
                                          {link.title}
                                        </a>
                                      ))}
                                    </div>
                                  </section>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {course.modules.map((module, i) => (
                        <div 
                          key={module}
                          onClick={() => handleModuleSelect(module)}
                          className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${
                            completedModules.includes(module) 
                            ? 'bg-primary/5 border-primary/20 text-white' 
                            : 'bg-surface-card border-brand-border hover:border-primary/40 text-off-white'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-surface-base flex items-center justify-center font-mono text-xs font-bold shrink-0 border border-white/5 group-hover:bg-primary/20 transition-colors">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className="flex-1">
                            <span className="block font-bold mb-0.5">{module}</span>
                            <span className="text-[10px] text-muted-text uppercase tracking-widest">
                               {course.syllabus?.[module] ? 'Core Curriculum' : 'AI Enhanced Module'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            {completedModules.includes(module) ? (
                              <CheckCircle2 className="text-primary" />
                            ) : (
                              <Circle className="text-muted-text group-hover:text-primary/50 transition-colors" />
                            )}
                            <ChevronRight className="text-muted-text opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'videos' && (
                <motion.div 
                  key="videos"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <ScoutAvatar />
                    <p className="text-sm text-off-white italic font-medium">"I've selected the best visual guides for this track."</p>
                  </div>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-48 bg-surface-card animate-pulse rounded-3xl" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.map((video, i) => (
                        <div key={i} className="bg-surface-card border border-brand-border rounded-3xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col">
                          <VideoPlayer title={video.title} url={`https://youtube.com/watch?v=${video.youtubeId}`} />
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-sm truncate flex-1">{video.title}</h4>
                              <span className="text-[10px] text-muted-text font-black uppercase tracking-widest ml-2 bg-surface-base px-2 py-0.5 rounded">{video.duration}</span>
                            </div>
                            <p className="text-xs text-primary mt-auto italic leading-relaxed">"{video.reason}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div 
                  key="notes"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ScoutAvatar />
                      <p className="text-sm text-off-white italic font-medium">"Here's your comprehensive study guide."</p>
                    </div>
                    {notes && !loading && (
                      <div className="flex gap-2">
                        <button onClick={copyToClipboard} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-muted-text relative group">
                          {copied ? <Check className="text-green-400" /> : <Copy size={20} />}
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                        </button>
                        <button onClick={downloadNotes} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-muted-text relative group">
                          <Download size={20} />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-surface-card animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-surface-card animate-pulse rounded" />
                      <div className="h-4 w-2/3 bg-surface-card animate-pulse rounded" />
                      <div className="h-40 bg-surface-card animate-pulse rounded-2xl" />
                    </div>
                  ) : (
                    <div className="bg-surface-card border border-brand-border p-8 rounded-3xl relative">
                      <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
                        <ScoutAvatar className="w-24 h-24" />
                      </div>
                      <Markdown content={notes || "No notes generated yet."} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <section className="bg-surface-card border border-brand-border p-6 rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Course Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-text">Status</span>
                  <span className={`font-bold ${isEnrolled ? 'text-primary' : 'text-yellow-500'}`}>
                    {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-text">Track</span>
                  <span className="font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-text">Certification</span>
                  <span className="font-bold">Verified</span>
                </div>
              </div>
            </section>

            <section className="bg-surface-card border border-brand-border p-6 rounded-3xl">
              <h3 className="font-display font-bold text-lg mb-4">Assessments</h3>
              <p className="text-xs text-muted-text mb-6">Complete all {course.modules.length} modules to unlock your final certification exam.</p>
              
              <button 
                onClick={() => isAssessmentUnlocked && navigate(`/assessment/${course.id}`)}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                  isAssessmentUnlocked 
                  ? 'bg-primary hover:bg-secondary text-white shadow-purple-glow' 
                  : 'bg-surface-elevated text-muted-text cursor-not-allowed opacity-50'
                }`}
              >
                {isAssessmentUnlocked ? 'Take Exam' : 'Exam Locked'}
                {!isAssessmentUnlocked && <Lock size={16} />}
              </button>
            </section>

            <section className="bg-gradient-to-br from-rich-wine/20 to-primary/10 border border-primary/20 p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-primary shrink-0" size={18} />
                <h3 className="font-display font-bold text-lg">AI Tutor</h3>
              </div>
              <p className="text-xs text-off-white/80 mb-4 font-medium leading-relaxed">Need help with this course? Ask Scout, our intelligent curator, for a detailed explanation.</p>
              <Link to="/tutor" className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm">
                Ask Scout AI <MessageCircle size={16} />
              </Link>
            </section>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-purple-glow z-50 flex items-center justify-center hover:bg-secondary transition-all"
          >
            <ChevronLeft className="rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
