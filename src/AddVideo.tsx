// src/AddVideo.tsx
import React, { useState, useEffect } from 'react';
import { addVideo, Video, useVideos } from './videoStore';
import { useNavigate } from 'react-router-dom';

// دالة لاستخراج معرف الفيديو من رابط جوجل درايف
const getGoogleDriveId = (url: string): string => {
  try {
    if (!url) return '';
    
    // نمط للبحث عن معرف جوجل درايف في الرابط
    const patterns = [
      /\/file\/d\/([^\/]+)/,           // https://drive.google.com/file/d/FILEID/view
      /id=([^&]+)/,                    // https://drive.google.com/open?id=FILEID
      /\/d\/([^\/]+)/,                 // https://drive.google.com/d/FILEID/view
      /^([a-zA-Z0-9_-]{25,})/          // المعرف مباشرة
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return '';
  } catch (error) {
    console.error('خطأ في استخراج معرف جوجل درايف:', error);
    return '';
  }
};

// تعريف الأنواع
type AspectRatio = 'portrait' | 'square' | 'landscape';
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  list?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string; // إضافة خاصية id
}

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit';
}

// إعادة مكونات UI كما كانت
const Input = ({ value, onChange, placeholder, className, list, onKeyDown, ...props }: InputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    list={list}
    onKeyDown={onKeyDown}
    {...props}
  />
);

const Button = ({ onClick, className, children, type }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
    type={type}
  >
    {children}
  </button>
);

const Card = ({ className, children }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default function AddVideo() {
  const navigate = useNavigate();
  const videos = useVideos();
  
  const [newVideo, setNewVideo] = useState<Video>({
    id: '',
    title: '',
    description: '',
    categories: [],
    thumbnail: '',
    aspectRatio: 'square' as AspectRatio,
    url: ''
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [thumbnailOptions, setThumbnailOptions] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]);

  useEffect(() => {
    setNewVideo(prev => ({ ...prev, id: Date.now().toString() }));
    
    if (videos && videos.length > 0) {
      const allCategories = videos.flatMap(video => video.categories || []);
      const uniqueCategories = [...new Set(allCategories)];
      setExistingCategories(uniqueCategories);
    }
  }, [videos]);

  // دالة إنشاء خيارات الصور المصغرة
  const generateThumbnailOptions = (videoId) => {
    if (!videoId) return [];
    
    return [
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w1000`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w2000`
    ];
  };

  // استخراج الصور المصغرة
  const handleExtractThumbnails = () => {
    if (!newVideo.url.trim()) {
      alert("يرجى إدخال رابط الفيديو أولاً");
      return;
    }
    
    setIsLoadingThumbnails(true);
    const videoId = getGoogleDriveId(newVideo.url);
    
    if (!videoId) {
      alert("لم يتم العثور على معرف الفيديو في الرابط");
      return;
    }
    
    const options = generateThumbnailOptions(videoId);
    setThumbnailOptions(options);
    setIsLoadingThumbnails(false);
    
    if (options.length > 0) {
      setNewVideo(prev => ({ ...prev, thumbnail: options[0] }));
    }
  };
  
  // نسخ الكود إلى الحافظة
  const handleCopyCode = () => {
    const videoDataString = JSON.stringify(newVideo, null, 2);
    navigator.clipboard.writeText(videoDataString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // إدارة الفئات
  const handleAddCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== category));
  };
  
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newVideo.title.trim() || !newVideo.url.trim() || !newVideo.thumbnail.trim()) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }
  
  const videoToAdd: Video = {
    ...newVideo,
    categories: selectedCategories,
    aspectRatio: newVideo.aspectRatio as AspectRatio
  };
  
  addVideo(videoToAdd);
  setSuccessMessage("تم إضافة الفيديو بنجاح");
  
  setTimeout(() => {
    setNewVideo({
      id: Date.now().toString(),
      title: '',
      description: '',
      categories: [],
      thumbnail: '',
      aspectRatio: 'square' as AspectRatio,
      url: ''
    });
    setSelectedCategories([]);
    setSuccessMessage("");
  }, 5000);
};

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Button onClick={() => navigate('/')} className="mb-4">
        العودة إلى القائمة
      </Button>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold mb-6">
            إضافة فيديو جديد
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="videoTitle" className="block mb-2">عنوان الفيديو</label>
              <Input
                id="videoTitle"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="أدخل عنوان الفيديو"
              />
            </div>
            
            <div>
              <label htmlFor="videoDescription" className="block mb-2">وصف الفيديو (اختياري)</label>
              <textarea
                id="videoDescription"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="أدخل وصف الفيديو"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="videoUrl" className="block mb-2">رابط الفيديو (جوجل درايف)</label>
              <div className="flex">
                <Input
                  id="videoUrl"
                  value={newVideo.url}
                  onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                  placeholder="أدخل رابط الفيديو من جوجل درايف"
                  className="flex-1"
                />
                <Button onClick={handleExtractThumbnails} className="mr-2" type="button">
                  استخراج الصور
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block mb-2">الفئات</label>
              <div className="flex mb-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="أضف فئة جديدة"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  list="categories-list"
                />
                <Button onClick={handleAddCategory} className="mr-2" type="button">
                  إضافة
                </Button>
              </div>
              
              <datalist id="categories-list">
                {existingCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(category => (
                  <span key={category} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm flex items-center">
                    {category}
                    <button 
                      onClick={() => handleRemoveCategory(category)} 
                      className="ml-1 text-xs bg-blue-200 dark:bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {existingCategories.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">فئات مستخدمة سابقًا:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingCategories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          if (!selectedCategories.includes(category)) {
                            setSelectedCategories([...selectedCategories, category]);
                          }
                        }}
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedCategories.includes(category)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-2">نسبة العرض</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aspectRatio"
                    value="square"
                    checked={newVideo.aspectRatio === "square"}
                    onChange={() => setNewVideo({ ...newVideo, aspectRatio: "square" as AspectRatio })}
                    className="mr-2"
                  />
                  مربع (1:1)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aspectRatio"
                    value="portrait"
                    checked={newVideo.aspectRatio === "portrait"}
                    onChange={() => setNewVideo({ ...newVideo, aspectRatio: "portrait" as AspectRatio })}
                    className="mr-2"
                  />
                  طولي (9:16)
                </label>
              </div>
            </div>
            
            <div>
              <label className="block mb-2">الصورة المصغرة</label>
              {newVideo.thumbnail && (
                <div className="mb-4">
                  <img 
                    src={newVideo.thumbnail} 
                    alt="معاينة الصورة المصغرة" 
                    className="w-full max-w-sm h-auto rounded-md shadow-md" 
                  />
                </div>
              )}
              
              {thumbnailOptions.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {thumbnailOptions.map((thumbUrl, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer border-2 rounded-md p-1 ${newVideo.thumbnail === thumbUrl ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setNewVideo({ ...newVideo, thumbnail: thumbUrl })}
                    >
                      <img src={thumbUrl} alt={`الخيار ${index + 1}`} className="w-full h-auto rounded" />
                    </div>
                  ))}
                </div>
              )}
              
              <Input
                value={newVideo.thumbnail}
                onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                placeholder="أدخل رابط الصورة المصغرة"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button onClick={handleCopyCode} type="button" className="bg-gray-600">
                نسخ البيانات
              </Button>
              <Button 
  onClick={handleSubmit} // إضافة onClick
  type="submit"
>
  حفظ الفيديو
</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}