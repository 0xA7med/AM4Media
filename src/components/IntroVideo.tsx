import React, { useRef, useState, useEffect } from 'react';

interface IntroVideoProps {
  videoUrl: string;
  className?: string;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ videoUrl, className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/d\/(.+?)\//)
        ? url.match(/\/d\/(.+?)\//)![1]
        : url.split('/d/')[1]?.split('/')[0];
      
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  useEffect(() => {
    setLoading(true);
    
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [videoUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      <div className="relative aspect-video w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={getEmbedUrl(videoUrl)}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        ></iframe>
      </div>
    </div>
  );
};