import React, { useState, useRef, useEffect } from 'react';

export default function IntroVideo({ videoId }: IntroVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // تأكد من وجود الفيديو
    if (!videoId) {
      setHasError(true);
      return;
    }
    
    // إعادة تعيين حالة التحميل عند تغيير الفيديو
    setIsLoading(true);
    setHasError(false);
    
    // تعيين حالة التشغيل بعد تحميل الصفحة
    setIsPlaying(true);
    
    // إضافة مؤقت للتحقق من تحميل الفيديو
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        console.error('فشل تحميل الفيديو: انتهت مهلة التحميل');
      }
    }, 20000); // 20 ثانية للتحميل
    
    return () => clearTimeout(loadTimeout);
  }, [videoId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('فشل تحميل الفيديو');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      try {
        const message = isMuted ? 'unmute' : 'mute';
        videoRef.current.contentWindow?.postMessage(message, '*');
      } catch (error) {
        console.error('خطأ في التحكم بالصوت:', error);
      }
    }
  };

  const retryLoading = () => {
    setIsLoading(true);
    setHasError(false);
    // إعادة تحميل الإطار
    if (videoRef.current) {
      const src = videoRef.current.src;
      videoRef.current.src = '';
      setTimeout(() => {
        if (videoRef.current) videoRef.current.src = src;
      }, 100);
    }
  };

  // إذا لم يكن هناك فيديو
  if (!videoId) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-xl">لم يتم تعيين فيديو تعريفي</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-white">جاري تحميل الفيديو...</p>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20">
          <p className="text-red-500 text-xl mb-4">حدثت مشكلة أثناء تحميل الفيديو</p>
          <button 
            onClick={retryLoading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      
      <div className="absolute inset-0">
        <iframe
          ref={videoRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
      </div>
      
      <div className="absolute bottom-10 right-10 z-10">
        <button
          onClick={toggleMute}
          className="p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
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