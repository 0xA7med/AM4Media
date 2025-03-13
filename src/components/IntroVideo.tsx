import { useEffect, useRef, useState } from "react";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";

interface IntroVideoProps {
  videoId: string;
  className?: string;
}

export default function IntroVideo({ videoId, className = "" }: IntroVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    // تأكد من وجود معرف الفيديو
    if (!videoId) {
      setError("لم يتم تحديد معرف الفيديو");
      setIsLoading(false);
      return;
    }

    // إعادة ضبط حالة التحميل
    setIsLoading(true);
    setError(null);

    // تحديد مهلة زمنية للتحميل
    loadTimerRef.current = setTimeout(() => {
      if (isLoading) {
        setError("تجاوز وقت تحميل الفيديو. يرجى المحاولة مرة أخرى.");
        setIsLoading(false);
      }
    }, 20000);

    // التنظيف عند إلغاء التحميل
    return () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    };
  }, [videoId, key]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // إلغاء المهلة الزمنية بعد التحميل الناجح
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
    }
  };

  const handleIframeError = () => {
    setError("حدث خطأ أثناء تحميل الفيديو");
    setIsLoading(false);
  };

  const reloadVideo = () => {
    // إعادة تحميل المكون بالكامل عن طريق تغيير المفتاح
    setKey(Date.now());
  };

  // تحسين رابط الفيديو لتفادي التحميل المتكرر
  const videoUrl = `https://drive.google.com/file/d/${videoId}/preview`;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* حالة التحميل */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}

      {/* حالة الخطأ */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-10">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-white text-center text-lg mx-4 mb-4">{error}</p>
          <button 
            onClick={reloadVideo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة تحميل الفيديو
          </button>
        </div>
      )}

      {/* الفيديو - استخدام iframe مع تحسينات */}
      <iframe
        key={key}
        ref={iframeRef}
        src={videoUrl}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      ></iframe>
    </div>
  );
}