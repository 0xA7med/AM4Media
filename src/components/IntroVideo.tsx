import { useEffect, useRef, useState, SyntheticEvent } from "react";

interface IntroVideoProps {
  videoId: string;
}

export default function IntroVideo({ videoId }: IntroVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!videoId) {
      setError("لم يتم تحديد معرف الفيديو");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError("استغرق تحميل الفيديو وقتًا طويلاً، يرجى التحقق من اتصالك بالإنترنت");
        setIsLoading(false);
      }
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [videoId, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("حدث خطأ أثناء تحميل الفيديو");
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

  const retryLoading = () => {
    setIsLoading(true);
    setError(null);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src;
      }, 100);
    }
  };

  if (!videoId && !isLoading && !error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">لم يتم تعيين فيديو تعريفي</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
            <p className="text-white text-lg">جاري تحميل الفيديو...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md text-center">
            <p className="text-red-500 mb-4 text-lg">{error}</p>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
              onClick={retryLoading}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`https://drive.google.com/file/d/${videoId}/preview?`}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      ></iframe>
      
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={toggleMute}
          className="p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
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
      </div>
    </div>
  );
}