import React, { useState } from 'react';
import { Video } from '../types';
import VideoModal from './VideoModal';

interface VideoGalleryProps {
  videos: Video[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories from all videos
  const categories = Array.from(new Set(videos.flatMap(video => video.categories)));
  
  // Filter videos based on selected category
  const filteredVideos = selectedCategory
    ? videos.filter(video => video.categories.includes(selectedCategory))
    : videos;

  return (
    <>
      {/* Categories Filter */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          الكل
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div key={video.id} className="relative group">
            <button
              onClick={() => setSelectedVideo(video.id)}
              className={`block relative overflow-hidden rounded-xl w-full ${
                video.aspectRatio === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-200 text-sm">{video.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {video.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo || ''}
      />
    </>
  );
}