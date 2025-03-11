import React, { useState, useRef, useEffect } from 'react';

interface IntroVideoProps {
  videoId: string;
}

export default function IntroVideo({ videoId }: IntroVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // تأكد من وجود الفيديو
    if (!videoId) return;
    
    // تعيين حالة التشغيل بعد تحميل الصفحة
    setIsPlaying(true);
  }, [videoId]);

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

  // إذا لم يكن هناك معرف للفيديو، عرض رسالة
  if (!videoId) {
    return <div className="relative w-full aspect-video rounded-xl bg-gray-800 flex items-center justify-center text-white">لم يتم تعيين فيديو تعريفي</div>;
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        ref={videoRef}
        src={`https://drive.google.com/file/d/${videoId}/preview?autoplay=1&mute=${isMuted ? 1 : 0}`}
        width="100%"
        height="100%"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <line x1="3" y1="3" x2="21" y2="21"></line>
            <path d="M18.4 5.6a10 10 0 0 1 2.6 6.4"></path>
            <path d="M19.5 2.5a16 16 0 0 1 4.5 11.5"></path>
            <path d="M12 6L8 10H4v4h4l4 4V6z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 6L8 10H4v4h4l4 4V6z"></path>
            <path d="M18.4 5.6a10 10 0 0 1 2.6 6.4"></path>
            <path d="M19.5 2.5a16 16 0 0 1 4.5 11.5"></path>
          </svg>
        )}
      </button>
    </div>
  );
}