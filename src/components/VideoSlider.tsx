import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface VideoSliderProps {
  videos: Video[];
}

const VideoSlider: React.FC<VideoSliderProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [videos.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const openPopup = (video: Video) => {
    setSelectedVideo(video);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedVideo(null);
  };

  const getEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {videos.map((video, index) => (
          <div key={index} className="w-full h-full absolute top-0 left-0"
            style={{ transform: `translateX(${index * 100}%)` }}>
            <div className="w-full h-full relative cursor-pointer group"
              onClick={() => openPopup(video)}>
              <img src={video.thumbnail} alt={video.title} 
                className="w-full h-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-2xl font-bold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {video.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-all duration-300 hover:scale-110">
        <ChevronLeft size={32} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition-all duration-300 hover:scale-110">
        <ChevronRight size={32} />
      </button>

      {showPopup && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8" onClick={closePopup}>
          <div className="w-full max-w-4xl aspect-video bg-black relative rounded-2xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
            <iframe 
              src={getEmbedUrl(selectedVideo.id)}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ border: 'none' }}
            />
            <button onClick={closePopup} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSlider;
