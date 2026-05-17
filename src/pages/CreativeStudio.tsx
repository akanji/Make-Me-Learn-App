import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Music, 
  Video, 
  Image as ImageIcon, 
  Search, 
  Mic, 
  FileSearch,
  Loader2,
  Play,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { generateAiImage, generateAiVideo, generateAiMusic, checkVideoStatus } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';

export function CreativeStudio() {
  const [activeTool, setActiveTool] = useState<'image' | 'video' | 'music' | 'analyze'>('image');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [videoOp, setVideoOp] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateAiImage(prompt, aspectRatio);
      setResult({ type: 'image', url: data.imageUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateAiVideo(prompt, "16:9");
      setVideoOp(data.operationName);
      // In a real app, I'd poll from the UI
      setResult({ type: 'video_pending', op: data.operationName });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateAiMusic(prompt);
      const binary = atob(data.audioData);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mimeType });
      setResult({ type: 'music', url: URL.createObjectURL(blob) });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight flex items-center gap-3">
            Creative Studio <Sparkles className="text-primary" />
          </h1>
          <p className="text-muted-text mt-1 text-lg">Harness high-quality AI generation for your projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tools */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'image', label: 'Image Gen', icon: ImageIcon },
            { id: 'video', label: 'Video Gen', icon: Video },
            { id: 'music', label: 'Music Gen', icon: Music },
            { id: 'analyze', label: 'Analysis', icon: FileSearch },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border ${
                activeTool === tool.id 
                ? 'bg-primary/20 border-primary text-white shadow-purple-glow' 
                : 'bg-surface-card border-brand-border text-muted-text hover:text-white hover:bg-surface-elevated'
              }`}
            >
              <tool.icon size={20} />
              {tool.label}
            </button>
          ))}
        </div>

        {/* Main Work Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-surface-card border border-brand-border rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-display font-bold capitalize">Configure {activeTool}</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-text">Prompt / Description</label>
              <textarea 
                className="w-full bg-surface-base border border-brand-border rounded-2xl p-6 text-white focus:outline-none focus:border-primary transition-all min-h-[120px]"
                placeholder={
                  activeTool === 'image' ? "Describe the image you want (e.g., 'A cyberpunk classroom in purple and wine tones')" :
                  activeTool === 'video' ? "Describe the scene motion (e.g., 'A robot tutor floating through a futuristic library')" :
                  activeTool === 'music' ? "Describe the mood (e.g., 'Lo-fi study beats with a deep purple synth base')" :
                  "Paste a link or describe content to analyze..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {activeTool === 'image' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['1:1', '16:9', '9:16', '4:3'].map(ratio => (
                  <button 
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      aspectRatio === ratio ? 'bg-primary border-primary text-white' : 'bg-surface-base border-brand-border text-muted-text'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                if (activeTool === 'image') handleGenerateImage();
                if (activeTool === 'video') handleGenerateVideo();
                if (activeTool === 'music') handleGenerateMusic();
              }}
              disabled={loading || !prompt.trim()}
              className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-purple-glow transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? 'Processing...' : `Generate ${activeTool}`}
            </button>
          </div>

          {/* Result Display */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-card border border-brand-border rounded-3xl p-8 text-center space-y-6"
              >
                <h3 className="text-lg font-display font-bold">Generation Complete</h3>
                
                {result.type === 'image' && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto border-4 border-surface-elevated">
                    <img src={result.url} alt="Generated" className="w-full h-auto" />
                  </div>
                )}

                {result.type === 'video_pending' && (
                  <div className="p-10 bg-surface-elevated/50 rounded-2xl border border-dashed border-primary/30">
                    <Video size={48} className="mx-auto mb-4 text-primary animate-pulse" />
                    <p className="font-bold">Video generation is a long-running task.</p>
                    <p className="text-sm text-muted-text max-w-sm mx-auto mt-2">I've started the process (Op ID: {result.op}). In a full production app, I would poll for completion here.</p>
                  </div>
                )}

                {result.type === 'music' && (
                  <div className="max-w-md mx-auto p-6 bg-surface-elevated rounded-2xl border border-primary/20 flex flex-col items-center gap-6">
                    <Music size={48} className="text-primary animate-float" />
                    <audio controls src={result.url} className="w-full" />
                    <a href={result.url} download="generated-track.wav" className="text-sm text-primary font-bold hover:underline">Download Track</a>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button onClick={() => setResult(null)} className="text-muted-text font-bold text-sm hover:text-white transition-colors">Dismiss</button>
                  <button className="bg-surface-elevated px-6 py-2 rounded-xl text-sm font-bold border border-white/5">Save to Library</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
