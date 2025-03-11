import React, { useState, useRef, useEffect } from 'react';

interface IntroVideoProps {
  videoId: string;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ videoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16'>('16:9');

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
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
    const handleErrorState = () => {
      if (iframeRef.current && !iframeRef.current.contentWindow) {
        setError(true);
        setLoading(false);
      }
    };

    // تحديد نسبة الأبعاد بناءً على عرض الشاشة
    const updateAspectRatio = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setAspectRatio('9:16'); // للموبايل
      } else if (width <= 1024) {
        setAspectRatio('1:1'); // للتابلت
      } else {
        setAspectRatio('16:9'); // للديسكتوب
      }
    };

    updateAspectRatio();
    window.addEventListener('resize', updateAspectRatio);
    
    const timer = setTimeout(handleErrorState, 5000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateAspectRatio);
    };
  }, []);

  // حساب قيم CSS لنسبة الأبعاد
  const getPaddingTop = () => {
    switch (aspectRatio) {
      case '16:9': return '56.25%'; // 9/16 * 100%
      case '1:1': return '100%';
      case '9:16': return '177.78%'; // 16/9 * 100%
      default: return '56.25%';
    }
  };

  if (!videoId) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl">
      <div style={{ paddingTop: getPaddingTop() }} className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
            <p className="mb-2">حدث خطأ أثناء تحميل الفيديو</p>
            <button 
              onClick={() => { setLoading(true); setError(false); }}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            <iframe
              ref={iframeRef}
              src={`https://drive.google.com/file/d/${videoId}/preview?autoplay=1${isMuted ? '&mute=1' : ''}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              onLoad={handleIframeLoad}
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            
            <button 
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-black bg-opacity-60 rounded-full p-2 text-white hover:bg-opacity-80 transition z-10"
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H2v6h4l5 4V5z"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IntroVideo;