import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COURSES, ASSESSMENTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Award, Sparkles, Wand2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Assessments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  const course = COURSES.find(c => c.id === id);
  const questions = id ? ASSESSMENTS[id] : null;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (!course || !questions) return <div className="p-10 text-center">Assessment not found.</div>;

  const completedModules = userData?.progress?.[course.id] || [];
  const isUnlocked = completedModules.length === course.modules.length;

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
        <div className="bg-surface-card border border-brand-border p-10 rounded-3xl max-w-md w-full text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/10">
            <Lock size={40} className="animate-bounce" />
          </div>
          <h2 className="text-3xl font-display font-black text-white">Assessment Locked</h2>
          <p className="text-muted-text text-sm">
            You must study and complete all learning modules for <strong className="text-white">{course.title}</strong> before accessing the final exam.
          </p>
          <div className="pt-2">
            <Link 
              to={`/course/${course.id}`} 
              className="w-full bg-primary hover:bg-secondary text-white py-3 px-6 rounded-xl font-bold text-sm shadow-purple-glow transition-all block text-center"
            >
              Go to Course Modules ({completedModules.length} / {course.modules.length} Completed)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === questions.length - 1;

  const handleSelect = (idx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: idx });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const finishExam = async () => {
    if (!user) return;
    setSubmitting(true);
    const finalScore = calculateScore();
    setScore(finalScore);

    try {
      if (finalScore >= 70) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6B21A8', '#7C3AED', '#8B1A3E', '#FFD700']
        });

        // Save certificate
        const certId = `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const currentDateText = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        await setDoc(doc(db, 'users', user.uid, 'certificates', certId), {
          userId: user.uid,
          courseId: course.id,
          issueDate: serverTimestamp(),
          issueDateText: currentDateText,
          recipientName: userData?.name || user.displayName || 'Distinguished Graduate',
          certificateId: certId,
          score: finalScore,
          signedByAI: "Scout AI Assistant Coach",
          digitalFingerprint: `SHA256-${Math.random().toString(16).substring(2, 8).toUpperCase()}`
        });
        await refreshUserData();
      }
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <Link to={`/course/${course.id}`} className="inline-flex items-center gap-2 text-muted-text hover:text-white mb-8 transition-colors font-bold text-sm">
          <ChevronLeft size={16} /> Quit Exam
        </Link>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-surface-elevated/50 p-8 border-b border-brand-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Final Exam : {course.title}</span>
                  <span className="text-xs font-mono font-bold text-muted-text">Question {currentStep + 1} / {questions.length}</span>
                </div>
                <div className="h-2 bg-surface-base rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>

              <div className="p-8 space-y-8">
                <h2 className="text-2xl font-display font-bold leading-tight">{questions[currentStep].question}</h2>
                <div className="space-y-3">
                  {questions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                        selectedAnswers[currentStep] === idx 
                        ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(107,33,168,0.2)]' 
                        : 'bg-surface-base border-brand-border hover:border-primary/50 text-off-white'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        selectedAnswers[currentStep] === idx ? 'border-primary bg-primary' : 'border-brand-border group-hover:border-primary/50'
                      }`}>
                        {selectedAnswers[currentStep] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-surface-elevated/30 flex items-center justify-between">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-muted-text hover:text-white transition-colors disabled:opacity-0"
                >
                  Previous
                </button>
                <button
                  disabled={selectedAnswers[currentStep] === undefined || submitting}
                  onClick={() => isLastStep ? finishExam() : setCurrentStep(currentStep + 1)}
                  className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-purple-glow transition-all flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : isLastStep ? 'Complete Exam' : 'Next Question'}
                  {!isLastStep && <ChevronRight size={18} />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-card border border-brand-border rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-rich-wine to-secondary" />
              
              <div className="mb-8 flex justify-center">
                {score >= 70 ? (
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 relative">
                    <Award size={48} />
                    <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                    <XCircle size={48} />
                  </div>
                )}
              </div>

              <h2 className="text-4xl font-display font-black mb-2">{score >= 70 ? 'Congratulations!' : 'Almost there!'}</h2>
              <p className="text-muted-text mb-8">You scored <span className={`font-black ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>{score}%</span> on the {course.title} Final Exam.</p>

              {score >= 70 ? (
                <div className="space-y-6">
                  <div className="bg-surface-elevated/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-sm font-medium text-off-white leading-relaxed">Your certificate has been issued and added to your profile. You can now download and share it on LinkedIn.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/certificates" className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-purple-glow transition-all flex items-center justify-center gap-2">
                      View Certificate <Award size={20} />
                    </Link>
                    <Link to="/" className="bg-surface-elevated hover:bg-surface-base text-white px-8 py-4 rounded-2xl font-bold border border-white/10 transition-all flex items-center justify-center">
                      Return Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-off-white/80">You need at least 70% to pass. Don't worry, you can retake the exam after reviewing the modules.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => { setSelectedAnswers({}); setCurrentStep(0); setShowResult(false); }}
                      className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-purple-glow transition-all flex items-center justify-center gap-2"
                    >
                      Retake Exam <Wand2 size={20} />
                    </button>
                    <Link to={`/course/${course.id}`} className="bg-surface-elevated hover:bg-surface-base text-white px-8 py-4 rounded-2xl font-bold border border-white/10 transition-all">
                      Review Modules
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
