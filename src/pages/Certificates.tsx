import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { COURSES } from '../constants';
import { 
  Award, 
  Download, 
  Share2, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Medal, 
  ShieldCheck, 
  GraduationCap, 
  FileBadge, 
  ChevronRight, 
  Calendar,
  UserCheck,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  courseId: string;
  issueDate: any;
  issueDateText?: string;
  recipientName?: string;
  certificateId: string;
  score: number;
  signedByAI?: string;
  digitalFingerprint?: string;
}

export function Certificates() {
  const { user, userData } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchCerts() {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'certificates'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
        setCerts(data);
      } catch (err) {
        console.error("Error loading certificates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, [user]);

  // Handle high quality PDF export
  const downloadPDFElement = async (printAreaId: string, courseTitle: string) => {
    const element = document.getElementById(printAreaId);
    if (!element) {
      toast.error("Certificate layout element not found.");
      return;
    }

    setDownloading(true);
    toast.loading("Generating your verified high-resolution PDF...");

    try {
      // Ensure all custom images/fonts are loaded
      const canvas = await html2canvas(element, {
        scale: 3, // extremely crisp text and lines
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate aspect ratio landscape letter format
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter' // 279.4mm x 215.9mm
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`);
      
      toast.dismiss();
      toast.success("Certificate PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.dismiss();
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto" id="certificates-view-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-brand-border/60">
        <div>
          <h1 className="text-4xl font-display font-black flex items-center gap-3">
            Professional Credentials <FileBadge className="text-primary" />
          </h1>
          <p className="text-muted-text mt-1">Unlock and download your verified certificates of course completion</p>
        </div>
        <div className="bg-surface-card border border-brand-border p-4 rounded-2xl flex items-center gap-6">
          <div className="text-center px-4 border-r border-brand-border">
            <p className="text-[10px] text-muted-text font-black uppercase tracking-widest mb-1">Earned</p>
            <p className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-rich-wine">
              {certs.length}
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] text-muted-text font-black uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-1.5 text-green-400 font-bold text-sm">
              <ShieldCheck size={14} /> AI Verified
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 bg-surface-card animate-pulse rounded-3xl border border-brand-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="certificates-grid">
          {COURSES.map((course) => {
            const completedModules = userData?.progress?.[course.id] || [];
            const isStudyComplete = completedModules.length === course.modules.length;
            const cert = certs.find(c => c.courseId === course.id);
            const isPassed = cert && cert.score >= 70;

            let statusColor = "";
            let statusText = "";
            let description = "";

            if (!isStudyComplete) {
              statusColor = "border-red-500/20 bg-red-500/10 text-red-400";
              statusText = "Locked • Study Incomplete";
              description = `Requires 100% study completion. Finish all ${course.modules.length} modules to unlock assessments.`;
            } else if (!isPassed) {
              statusColor = "border-amber-500/20 bg-amber-500/10 text-amber-400";
              statusText = "Locked • Exam Pending";
              description = "Course material completed! Pass the final assessment with a score of 70% or more to earn your certificate.";
            } else {
              statusColor = "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
              statusText = `Earned • ${cert.score}% Score`;
              description = `Congratulations! Officially verified certificate is signed by Scout AI and available for PDF download.`;
            }

            return (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className={`bg-surface-card border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isPassed 
                    ? 'border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_4px_30px_rgba(16,185,129,0.05)]' 
                    : 'border-brand-border hover:border-white/10'
                }`}
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-surface-elevated rounded-2xl flex items-center justify-center text-xl">
                      {course.emoji}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 ${statusColor}`}>
                      {!isStudyComplete ? <Lock size={10} /> : !isPassed ? <Unlock size={10} /> : <CheckCircle size={10} />}
                      {statusText}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-black leading-tight mb-2">{course.title}</h3>
                  <p className="text-xs text-muted-text mb-6 leading-relaxed">{description}</p>
                </div>

                <div className="pt-4 border-t border-brand-border/60">
                  {isPassed ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] text-muted-text mb-2 px-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {cert.issueDateText || 'Achieved'}
                        </span>
                        <span className="font-mono font-bold">{cert.certificateId}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="flex-1 bg-primary hover:bg-secondary text-white py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                        >
                          <Award size={14} /> View Badge
                        </button>
                        <button
                          onClick={() => downloadPDFElement(`cert-print-${cert.id}`, course.title)}
                          disabled={downloading}
                          className="px-4 bg-surface-elevated hover:bg-surface-base text-off-white py-3 rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center justify-center"
                          title="Instant PDF Download"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </div>
                  ) : !isStudyComplete ? (
                    <Link 
                      to={`/course/${course.id}`}
                      className="w-full bg-surface-elevated hover:bg-surface-base py-3 rounded-xl text-xs font-bold transition-all text-center block text-off-white border border-white/5"
                    >
                      Resume Study Modules ({completedModules.length}/{course.modules.length})
                    </Link>
                  ) : (
                    <Link 
                      to={`/assessment/${course.id}`}
                      className="w-full bg-purple-500/10 hover:bg-primary border border-primary/20 text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-center block flex items-center justify-center gap-1"
                    >
                      Unlock Certificate: Take Exam <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {/* HIDDEN high-fidelity capture zone for pdf conversion */}
                {isPassed && (
                  <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
                    <div 
                      id={`cert-print-${cert.id}`} 
                      className="bg-white text-slate-800 p-16 w-[1000px] h-[700px] flex flex-col justify-between relative border-[16px] border-slate-900 shadow-2xl"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {/* Filigree corner styling */}
                      <div className="absolute top-4 left-4 w-12 h-12 border-l-[3px] border-t-[3px] border-indigo-700/60" />
                      <div className="absolute top-4 right-4 w-12 h-12 border-r-[3px] border-t-[3px] border-indigo-700/60" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-[3px] border-b-[3px] border-indigo-700/60" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-[3px] border-b-[3px] border-indigo-700/60" />

                      <div className="text-center flex flex-col items-center flex-1 justify-center space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <GraduationCap className="text-indigo-800 w-12 h-12" />
                          <span className="font-extrabold text-2xl tracking-tighter uppercase italic text-indigo-950 font-sans">MAKE ME LEARN</span>
                        </div>
                        
                        <h4 className="font-serif italic text-2xl text-amber-700 tracking-wider">Certificate of Completion</h4>
                        <div className="w-48 h-[1px] bg-indigo-200" />
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest">This is to certify that the scholar</p>
                        
                        <h2 className="text-4xl font-extrabold tracking-tight text-indigo-950 font-sans border-b-2 border-amber-600/20 pb-2 px-10">
                          {cert.recipientName || userData?.name || 'Distinguished Student'}
                        </h2>
                        
                        <p className="max-w-2xl text-xs leading-relaxed text-slate-600">
                          Has successfully completed the demanding coursework, verified learning syllabus, and mock labs of the 
                          dedicated training program <span className="font-bold text-slate-900">"{course.title}"</span>. 
                          Demonstrated overall mastery by passing the verified final exam with a score of <span className="font-bold text-indigo-700">{cert.score}%</span> on the platform.
                        </p>
                      </div>

                      {/* AI-Powered Signature panel */}
                      <div className="grid grid-cols-2 gap-20 max-w-2xl w-full mx-auto pb-4 mt-8">
                        <div className="text-center pt-2">
                          <p className="font-serif italic text-base text-indigo-800 h-8 mb-1 select-none pointer-events-none text-center">
                            Verified AI Engine
                          </p>
                          <div className="border-t border-slate-300 pt-1">
                            <p className="font-bold text-[9px] uppercase tracking-wider text-slate-800">Scout AI Proctor</p>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Auto-Signer Tool</span>
                          </div>
                        </div>
                        <div className="text-center pt-2">
                          <p className="font-serif italic text-lg text-amber-700 h-8 mb-1 select-none pointer-events-none text-center leading-none">
                            {cert.recipientName || userData?.name || 'Student'}
                          </p>
                          <div className="border-t border-slate-300 pt-1">
                            <p className="font-bold text-[9px] uppercase tracking-wider text-slate-800">Graduate</p>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Self-Verified Signature</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom stamp metadata */}
                      <div className="flex items-center justify-between mt-6 text-[8px] text-slate-400 font-mono tracking-wider border-t border-slate-100 pt-4">
                        <span>ID: {cert.certificateId}</span>
                        <span className="text-indigo-800/80 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/60 flex items-center gap-1">
                          <ShieldCheck size={9} /> SCOUT SECURE INTEGRITY
                        </span>
                        <span>DATE: {cert.issueDateText || 'Recently'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
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
            {/* Modal Certificate Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-3xl bg-white text-slate-900 border-[16px] border-slate-950 p-8 lg:p-14 rounded-sm shadow-2xl overflow-hidden flex flex-col justify-between"
              style={{ minHeight: '520px' }}
            >
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-10 h-10 border-l-2 border-t-2 border-indigo-700/40" />
              <div className="absolute top-2 right-2 w-10 h-10 border-r-2 border-t-2 border-indigo-700/40" />
              <div className="absolute bottom-2 left-2 w-10 h-10 border-l-2 border-b-2 border-indigo-700/40" />
              <div className="absolute bottom-2 right-2 w-10 h-10 border-r-2 border-b-2 border-indigo-700/40" />
              
              <div className="text-center flex flex-col items-center flex-1 justify-center space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="text-indigo-800 w-10 h-10" />
                  <span className="font-extrabold text-xl tracking-tighter uppercase italic text-indigo-950 font-sans">MAKE ME LEARN</span>
                </div>
                
                <h4 className="font-serif italic text-xl text-amber-700">Certificate of Completion</h4>
                <div className="w-32 h-[1px] bg-slate-200" />
                <p className="text-slate-400 text-[9px] uppercase tracking-widest leading-none">This is to certify that</p>
                
                <h2 className="text-3xl font-extrabold tracking-tight text-indigo-950 font-sans border-b border-amber-600/10 pb-2 px-6">
                  {selectedCert.recipientName || userData?.name || 'Distinguished Student'}
                </h2>
                
                <p className="max-w-xl text-xs leading-relaxed text-slate-500">
                  Has successfully completed the comprehensive curriculum and verified learning syllabus of the dedicated training program <span className="font-bold text-slate-800">"{COURSES.find(c => c.id === selectedCert.courseId)?.title}"</span> with a final assessment score of <span className="font-bold text-indigo-700">{selectedCert.score}%</span>.
                </p>
              </div>

              {/* Verified Signatures */}
              <div className="grid grid-cols-2 gap-10 max-w-md w-full mx-auto mt-6">
                <div className="text-center">
                  <p className="font-serif italic text-base text-indigo-700/80 h-7 mb-1 select-none pointer-events-none">
                    Verified AI Engine
                  </p>
                  <div className="border-t border-slate-300 pt-1">
                    <p className="font-bold text-[9px] text-slate-800">Scout AI Coach</p>
                    <span className="text-[8px] text-slate-400 capitalize">Auto-Signed via Automated verification tool</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-serif italic text-base text-amber-600 h-7 mb-1 select-none pointer-events-none">
                    {selectedCert.recipientName || userData?.name}
                  </p>
                  <div className="border-t border-slate-300 pt-1">
                    <p className="font-bold text-[9px] text-slate-800">Graduate</p>
                    <span className="text-[8px] text-slate-400 capitalize">Self-Signed via Verification tool</span>
                  </div>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="flex items-center justify-between mt-10 text-[8px] text-slate-400 font-mono tracking-wider border-t border-slate-100 pt-2">
                <span>VERIFICATION KEY: {selectedCert.certificateId}</span>
                <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                  <ShieldCheck size={9} /> SECURE ORIGINAL CREDENTIAL
                </span>
                <span>ACHIEVED: {selectedCert.issueDateText || 'Recently'}</span>
              </div>

              {/* Actions Float Bar below Certificate card */}
              <div className="absolute -bottom-16 left-0 right-0 flex gap-4 justify-center pointer-events-auto">
                <button 
                  onClick={() => downloadPDFElement(`cert-print-${selectedCert.id}`, COURSES.find(c => c.id === selectedCert.courseId)?.title || 'Course')}
                  disabled={downloading}
                  className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 px-6 py-2.5 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setSelectedCert(null)} 
                  className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-full font-bold shadow-xl transition-all text-sm hover:scale-[1.02] active:scale-95"
                >
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
