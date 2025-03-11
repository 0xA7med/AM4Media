import React, { useState, useEffect } from 'react';
import { useVideos, addVideo, updateVideo, deleteVideo, Video } from './videoStore';

// استيراد الأيقونات
// يمكنك إزالة هذا السطر إذا كانت مكتبة lucide-react غير متوفرة
// import { Copy, Check, Eye, X, Plus, Trash, Edit2, ArrowLeft } from 'lucide-react';

// دالة لاستخراج معرف الفيديو من رابط جوجل درايف
function extractGoogleDriveId(url) {
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
}

const SECRET_PASSWORD = "353567"; // كلمة المرور

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
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("square");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategories, setVideoCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoList, setShowVideoList] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const videos = useVideos();

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
// باقي الكود...

  // باقي الكود يبقى كما هو...
  const handleExtractThumbnails = () => {
    if (!videoUrl.trim()) {
      alert("يرجى إدخال رابط الفيديو أولاً");
      return;
    }
    
    const videoId = extractGoogleDriveId(videoUrl);
    if (!videoId) {
      alert("لم يتم العثور على معرف الفيديو في الرابط");
      return;
    }
    
    setIsLoadingThumbnails(true);
    const options = extractThumbnailsFromVideo(videoId);
    setThumbnailOptions(options);
    setIsLoadingThumbnails(false);
    
    if (options.length > 0) {
      setVideoThumbnail(options[0]);
      setThumbnailPreview(options[0]);
    }
  };

  const handleCopyCode = () => {
    const videoData = editingVideo || {
      id: Date.now().toString(),
      title: videoTitle,
      description: videoDescription,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio,
      url: videoUrl,
      categories: [...videoCategories]
    };
    
    const codeString = JSON.stringify(videoData, null, 2);
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !videoCategories.includes(newCategory.trim())) {
      setVideoCategories([...videoCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setVideoCategories(videoCategories.filter(cat => cat !== category));
  };

    const handleSaveVideo = () => {
    if (!videoTitle.trim() || !videoUrl.trim() || !videoThumbnail.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    const newVideo: Video = {
      id: editingVideo ? editingVideo.id : Date.now().toString(),
      title: videoTitle,
      description: videoDescription,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio,
      url: videoUrl,
      categories: [...videoCategories]
    };
    
    if (editingVideo) {
      // تحديث فيديو موجود
      updateVideo(newVideo);
    } else {
      // إضافة فيديو جديد
      addVideo(newVideo);
    }
    
    // إعادة تعيين النموذج
    resetForm();
    setShowVideoList(true);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDescription(video.description || "");
    setVideoThumbnail(video.thumbnail);
    setVideoAspectRatio(video.aspectRatio || "square");
    setVideoUrl(video.url);
    setVideoCategories(video.categories || []);
    setThumbnailPreview(video.thumbnail);
    setShowVideoList(false);
  };

  
  const handleDeleteVideo = (videoId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      deleteVideo(videoId);
    }
  };

  const resetForm = () => {
    setVideoTitle("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
    setVideoCategories([]);
    setNewCategory("");
    setEditingVideo(null);
    setThumbnailPreview("");
    setThumbnailOptions([]);
  };

  const handleAuthenticate = () => {
    if (password === SECRET_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  };


  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2">كلمة المرور</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                />
              </div>
              <Button onClick={handleAuthenticate} className="w-full">
                دخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {showVideoList ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">قائمة الفيديوهات</h1>
            <Button onClick={() => setShowVideoList(false)}>إضافة فيديو جديد</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className={`w-full ${video.aspectRatio === "square" ? "aspect-square" : "aspect-video"} object-cover`}
                  />
                </div>
                <CardContent>
                  <h2 className="text-xl font-bold mb-2">{video.title}</h2>
                  {video.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{video.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.categories?.map(category => (
                      <span key={category} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => handleEditVideo(video)} className="p-1 mr-2">
                      <IconEdit />
                    </Button>
                    <Button onClick={() => handleDeleteVideo(video.id)} className="p-1 bg-red-600">
                      <IconTrash />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {videos.length === 0 && (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-xl">لا توجد فيديوهات. أضف فيديو جديد للبدء.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Button onClick={() => setShowVideoList(true)} className="mb-4">
            <IconArrowLeft /> العودة إلى القائمة
          </Button>
          
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold mb-6">
                {editingVideo ? "تعديل الفيديو" : "إضافة فيديو جديد"}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="videoTitle" className="block mb-2">عنوان الفيديو</label>
                  <Input
                    id="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="أدخل عنوان الفيديو"
                  />
                </div>
                
                <div>
                  <label htmlFor="videoDescription" className="block mb-2">وصف الفيديو (اختياري)</label>
                  <textarea
                    id="videoDescription"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
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
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="أدخل رابط الفيديو من جوجل درايف"
                      className="flex-1"
                    />
                    <Button onClick={handleExtractThumbnails} className="mr-2">
                      استخراج الصور المصغرة
                    </Button>
                    <Button onClick={handleCopyCode} className="p-1 mr-2">
                      {copiedCode ? <IconCheck /> : <IconCopy />}
                    </Button>
                    <Button onClick={() => window.open(videoUrl, '_blank')} className="p-1">
                      <IconEye />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2">نسبة العرض إلى الارتفاع</label>
                  <RadioGroup
                    value={videoAspectRatio}
                    onValueChange={setVideoAspectRatio}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem
                        value="square"
                        id="square"
                        name="aspectRatio"
                        checked={videoAspectRatio === "square"}
                        onChange={() => setVideoAspectRatio("square")}
                      />
                      <label htmlFor="square" className="mr-2">مربع (1:1)</label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem
                        value="video"
                        id="video"
                        name="aspectRatio"
                        checked={videoAspectRatio === "video"}
                        onChange={() => setVideoAspectRatio("video")}
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
                          className={`cursor-pointer border-2 rounded-md overflow-hidden ${videoThumbnail === thumbnail ? 'border-blue-500' : 'border-transparent'}`}
                          onClick={() => {
                            setVideoThumbnail(thumbnail);
                            setThumbnailPreview(thumbnail);
                          }}
                        >
                          <img 
                            src={thumbnail} 
                            alt={`صورة مصغرة ${index + 1}`} 
                            className={`w-full ${videoAspectRatio === "square" ? "aspect-square" : "aspect-video"} object-cover`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-4">استخرج الصور المصغرة من رابط الفيديو أو أدخل رابط الصورة المصغرة يدويًا.</p>
                  )}
                  
                  <Input
                    value={videoThumbnail}
                    onChange={(e) => {
                      setVideoThumbnail(e.target.value);
                      setThumbnailPreview(e.target.value);
                    }}
                    placeholder="أدخل رابط الصورة المصغرة"
                  />
                  
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <p className="mb-2">معاينة الصورة المصغرة:</p>
                      <div className="border rounded-md overflow-hidden">
                        <img 
                          src={thumbnailPreview} 
                          alt="معاينة الصورة المصغرة" 
                          className={`w-full ${videoAspectRatio === "square" ? "aspect-square" : "aspect-video"} object-cover`}
                          onError={() => setThumbnailPreview("")}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2">التصنيفات</label>
                  <div className="flex mb-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="أضف تصنيفًا جديدًا"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <Button onClick={handleAddCategory} className="p-2">
                      <IconPlus />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {videoCategories.map(category => (
                      <div key={category} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full">
                        {category}
                        <Button onClick={() => handleRemoveCategory(category)} className="p-1 ml-2">
                          <IconX />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button onClick={resetForm} className="bg-gray-500">
                    إعادة تعيين
                  </Button>
                  <Button onClick={handleSaveVideo}>
                    {editingVideo ? "تحديث الفيديو" : "إضافة الفيديو"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}