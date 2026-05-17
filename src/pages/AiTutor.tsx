import React, { useState, useRef, useEffect } from 'react';
import { ScoutAvatar } from '../components/ScoutAvatar';
import { Markdown } from '../components/Markdown';
import { callAiChat } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { COURSES } from '../constants';
import { Send, Sparkles, Wand2, Music, Video, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AiTutor() {
  const { userData } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'scout'; content: string }[]>([
    { role: 'scout', content: `Hello! I'm Scout. I specialize in the tracks offered here at MAKE ME LEARN. How can I assist your learning journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      const response = await callAiChat([...messages, userMessage].map(m => ({ role: m.role === 'scout' ? 'assistant' : 'user', content: m.content })), context);
      setMessages(prev => [...prev, { role: 'scout', content: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'scout', content: "I'm having trouble connecting to my central brain right now. Can we try that again?" }]);
    } finally {
      setLoading(false);
    }
  };

  const chips = userData?.enrolled.length 
    ? [`Explain my ${COURSES.find(c => c.id === userData.enrolled[0])?.title} course`, 'How can I learn faster?', 'What is my next module?']
    : ['Python loops explained', 'Web design principles', 'UI vs UX?', 'Game physics intro'];

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-surface-base">
      <header className="p-6 border-b border-brand-border bg-surface-card/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ScoutAvatar />
          <div>
            <h1 className="text-xl font-display font-black tracking-tight">Scout AI Tutor</h1>
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
              className="w-full bg-surface-elevated/80 border border-brand-border focus:border-primary rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-xl"
              placeholder="Ask Scout anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary hover:bg-secondary text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-muted-text text-center mt-4 uppercase tracking-widest font-black opacity-50">
            Powered by Gemini 3.1 Pro Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
