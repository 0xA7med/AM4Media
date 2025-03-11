import React, { useRef, useState, useEffect } from 'react';
import { Spinner } from './Spinner';

interface IntroVideoProps {
  videoUrl: string;
  className?: string;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ videoUrl, className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/d\/(.+?)\//)
        ? url.match(/\/d\/(.+?)\//)![1]
        : url.split('/d/')[1]?.split('/')[0];
      
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    const timeout = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [videoUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    
    if (iframeRef.current) {
      iframeRef.current.src = getEmbedUrl(videoUrl);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = isMuted ? 'unmute' : 'mute';
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      <div className="relative aspect-video w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Spinner />
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 text-center">
            <p className="mb-4 text-red-500">فشل في تحميل الفيديو</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={getEmbedUrl(videoUrl)}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          ></iframe>
        )}
        
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
          aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};