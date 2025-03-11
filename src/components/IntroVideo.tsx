import React, { useState, useEffect } from 'react';

interface IntroVideoProps {
  videoId: string;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ videoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [videoId]);

  if (!videoId) {
    return <div className="intro-video-placeholder">لا يوجد فيديو تعريفي</div>;
  }

  return (
    <div className="intro-video-container relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <iframe
        src={`https://drive.google.com/file/d/${videoId}/preview`}
        width="100%"
        height="100%"
        allow="autoplay"
        onLoad={handleIframeLoad}
        className={`w-full h-full ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setError(true)}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          حدث خطأ أثناء تحميل الفيديو
        </div>
      )}
    </div>
  );
};