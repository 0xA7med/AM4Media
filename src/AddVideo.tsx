import React, { useState, useEffect } from 'react';
import { addVideo } from './videoStore';
import { videoStructure } from './videos';
import { useNavigate } from 'react-router-dom';

// استيراد الأيقونات
// يمكنك إزالة هذا السطر إذا كانت مكتبة lucide-react غير متوفرة
// import { Copy, Check, Eye, X, Plus, Trash, Edit2, ArrowLeft } from 'lucide-react';

// دالة لاستخراج معرف الفيديو من رابط جوجل درايف
const getGoogleDriveId = (url: string): string => {
  try {
    if (!url) return null;
    
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
    
    return null;
  } catch (error) {
    console.error('خطأ في استخراج معرف جوجل درايف:', error);
    return '';
  }
}

// مكونات بسيطة
const Input = ({ type, value, onChange, placeholder, className, ...props }) => (
  <input
    type={type || "text"}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className || ''}`}
    {...props}
  />
);

const Select = ({ value, onChange, options, className, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className || ''}`}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// مكونات UI بسيطة بدلاً من استيراد مكتبات خارجية
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className || ''}`} {...props}>
    {children}
  </div>
);

const Button = ({ onClick, children, className, disabled, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md ${className || 'bg-blue-600 hover:bg-blue-700 text-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    {...props}
  >
    {children}
  </button>
);

const RadioGroup = ({ value, onValueChange, children, className, ...props }) => (
  <div className={`flex space-x-4 ${className || ''}`} {...props}>
    {children}
  </div>
);

const RadioGroupItem = ({ value, id, className, ...props }) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      value={value}
      className={className}
      {...props}
    />
  </div>
);

export default function AddVideo() {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({
    ...videoStructure,
    id: '',
    title: '',
    description: '',
    categories: [],
    thumbnail: '',
    aspectRatio: 'square',
  });
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [thumbnailOptions, setThumbnailOptions] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // مكونات الأيقونات البسيطة
  const IconEdit = () => <span className="text-blue-600">✏️</span>;
  const IconTrash = () => <span className="text-red-600">🗑️</span>;
  const IconEye = () => <span className="text-green-600">👁️</span>;
  const IconCopy = () => <span className="text-purple-600">📋</span>;
  const IconCheck = () => <span className="text-green-600">✓</span>;
  const IconX = () => <span className="text-red-600">✕</span>;
  const IconPlus = () => <span className="text-blue-600">+</span>;
  const IconArrowLeft = () => <span className="text-gray-600">←</span>;
  const extractThumbnailsFromVideo = (videoId) => {
    if (!videoId) return [];
    
    // إنشاء مجموعة من الصور المصغرة بأحجام مختلفة
    return [
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w400`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w800`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w1200`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w2000`
    ];
  };

  const handleExtractThumbnails = () => {
    if (!videoData.url.trim()) {
      alert("يرجى إدخال رابط الفيديو أولاً");
      return;
    }
    
    const videoId = getGoogleDriveId(videoData.url);
    if (!videoId) {
      alert("لم يتم العثور على معرف الفيديو في الرابط");
      return;
    }
    
    setIsLoadingThumbnails(true);
    const options = extractThumbnailsFromVideo(videoId);
    setThumbnailOptions(options);
    setIsLoadingThumbnails(false);
    
    if (options.length > 0) {
      setVideoData({ ...videoData, thumbnail: options[0] });
    }
  };

  const handleCopyCode = () => {
    const videoDataString = JSON.stringify(videoData, null, 2);
    navigator.clipboard.writeText(videoDataString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التأكد من توافق البيانات مع الهيكل المطلوب
    const newVideo = {
      ...videoData,
      id: videoData.id,
      categories: selectedCategories,
    };
    
    // استخدام دالة addVideo المحدثة التي ستقوم بإرسال البيانات للسيرفر
    addVideo(newVideo);
    
    // إعادة توجيه المستخدم للصفحة الرئيسية
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Button onClick={() => navigate('/')} className="mb-4">
        <IconArrowLeft /> العودة إلى القائمة
      </Button>
      
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold mb-6">
            إضافة فيديو جديد
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="videoTitle" className="block mb-2">عنوان الفيديو</label>
              <Input
                id="videoTitle"
                value={videoData.title}
                onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                placeholder="أدخل عنوان الفيديو"
              />
            </div>
            
            <div>
              <label htmlFor="videoDescription" className="block mb-2">وصف الفيديو (اختياري)</label>
              <textarea
                id="videoDescription"
                value={videoData.description}
                onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
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
                  value={videoData.url}
                  onChange={(e) => setVideoData({ ...videoData, url: e.target.value })}
                  placeholder="أدخل رابط الفيديو من جوجل درايف"
                  className="flex-1"
                />
                <Button onClick={handleExtractThumbnails} className="mr-2">
                  استخراج الصور المصغرة
                </Button>
                <Button onClick={handleCopyCode} className="p-1 mr-2">
                  {copiedCode ? <IconCheck /> : <IconCopy />}
                </Button>
                <Button onClick={() => window.open(videoData.url, '_blank')} className="p-1">
                  <IconEye />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block mb-2">نسبة العرض إلى الارتفاع</label>
              <RadioGroup
                value={videoData.aspectRatio}
                onValueChange={(value) => setVideoData({ ...videoData, aspectRatio: value })}
                className="flex space-x-4"
              >
                <div className="flex items-center">
                  <RadioGroupItem
                    value="square"
                    id="square"
                    name="aspectRatio"
                    checked={videoData.aspectRatio === "square"}
                    onChange={() => setVideoData({ ...videoData, aspectRatio: "square" })}
                  />
                  <label htmlFor="square" className="mr-2">مربع (1:1)</label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem
                    value="video"
                    id="video"
                    name="aspectRatio"
                    checked={videoData.aspectRatio === "video"}
                    onChange={() => setVideoData({ ...videoData, aspectRatio: "video" })}
                  />
                  <label htmlFor="video" className="mr-2">فيديو (16:9)</label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <label className="block mb-2">الصورة المصغرة</label>
              {isLoadingThumbnails ? (
                <p>جاري تحميل الصور المصغرة...</p>
              ) : thumbnailOptions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {thumbnailOptions.map((thumbnail, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden ${videoData.thumbnail === thumbnail ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setVideoData({ ...videoData, thumbnail })}
                    >
                      <img 
                        src={thumbnail} 
                        alt={`صورة مصغرة ${index + 1}`} 
                        className={`w-full ${videoData.aspectRatio === "square" ? "aspect-square" : "aspect-video"} object-cover`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4">استخرج الصور المصغرة من رابط الفيديو أو أدخل رابط الصورة المصغرة يدويًا.</p>
              )}
              
              <Input
                value={videoData.thumbnail}
                onChange={(e) => setVideoData({ ...videoData, thumbnail: e.target.value })}
                placeholder="أدخل رابط الصورة المصغرة"
              />
            </div>
            
            <div>
              <label className="block mb-2">التصنيفات</label>
              <div className="flex mb-2">
                <Input
                  value={''}
                  onChange={(e) => setSelectedCategories([...selectedCategories, e.target.value])}
                  placeholder="أضف تصنيفًا جديدًا"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setSelectedCategories([...selectedCategories, e.target.value]);
                    }
                  }}
                />
                <Button onClick={() => setSelectedCategories([...selectedCategories, ''])} className="p-2">
                  <IconPlus />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category, index) => (
                  <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full">
                    {category}
                    <Button onClick={() => setSelectedCategories(selectedCategories.filter((cat, i) => i !== index))} className="p-1 ml-2">
                      <IconX />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setVideoData(videoStructure)} className="bg-gray-500">
                إعادة تعيين
              </Button>
              <Button onClick={handleSubmit}>
                إضافة الفيديو
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}