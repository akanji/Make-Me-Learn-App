import React, { useState, useRef } from 'react';
import { Play, Pause, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoPlayerProps {
  title: string;
  url: string;
}

export function VideoPlayer({ title, url }: VideoPlayerProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Extract video ID from YouTube URL
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isHovering ? 1 : 0}&mute=1&controls=0&modestbranding=1`;

  return (
    <div 
      className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-surface-base group cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => window.open(url, '_blank')}
    >
      {isHovering ? (
        <iframe
          className="w-full h-full pointer-events-none"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-elevated/40 relative">
           <img 
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity"
          />
          <Youtube className="w-12 h-12 text-red-500 mb-2 relative z-10" />
           <span className="text-xs font-bold text-muted-text uppercase tracking-widest relative z-10">Preview on Hover</span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
        >
          {isHovering ? <Pause className="text-white fill-white" /> : <Play className="text-white fill-white ml-1" />}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-sm font-bold text-white truncate">{title}</p>
      </div>
    </div>
  );
}
