import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  videoId: string;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ videoId }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      const message = isMuted ? 'unmute' : 'mute';
      videoRef.current.contentWindow?.postMessage(message, '*');
    }
  };

  
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        ref={videoRef}
        src={`https://drive.google.com/file/d/${videoId}/preview?autoplay=1&mute=1`}
        width="100%"
        height="100%"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default IntroVideo;