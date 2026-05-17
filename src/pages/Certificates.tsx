import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { COURSES } from '../constants';
import { Award, Download, Share2, Search, Medal, ShieldCheck, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Certificate {
  id: string;
  courseId: string;
  issueDate: any;
  certificateId: string;
  score: number;
}

export function Certificates() {
  const { user, userData } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    async function fetchCerts() {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'certificates'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
        setCerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, [user]);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black">Certificates</h1>
          <p className="text-muted-text mt-1">Manage and share your professional achievements</p>
        </div>
        <div className="bg-surface-card border border-brand-border p-4 rounded-2xl flex items-center gap-6">
          <div className="text-center px-4 border-r border-brand-border">
            <p className="text-[10px] text-muted-text font-black uppercase tracking-widest mb-1">Earned</p>
            <p className="text-2xl font-display font-bold">{certs.length}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] text-muted-text font-black uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-1.5 text-green-400 font-bold text-sm">
              <ShieldCheck size={14} /> Verified
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-surface-card animate-pulse rounded-3xl" />)}
        </div>
      ) : certs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => {
            const course = COURSES.find(c => c.id === cert.courseId);
            return (
              <motion.div
                key={cert.id}
                whileHover={{ y: -5 }}
                className="bg-surface-card border border-brand-border rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-rich-wine/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <Award size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-text font-black uppercase tracking-tighter">ID: {cert.certificateId}</p>
                    <p className="text-[10px] text-primary font-black uppercase">{cert.score}% Score</p>
                  </div>
                </div>
                <h3 className="text-xl font-display font-black mb-2 leading-tight">{course?.title}</h3>
                <p className="text-xs text-muted-text mb-6">Issued on {cert.issueDate?.toDate?.()?.toLocaleDateString() || 'Recently'}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-surface-elevated hover:bg-surface-base py-2.5 rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center justify-center gap-2">
                    <Download size={14} /> PDF
                  </button>
                  <button className="flex-1 bg-primary hover:bg-secondary py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Share2 size={14} /> LinkedIn
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-card border border-dashed border-brand-border rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center text-muted-text mx-auto mb-6">
            <Medal size={40} />
          </div>
          <h2 className="text-2xl font-display font-black mb-2">No certificates yet</h2>
          <p className="text-muted-text mb-8 max-w-sm mx-auto">Complete a course and pass the final assessment to earn your professional certificate.</p>
          <button className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-purple-glow transition-all">
            Browse Courses
          </button>
        </div>
      )}

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white text-surface-base p-1 lg:p-1 rounded-sm shadow-2xl"
            >
              <div className="bg-white border-[12px] border-dark-brand p-8 lg:p-16 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-[3px] border-t-[3px] border-primary/20" />
                <div className="absolute top-0 right-0 w-32 h-32 border-r-[3px] border-t-[3px] border-primary/20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-l-[3px] border-b-[3px] border-primary/20" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-[3px] border-b-[3px] border-primary/20" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-3 mb-10">
                    <GraduationCap className="text-primary w-10 h-10" />
                    <span className="font-display font-black text-3xl tracking-tighter uppercase italic">MAKE ME LEARN</span>
                  </div>
                  
                  <p className="font-serif italic text-xl mb-4 text-dark-brand">Certificate of Completion</p>
                  <p className="text-muted text-sm uppercase tracking-widest mb-10">This is to certify that</p>
                  
                  <h2 className="text-5xl font-display font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-rich-wine">
                    {userData?.name || 'Student Name'}
                  </h2>
                  
                  <p className="max-w-xl text-sm leading-relaxed mb-10 text-slate-600">
                    Has successfully completed the comprehensive training program in <span className="font-bold text-surface-base">
                      {COURSES.find(c => c.id === selectedCert.courseId)?.title}
                    </span> with a final assessment score of <span className="font-bold text-primary">{selectedCert.score}%</span>.
                  </p>
                  
                  <div className="grid grid-cols-2 w-full max-w-lg gap-20 mt-10">
                    <div className="border-t border-slate-300 pt-3">
                      <p className="font-bold text-xs uppercase tracking-widest text-surface-base">AI Studio Director</p>
                      <p className="text-muted text-[10px] italic">Automated Verification System</p>
                    </div>
                    <div className="border-t border-slate-300 pt-3">
                      <p className="font-bold text-xs uppercase tracking-widest text-surface-base">Cloud Instructor</p>
                      <p className="text-muted text-[10px] italic">Scout AI Intelligence</p>
                    </div>
                  </div>
                  
                  <div className="mt-16 flex items-center justify-between w-full text-[10px] text-slate-400 font-mono uppercase">
                    <span>ID: {selectedCert.certificateId}</span>
                    <span>Date: {selectedCert.issueDate?.toDate?.()?.toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                  <Medal size={400} />
                </div>
              </div>
              
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
                <button className="bg-white text-surface-base px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-slate-100 transition-all">
                  <Download size={20} /> Download PDF
                </button>
                <button onClick={() => setSelectedCert(null)} className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-secondary transition-all">
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
