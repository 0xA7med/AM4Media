import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Video } from '../types';
import VideoModal from './VideoModal';
import 'swiper/css';
import 'swiper/css/navigation';

interface VideoSliderProps {
  videos: Video[];
}

export default function VideoSlider({ videos }: VideoSliderProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const recentVideos = videos.slice(0, 5);

  // إيقاف التشغيل التلقائي عند فتح الفيديو
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  return (
    <>
      <div className="relative" style={{ zIndex: 1 }}>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="py-8"
        >
          {recentVideos.map((video) => (
            <SwiperSlide key={video.id}>
              <button
                onClick={() => handleVideoSelect(video.id)}
                className="relative aspect-video w-full rounded-xl overflow-hidden group"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* تأكد من فصل المكون عن النافذة المنبثقة */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo || ''}
      />
    </>
  );
}