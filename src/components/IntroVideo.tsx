import { useEffect, useRef, useState } from "react";

interface IntroVideoProps {
  videoId: string;
}

export default function IntroVideo({ videoId }: IntroVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // تأكد من وجود معرف الفيديو
    if (!videoId) {
      setError("لم يتم تحديد معرف الفيديو");
      setIsLoading(false);
      return;
    }

    // إعادة ضبط حالة التحميل عند تغيير معرف الفيديو
    setIsLoading(true);
    setError(null);
  }, [videoId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("حدث خطأ أثناء تحميل الفيديو");
    setIsLoading(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const videoSrc = videoId.includes('drive.google.com') 
  ? videoId  // استخدام الرابط كاملاً إذا كان بتنسيق URL
  : `https://drive.google.com/file/d/${videoId}/preview?`;

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        src={videoSrc}
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      ></iframe>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
