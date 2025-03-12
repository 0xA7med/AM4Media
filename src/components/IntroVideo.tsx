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

  return (
    <div className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        src={`https://drive.google.com/file/d/${videoId}/preview?`}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      ></iframe>
      <div className="absolute bottom-10 right-10 z-10">
        
      </div>
    </div>
  );
}
