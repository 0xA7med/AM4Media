import { create } from 'zustand';
import { Video, VideoStore, IntroVideo } from './types';

const STORAGE_KEY = 'portfolio_videos';
const INTRO_VIDEO_KEY = 'intro_video';
const CATEGORIES_KEY = 'video_categories';

export const useVideos = create<VideoStore>((set, get) => ({
  videos: [],
  introVideo: null,
  categories: [],
  
  addVideo: (video) => {
    set((state) => ({
      videos: [...state.videos, video],
      categories: [...new Set([...state.categories, ...video.categories])]
    }));
    get().saveVideos();
  },
  
  updateVideo: (id, updatedVideo) => {
    set((state) => ({
      videos: state.videos.map((video) => 
        video.id === id ? { ...video, ...updatedVideo } : video
      )
    }));
    get().saveVideos();
  },
  
  deleteVideo: (id) => {
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id)
    }));
    get().saveVideos();
  },

  reorderVideos: (newOrder) => {
    set({ videos: newOrder });
    get().saveVideos();
  },
  
  loadVideos: () => {
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    const savedIntroVideo = localStorage.getItem(INTRO_VIDEO_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    if (savedVideos) {
      set({ videos: JSON.parse(savedVideos) });
    }
    if (savedIntroVideo) {
      set({ introVideo: JSON.parse(savedIntroVideo) });
    }
    if (savedCategories) {
      set({ categories: JSON.parse(savedCategories) });
    }
  },
  
  saveVideos: () => {
    const { videos, introVideo, categories } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    localStorage.setItem(INTRO_VIDEO_KEY, JSON.stringify(introVideo));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  setIntroVideo: (video) => {
    set({ introVideo: video });
    localStorage.setItem(INTRO_VIDEO_KEY, JSON.stringify(video));
  },

  setVideoAsIntro: (videoId: string) => set(state => {
    const video = state.videos.find(v => v.id === videoId);
    if (video) {
      return { introVideo: { id: video.id, url: video.driveUrl || '' } };
    }
    return state;
  }),

  addCategory: (category) => {
    set((state) => ({
      categories: [...new Set([...state.categories, category])]
    }));
    get().saveVideos();
  },

  removeCategory: (category) => {
    set((state) => ({
      categories: state.categories.filter((c) => c !== category)
    }));
    get().saveVideos();
  }
}));