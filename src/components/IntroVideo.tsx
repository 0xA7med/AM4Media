import { useEffect, useRef, useState } from "react";

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      try {
        video.play().catch(e => {
          console.error("فشل تشغيل الفيديو تلقائيًا:", e);
          setError("فشل تشغيل الفيديو تلقائيًا");
        });
      } catch (e) {
        console.error("خطأ غير متوقع:", e);
        setError("حدث خطأ أثناء تشغيل الفيديو");
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setError("فشل تحميل الفيديو");
      console.error("خطأ في تحميل الفيديو", video.error);
    };

    // إضافة مستمع لأحداث تحميل الفيديو والأخطاء
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // تأكد من أن الفيديو يحاول التحميل
    video.load();

    // إضافة مهلة زمنية للكشف عن مشاكل التحميل
    const timeoutId = setTimeout(() => {
      if (isLoading && !video.readyState) {
        setError("استغرق تحميل الفيديو وقتًا طويلاً، يرجى التحقق من اتصالك بالإنترنت");
      }
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [isLoading]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const retryLoading = () => {
    setIsLoading(true);
    setError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
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
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted={isMuted}
        loop
        autoPlay
        preload="auto"
        poster="/images/poster.jpg" // تأكد من وجود هذه الصورة
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
        <source src="/videos/intro.webm" type="video/webm" />
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
      
      <div className="absolute bottom-10 right-10 z-10">
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