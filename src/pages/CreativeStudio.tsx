import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Music, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  FileSearch,
  Loader2,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  generateAiImage, 
  generateAiVideo, 
  checkVideoStatus, 
  downloadVideo, 
  generateAiMusic, 
  analyzeVideo, 
  transcribeAudio 
} from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function CreativeStudio() {
  const { userData } = useAuth();
  const [activeTool, setActiveTool] = useState<'image' | 'video' | 'music' | 'analyze' | 'transcribe'>('image');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [videoOp, setVideoOp] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Model Settings for Google AI Studio vs Enterprise scale Vertex services
  const [modelSettings, setModelSettings] = useState({
    image: 'gemini-2.5-flash-image',
    video: 'veo-3.1-lite-generate-preview',
    music: 'lyria-3-clip-preview',
    analyze: 'gemini-2.5-flash',
    transcribe: 'gemini-2.5-flash',
  });

  // Polling details for long-running video rendering
  const [pollingStatus, setPollingStatus] = useState<string>('');
  const [pollingProgress, setPollingProgress] = useState<number>(0);

  // Clear states when active tool switches
  useEffect(() => {
    setPrompt('');
    setResult(null);
    setFile(null);
    setVideoOp(null);
  }, [activeTool]);

  const modelOptions = {
    image: [
      { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', desc: 'Fast, conceptual still graphics synthesis directly inside AI Studio', provider: 'Google AI Studio (Free Preview)' },
      { id: 'gemini-3.1-flash-image-preview', name: 'Gemini 3.1 Flash Image', desc: 'Combines prompt-instruction alignment with web-search context grounding', provider: 'Google AI Studio (Experimental)' },
      { id: 'imagen-4.0-generate-001', name: 'Imagen 4.0 Pro', desc: 'Enterprise photorealistic and abstract high-resolution image model', provider: 'Google Cloud Generative AI' },
    ],
    video: [
      { id: 'veo-3.1-lite-generate-preview', name: 'Veo 3.1 Lite', desc: 'Generates stylized cinematic 720p clips in under 1 minute', provider: 'Google AI Studio (Free Preview)' },
      { id: 'veo-3.1-generate-preview', name: 'Veo 3.1 Pro', desc: 'Highest resolution (up to 4K / 1080p), fluid simulation dynamics', provider: 'Google Cloud Generative AI' },
    ],
    music: [
      { id: 'lyria-3-clip-preview', name: 'Lyria 3 Clip', desc: 'Synthesizes concise background scores & project cues up to 30s', provider: 'Google AI Studio (Free Preview)' },
      { id: 'lyria-3-pro-preview', name: 'Lyria 3 Pro', desc: 'Harnesses Vertex AI to produce full-length soundscapes & music tracks', provider: 'Google Cloud Generative AI' },
    ],
    analyze: [
      { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', desc: 'Unbelievably high processing speed for files and multimodal requests', provider: 'Google AI Studio (Default)' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Standard multivariant context window for visual and transcript comprehension', provider: 'Google AI Studio' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Substantial, deep reasoning for complex visual assets and code', provider: 'Google Cloud Generative AI' },
    ],
    transcribe: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Accurately maps text from sound bites and audio recordings', provider: 'Google AI Studio' },
      { id: 'chirp-2-speech-to-text', name: 'Google Chirp 2', desc: 'Specialized Google speech-to-text model with speaker tagging & timestamps', provider: 'Google Cloud Generative AI' },
    ],
  };

  const handleModelChange = (tool: string, val: string) => {
    setModelSettings(prev => ({ ...prev, [tool]: val }));
    toast.success(`Switched ${tool} engine to ${val}`);
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateAiImage(prompt, userData, aspectRatio, modelSettings.image);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setResult({ type: 'image', url: data.imageUrl });
      toast.success("Image generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const startVideoPolling = async (operationName: string) => {
    let checkCount = 0;
    
    const progressInterval = setInterval(() => {
      setPollingProgress(prev => {
        if (prev < 90) return prev + Math.floor(Math.random() * 6) + 1;
        return prev;
      });
      
      checkCount += 2;
      if (checkCount < 10) {
        setPollingStatus("Linking secure connection with Google Veo render-farm...");
      } else if (checkCount < 25) {
        setPollingStatus("Evaluating prompting coordinates, shaders, and keyframe motions...");
      } else if (checkCount < 45) {
        setPollingStatus("Synthesizing fluid scene vectors and volumetric dimensional curves...");
      } else {
        setPollingStatus("Fusing final cinematic color mappings and audio-visual tracks...");
      }
    }, 1000);

    const checkStatus = async (): Promise<boolean> => {
      try {
        const check = await checkVideoStatus(operationName);
        if (check.done) {
          clearInterval(progressInterval);
          setPollingProgress(100);
          setPollingStatus("Extracting generated video streams...");
          
          const blob = await downloadVideo(operationName);
          const videoUrl = URL.createObjectURL(blob);
          setResult({ type: 'video', url: videoUrl });
          setLoading(false);
          toast.success("Awesome! Your video file was successfully synthesized.");
          return true;
        }
        return false;
      } catch (err: any) {
        console.error("Video check error:", err);
        clearInterval(progressInterval);
        toast.error("Video synthesis failed on Google servers.");
        setLoading(false);
        return true;
      }
    };

    // Poll every 5 seconds
    const intervalId = setInterval(async () => {
      const isDone = await checkStatus();
      if (isDone) {
        clearInterval(intervalId);
      }
    }, 5000);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setResult(null);
    setPollingProgress(5);
    setPollingStatus("Submitting prompt instruction to Google Veo api...");
    try {
      const data = await generateAiVideo(prompt, userData, "16:9", modelSettings.video);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }
      setVideoOp(data.operationName);
      setResult({ type: 'video_pending', op: data.operationName });
      
      // Ignite active real-time polling!
      await startVideoPolling(data.operationName);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Video generation failed to register.");
      setLoading(false);
    }
  };

  const handleGenerateMusic = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateAiMusic(prompt, userData, modelSettings.music);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      const binary = atob(data.audioData);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mimeType });
      setResult({ type: 'music', url: URL.createObjectURL(blob) });
      toast.success("Audio track generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate track.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a video file to analyze.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await analyzeVideo(base64, file.type, userData, prompt, modelSettings.analyze);
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
          return;
        }
        setResult({ type: 'analysis', text: data.analysis });
        setLoading(false);
        toast.success("Analysis complete!");
      };
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Multimodal analysis query failed.");
      setLoading(false);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast.error("Please upload an audio file to transcribe.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await transcribeAudio(base64, file.type, userData, modelSettings.transcribe);
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
          return;
        }
        setResult({ type: 'transcription', text: data.transcription });
        setLoading(false);
        toast.success("Transcription complete!");
      };
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Audio transcription failed.");
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10" id="creative-studio-wrapper">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" id="creative-title-panel">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight flex items-center gap-3" id="creative-header-text">
            Creative Studio <Sparkles className="text-primary animate-pulse" />
          </h1>
          <p className="text-muted-text mt-1 text-lg">Harness high-quality AI generation for your projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="creative-workspace-grid">
        {/* Sidebar Tools */}
        <div className="lg:col-span-1 space-y-2" id="creative-tool-sidebar">
          {[
            { id: 'image', label: 'Image Gen', icon: ImageIcon },
            { id: 'video', label: 'Video Gen', icon: Video },
            { id: 'music', label: 'Music Gen', icon: Music },
            { id: 'analyze', label: 'Analysis', icon: FileSearch },
            { id: 'transcribe', label: 'Transcribe', icon: Mic },
          ].map(tool => (
            <button
              key={tool.id}
              id={`tool-btn-${tool.id}`}
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
        <div className="lg:col-span-3 space-y-8" id="creative-main-area">
          <div className="bg-surface-card border border-brand-border rounded-3xl p-8 space-y-6" id="tool-settings-card">
            <h2 className="text-xl font-display font-bold capitalize">Configure {activeTool}</h2>

            {/* Model settings selector */}
            <div className="bg-surface-elevated/40 border border-brand-border/60 rounded-2xl p-5 space-y-4" id="model-selection-region">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Select Model / Cognitive Service Engine
                </h3>
                <p className="text-xs text-muted-text mt-0.5">Toggle between lightweight Google AI Studio previews and premium Enterprise APIs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="model-tiles-grid">
                {modelOptions[activeTool].map((opt) => (
                  <button
                    key={opt.id}
                    id={`model-opt-${opt.id}`}
                    onClick={() => handleModelChange(activeTool, opt.id)}
                    className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between h-full ${
                      modelSettings[activeTool] === opt.id 
                      ? 'bg-primary/10 border-primary shadow-sm' 
                      : 'bg-surface-base/80 border-brand-border/40 text-muted-text hover:text-white hover:border-brand-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className={`text-[13px] font-black ${modelSettings[activeTool] === opt.id ? 'text-white' : 'text-neutral-300'}`}>
                        {opt.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase flex-shrink-0 ${
                        opt.provider.includes('Generative')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                      }`}>
                        {opt.provider.includes('Generative') ? 'Enterprise Pro' : 'AI Studio'}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-text mt-2 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2" id="prompt-input-wrapper">
              <label className="text-xs font-black uppercase tracking-widest text-muted-text">Prompt / Description</label>
              <textarea 
                className="w-full bg-surface-base border border-brand-border rounded-2xl p-6 text-white focus:outline-none focus:border-primary transition-all min-h-[120px]"
                id="creation-prompt-textarea"
                placeholder={
                  activeTool === 'image' ? "Describe the image you want (e.g., 'A modern cyberpunk classroom with high-resolution details')" :
                  activeTool === 'video' ? "Describe the scene motion (e.g., 'A drone camera soaring through sunset mountains smoothly')" :
                  activeTool === 'music' ? "Describe the track's vibe (e.g., 'Chill ambient study beats with heavy synth layers')" :
                  "Paste content link or outline details for media context analysis..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {activeTool === 'image' && (
              <div className="space-y-2" id="aspect-ratio-selector">
                <label className="text-xs font-black uppercase tracking-widest text-muted-text block mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['1:1', '16:9', '9:16', '4:3'].map(ratio => (
                    <button 
                      key={ratio}
                      id={`ratio-btn-${ratio}`}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        aspectRatio === ratio ? 'bg-primary border-primary text-white' : 'bg-surface-base border-brand-border text-muted-text hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTool === 'analyze' && (
              <div className="space-y-4" id="upload-analysis-wrapper">
                <div className="p-10 border-2 border-dashed border-brand-border rounded-2xl flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    id="analyze-file-input"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={onFileChange} 
                    accept="video/*"
                  />
                  <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center">
                    <Video className="text-muted-text" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{file && file.type.startsWith('video') ? file.name : "Upload Video to Analyze"}</p>
                    <p className="text-xs text-muted-text mt-1">MP4, WebM, MOV supported (max 20MB)</p>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'transcribe' && (
              <div className="space-y-4" id="upload-transcribe-wrapper">
                <div className="p-10 border-2 border-dashed border-brand-border rounded-2xl flex flex-col items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    id="transcribe-file-input"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={onFileChange} 
                    accept="audio/*"
                  />
                  <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center">
                    <Mic className="text-muted-text" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{file && file.type.startsWith('audio') ? file.name : "Upload Audio to Transcribe"}</p>
                    <p className="text-xs text-muted-text mt-1">MP3, WAV, M4A supported (max 20MB)</p>
                  </div>
                </div>
              </div>
            )}

            <button
              id="initiate-generation-button"
              onClick={() => {
                if (activeTool === 'image') handleGenerateImage();
                if (activeTool === 'video') handleGenerateVideo();
                if (activeTool === 'music') handleGenerateMusic();
                if (activeTool === 'analyze') handleAnalyze();
                if (activeTool === 'transcribe') handleTranscribe();
              }}
              disabled={loading || (activeTool !== 'analyze' && activeTool !== 'transcribe' && !prompt.trim()) || ((activeTool === 'analyze' || activeTool === 'transcribe') && !file)}
              className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-purple-glow transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {loading ? 'Processing Media...' : `Synthesize with ${activeTool === 'image' ? 'Imagen' : activeTool === 'video' ? 'Veo' : activeTool === 'music' ? 'Lyria' : activeTool === 'transcribe' ? 'Chirp' : 'Gemini'}`}
            </button>
          </div>

          {/* Result Display */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-card border border-brand-border rounded-3xl p-8 text-center space-y-6"
                id="studio-generation-result-panel"
              >
                <div className="flex items-center justify-center gap-2 text-primary" id="result-status-title">
                  <CheckCircle size={22} />
                  <h3 className="text-xl font-display font-black">Generation Success</h3>
                </div>
                
                {result.type === 'image' && (
                  <div className="rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto border border-brand-border/40" id="result-img-view">
                    <img src={result.url} alt="Generated" className="w-full h-auto" referrerPolicy="no-referrer" />
                  </div>
                )}

                {result.type === 'video_pending' && (
                  <div className="p-10 bg-surface-elevated/50 rounded-2xl border border-dashed border-primary/30 space-y-6" id="result-pending-video">
                    <Video size={48} className="mx-auto text-primary animate-pulse" />
                    <div>
                      <p className="font-bold text-white text-lg">Google Veo is Processing Your Request...</p>
                      <p className="text-sm text-primary tracking-wide font-mono font-bold mt-1">{pollingStatus}</p>
                    </div>
                    
                    {/* Live Progress Bar with beautiful purple glows */}
                    <div className="w-full max-w-md mx-auto bg-surface-base h-3.5 rounded-full overflow-hidden border border-brand-border relative">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300 shadow-purple-glow"
                        style={{ width: `${pollingProgress}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white font-mono">
                        {pollingProgress}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-text max-w-sm mx-auto">
                      Veo operations take between 20-40 seconds of backend scaling. Please remain on this screen.
                    </p>
                  </div>
                )}

                {result.type === 'video' && (
                  <div className="rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto border border-brand-border/40 bg-black relative group" id="result-video-view">
                    <video 
                      controls 
                      src={result.url} 
                      className="w-full h-auto aspect-video rounded-3xl"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-primary tracking-widest uppercase border border-primary/20">
                      High Fidelity mp4
                    </div>
                  </div>
                )}

                {result.type === 'music' && (
                  <div className="max-w-md mx-auto p-6 bg-surface-elevated rounded-2xl border border-primary/20 flex flex-col items-center gap-6" id="result-audio-view">
                    <Music size={48} className="text-primary animate-float" />
                    <audio controls src={result.url} className="w-full" />
                    <a href={result.url} download="generated-track.wav" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
                      <Download size={14} /> Download Track
                    </a>
                  </div>
                )}

                {result.type === 'analysis' && (
                  <div className="text-left max-w-2xl mx-auto p-6 bg-surface-elevated rounded-2xl border border-primary/20 space-y-4" id="result-analysis-view">
                    <div className="flex items-center gap-2 text-primary">
                      <FileSearch size={20} />
                      <span className="font-bold">Multimodal Comprehension Log</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-muted-text text-sm leading-relaxed whitespace-pre-wrap border-t border-brand-border/40 pt-4">
                      {result.text}
                    </div>
                  </div>
                )}

                {result.type === 'transcription' && (
                  <div className="text-left max-w-2xl mx-auto p-6 bg-surface-elevated rounded-2xl border border-primary/20 space-y-4" id="result-transcribe-view">
                    <div className="flex items-center gap-2 text-primary">
                      <Mic size={20} />
                      <span className="font-bold">STT Sound Parsing Transcript</span>
                    </div>
                    <div className="p-4 bg-surface-base rounded-xl font-mono text-xs text-muted-text leading-relaxed whitespace-pre-wrap border border-white/5 max-h-80 overflow-y-auto">
                      {result.text}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center pt-2">
                  <button onClick={() => setResult(null)} className="text-muted-text font-bold text-sm hover:text-white transition-colors">Dismiss</button>
                  <button className="bg-surface-elevated px-6 py-2 rounded-xl text-sm font-bold border border-white/5 text-neutral-300 hover:text-white">Save back to Library</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
