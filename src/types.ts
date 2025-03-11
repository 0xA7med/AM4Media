export interface Video {
  id: string;
  title: string;
  description: string;
  categories: string[];
  thumbnail: string;
  aspectRatio: 'portrait' | 'square';
  createdAt: string; // إضافة حقل التاريخ
  introVideoId?: string; // معرف فيديو المقدمة من جوجل درايف

}

export interface IntroVideo {
  id: string;
  url: string;
  thumbnail: string;
}

export interface VideoStore {
  videos: Video[];
  introVideo: IntroVideo | null;
  categories: string[];
  addVideo: (video: Video) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  reorderVideos: (newOrder: Video[]) => void;
  loadVideos: () => void;
  saveVideos: () => void;
  setIntroVideo: (video: IntroVideo) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
}