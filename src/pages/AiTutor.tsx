import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScoutAvatar } from '../components/ScoutAvatar';
import { Markdown } from '../components/Markdown';
import { callAiChat, transcribeAudio } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../constants';
import { Send, Sparkles, Wand2, Music, Video, Image as ImageIcon, Mic, Trash2, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function AiTutor() {
  const { userData } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState<{ role: 'user' | 'scout'; content: string }[]>([
    { 
      role: 'scout', 
      content: `Hello! I'm Scout, your Python Dev Coaching & Debugging Assistant. Let me check your course progress to customize our session...` 
    }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseTitle = location.state?.courseTitle || params.get('course');
    if (courseTitle) {
      setInput(`I have a question about the course "${courseTitle}": `);
    }
  }, [location]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      let options = {};
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
          mimeType = 'audio/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size > 0) {
          await processAudio(audioBlob, mimeType);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err: any) {
      console.error("Microphone access error:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        if (mediaRecorderRef.current) {
          const stream = mediaRecorderRef.current.stream;
          stream.getTracks().forEach(track => track.stop());
        }
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      toast.info("Voice recording cancelled");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const processAudio = async (audioBlob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    const transcriptionToast = toast.loading("Processing your voice note...");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const base64 = base64data.split(',')[1];
          
          const res = await transcribeAudio(base64, mimeType, userData);
          if (res.error) {
            toast.error(`Transcription error: ${res.error}`, { id: transcriptionToast });
          } else if (res.transcription) {
            const text = res.transcription.trim();
            if (text) {
              setInput(prev => (prev ? `${prev} ${text}` : text));
              toast.success("Voice memo transcribed!", { id: transcriptionToast });
            } else {
              toast.info("Could not detect any speech. Please speak clearly.", { id: transcriptionToast });
            }
          }
        } catch (err: any) {
          console.error("Transcription processing error:", err);
          toast.error("Failed to transcribe: " + err.message, { id: transcriptionToast });
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err: any) {
      console.error("Audio reading error:", err);
      toast.error("Audio reading error", { id: transcriptionToast });
      setIsTranscribing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Dynamically tailor the coach introduction based on python-dev completion context
  useEffect(() => {
    if (userData && messages.length === 1 && messages[0].content.includes("context")) {
      const pythonProgress = userData.progress?.['python-dev'] || [];
      const completedCount = pythonProgress.length;
      
      let greeting = `Hello ${userData.name || 'Developer'}! 👋 I am Scout, your dedicated **Python Dev Coaching & Debugging Companion**. 🐍 

My focus is to help you master Python, squash frustrating bugs, step through stack traces, and construct clean, efficient script architectures.`;

      if (completedCount > 0) {
        greeting += `\n\nI see you have successfully completed **${completedCount} Python module${completedCount > 1 ? 's' : ''}** so far (your most recent milestone was: *${pythonProgress[pythonProgress.length - 1]}*)! 🚀 Let's extend that knowledge. What script are we debugging or writing today?`;
      } else {
        greeting += `\n\nI notice you are ready to make headway on your **Python Dev** course modules. Let's make sure your workspace and core syntax are completely rock solid! 💻 How can I help you jump in today?`;
      }

      setMessages([{ role: 'scout', content: greeting }]);
    }
  }, [userData, messages]);

  const handleSend = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || loading) return;

    const userMessage = { role: 'user' as const, content: finalInput };
    setMessages(prev => [...prev, userMessage]);
    if (!customInput) setInput('');
    setLoading(true);

    try {
      const enrolledTrackTitles = COURSES.filter(c => userData?.enrolled.includes(c.id)).map(c => c.title);
      const context = {
        userName: userData?.name,
        enrolledCourses: enrolledTrackTitles,
        currentProgress: userData?.progress || {}
      };
      
      const response = await callAiChat(
        [...messages, userMessage].map(m => ({ 
          role: m.role === 'scout' ? 'assistant' : 'user', 
          content: m.content 
        })), 
        context,
        userData
      );

      if (response.error) {
        setMessages(prev => [...prev, { 
          role: 'scout', 
          content: response.error + (response.expired ? " You should head over to Settings to upgrade your plan." : "")
        }]);
        return;
      }

      setMessages(prev => [...prev, { role: 'scout', content: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'scout', content: "I'm having trouble connecting to my central brain right now. Can we try that again?" }]);
    } finally {
      setLoading(false);
    }
  };

  const chips = [
    "Debug a Python IndexError / IndexError: list index out of range",
    "Explain Python Lists vs Dictionaries with examples",
    "How does Object-Oriented Programming (OOP) work in Python?",
    "Give me a PEP-8 clean decorator code walk-through",
    "Test my knowledge with an interactive coding challenge"
  ];

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-surface-base">
      <header className="p-6 border-b border-brand-border bg-surface-card/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ScoutAvatar />
          <div>
            <h1 className="text-xl font-display font-black tracking-tight flex items-center gap-2">Scout AI Python Coach <span className="bg-primary/20 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Python Dev</span></h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-primary font-black uppercase tracking-widest">Active Curator</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-3">
          <button className="p-3 bg-surface-elevated rounded-xl text-muted-text hover:text-white transition-all hover:bg-primary/20 hover:border-primary/50 border border-transparent">
            <Music size={18} />
          </button>
          <button className="p-3 bg-surface-elevated rounded-xl text-muted-text hover:text-white transition-all hover:bg-primary/20 hover:border-primary/50 border border-transparent">
            <Video size={18} />
          </button>
          <button className="p-3 bg-surface-elevated rounded-xl text-muted-text hover:text-white transition-all hover:bg-primary/20 hover:border-primary/50 border border-transparent">
            <ImageIcon size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'scout' && <ScoutAvatar className="shrink-0" />}
              <div className={`p-5 rounded-3xl max-w-[85%] lg:max-w-[70%] border ${
                msg.role === 'user' 
                ? 'bg-primary border-primary text-white ml-auto rounded-tr-none' 
                : 'bg-surface-card border-brand-border text-off-white rounded-tl-none'
              }`}>
                <Markdown content={msg.content} />
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <ScoutAvatar className="shrink-0" />
              <div className="bg-surface-card border border-brand-border p-6 rounded-3xl rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 bg-surface-card/50 backdrop-blur-md border-t border-brand-border">
        <div className="max-w-3xl mx-auto">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {chips.map(chip => (
                <button 
                  key={chip} 
                  onClick={() => handleSend(undefined, chip)}
                  className="px-4 py-2 bg-surface-elevated/50 border border-brand-border hover:border-primary hover:bg-primary/10 rounded-full text-xs font-bold transition-all text-muted-text hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="relative">
            <input 
              className="w-full bg-surface-elevated/80 border border-brand-border focus:border-primary rounded-2xl py-4 pl-6 pr-28 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-xl disabled:opacity-60"
              placeholder={isRecording ? "Recording your voice..." : "Ask Scout for Python help or code debugging..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || isTranscribing || isRecording}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button 
                type="button"
                onClick={startRecording}
                disabled={loading || isTranscribing || isRecording}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-surface-card border border-brand-border text-muted-text hover:text-white hover:border-primary/50 hover:bg-primary/10 disabled:opacity-40"
                title="Record Question via Microphone (Voice Memo)"
              >
                <Mic size={18} />
              </button>
              
              <button 
                type="submit"
                disabled={loading || !input.trim() || isTranscribing || isRecording}
                className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            {/* LIVE RECORDING OVERLAY PANEL */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="absolute inset-0 bg-surface-elevated border border-brand-border rounded-2xl flex items-center justify-between px-6 z-10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">Recording</span>
                    <span className="text-sm font-mono text-white/95 bg-surface-card/80 px-2 py-0.5 rounded-md border border-brand-border/40">
                      {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                      {(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Dynamic Soundwave Visualizer Bouncing Bars */}
                  <div className="flex items-end gap-1 px-4 h-6">
                    {[3, 7, 12, 6, 14, 5, 11, 8, 3, 9, 13, 6, 11, 5, 8, 3].map((h, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          height: [
                            `${h * 1.5}px`, 
                            `${Math.max(4, h * (1.8 + Math.sin(index * 1.5 + recordingTime * 2)))}px`, 
                            `${h * 1.5}px`
                          ]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.04
                        }}
                        className="w-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                      title="Cancel recording"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white font-black uppercase text-[10px] tracking-wider rounded-xl flex items-center gap-2 transition-all"
                      title="Done and transcribe"
                    >
                      <Square size={10} className="fill-white" />
                      <span>Transcribe</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TRANSCRIBING OVERLAY LOADING INDICATOR */}
            <AnimatePresence>
              {isTranscribing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-surface-elevated/95 border border-brand-border rounded-2xl flex items-center justify-center gap-3 z-10"
                >
                  <Loader2 size={18} className="text-primary animate-spin" />
                  <span className="text-xs uppercase tracking-widest font-black text-primary animate-pulse">
                    Transcribing voice note...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <p className="text-[10px] text-muted-text text-center mt-4 uppercase tracking-widest font-black opacity-50">
            Powered by Gemini 3.1 Pro Debugging Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
