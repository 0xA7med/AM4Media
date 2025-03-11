import React, { useState, useEffect, useRef } from 'react';

interface IntroVideoProps {
  videoId: string;
}
// في ملف IntroVideo.tsx
const IntroVideo: React.FC<IntroVideoProps> = ({ videoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false); // إعادة تعيين حالة الخطأ عند التحميل الناجح
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const message = isMuted ? 'unmute' : 'mute';
        iframeRef.current.contentWindow.postMessage(message, '*');
      } catch (error) {
        console.error('خطأ في التحكم بالصوت:', error);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);

    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000); // 10 ثواني كحد أقصى للتحميل

    return () => clearTimeout(timeoutId);
  }, [videoId]);

  if (!videoId) {
    return null;
  }

  return (
    <div className="intro-video-container relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`https://drive.google.com/file/d/${videoId}/preview?autoplay=1&mute=${isMuted ? 1 : 0}`}
        width="100%"
        height="100%"
        allow="autoplay"
        onLoad={handleIframeLoad}
        className={`w-full h-full ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
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
      
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          حدث خطأ أثناء تحميل الفيديو
        </div>
      )}
    </div>
  );
};

export default IntroVideo;