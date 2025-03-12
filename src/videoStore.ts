import { create } from 'zustand';
import { Video, VideoStore, IntroVideo } from './types';

const STORAGE_KEY = 'portfolio_videos';
const INTRO_VIDEO_KEY = 'intro_video';
const CATEGORIES_KEY = 'portfolio_categories';

async function fetchFromGist() {
  try {
    const gistId = import.meta.env.VITE_GIST_ID;
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    console.log("جاري تحميل البيانات من Gist:", gistId);
    
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (!response.ok) {
      console.error(`خطأ: ${response.status}`, await response.text());
      throw new Error(`فشل في جلب البيانات: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("تم استلام البيانات:", data);
    
    if (!data.files || !data.files['videos.json']) {
      console.error("ملف 'videos.json' غير موجود في Gist");
      return null;
    }
    
    const content = data.files['videos.json'].content;
    
    // هنا التغيير الرئيسي: التعامل مع حالة البيانات كمصفوفة
    try {
      const parsedContent = JSON.parse(content);
      console.log("محتوى ملف JSON:", parsedContent);
      
      // تحقق مما إذا كانت البيانات مصفوفة (شكل البيانات القديم)
      if (Array.isArray(parsedContent)) {
        console.log("البيانات موجودة بتنسيق المصفوفة، سيتم تحويلها للتنسيق الجديد");
        
        // استخراج جميع الفئات من الفيديوهات
        const allCategories = new Set();
        parsedContent.forEach(video => {
          if (video.categories && Array.isArray(video.categories)) {
            video.categories.forEach(cat => allCategories.add(cat));
          }
        });
        
        // إنشاء هيكل البيانات المتوقع
        return {
          videos: parsedContent,
          categories: Array.from(allCategories),
          introVideo: null
        };
      }
      
      // الهيكل الجديد (إذا كان موجودًا بالفعل)
      return {
        videos: parsedContent.videos || [],
        categories: parsedContent.categories || [],
        introVideo: parsedContent.introVideo || null
      };
    } catch (error) {
      console.error("خطأ في تحليل محتوى JSON:", error);
      return null;
    }
  } catch (error) {
    console.error('فشل في جلب البيانات من Gist:', error);
    return null;
  }
}

async function saveToGist(data) {
  try {
    const gistId = import.meta.env.VITE_GIST_ID;
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    // حفظ الفيديوهات فقط (لتتوافق مع الشكل الأصلي)
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'videos.json': {
            content: JSON.stringify(data.videos, null, 2)
          }
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`فشل في الحفظ: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('فشل في حفظ البيانات إلى Gist:', error);
    // استخدام التخزين المحلي كنسخة احتياطية
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.videos));
    localStorage.setItem(INTRO_VIDEO_KEY, JSON.stringify(data.introVideo));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
    return false;
  }
}

export const useVideos = create<VideoStore>((set, get) => ({
  videos: [],
  introVideo: null,
  categories: [],
  
  loadVideos: async () => {
    try {
      console.log("جاري تحميل البيانات...");
      
      // محاولة تحميل البيانات من Gist
      const gistData = await fetchFromGist();
      
      if (gistData) {
        console.log("تم تحميل البيانات من Gist:", gistData);
        
        set({ 
          videos: Array.isArray(gistData.videos) ? gistData.videos : [],
          introVideo: gistData.introVideo || null,
          categories: Array.isArray(gistData.categories) ? gistData.categories : []
        });
        
        console.log('تم تحميل البيانات من Gist بنجاح');
        return;
      }
    } catch (error) {
      console.error('خطأ أثناء تحميل البيانات من Gist:', error);
    }
    


    // استخدام التخزين المحلي كنسخة احتياطية
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
  

  saveVideos: async () => {
    const { videos, introVideo, categories } = get();
    const data = { videos, introVideo, categories };
    
    // محاولة الحفظ في Gist
    const success = await saveToGist(data);
    
    if (!success) {
      console.log('فشل الحفظ في Gist، تم استخدام التخزين المحلي كنسخة احتياطية');
    } else {
      console.log('تم حفظ البيانات في Gist بنجاح');
    }
  },

  addVideo: (video) => {
    const uniqueId = `${video.id}_${Date.now()}`;
    const videoWithUniqueId = {
      ...video,
      uniqueId
    };
    
    set((state) => ({
      videos: [videoWithUniqueId, ...state.videos],
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
  
  


  setIntroVideo: (video) => {
    set({ introVideo: video });
    get().saveVideos();
  },

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