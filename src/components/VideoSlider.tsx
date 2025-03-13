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

  return (
    <>
      <div className="relative z-10">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
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
                onClick={() => setSelectedVideo(video.id)}
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

      {/* النافذة العائمة */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <VideoModal
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            videoId={selectedVideo}
          />
        </div>
      )}
    </>
  );
}
