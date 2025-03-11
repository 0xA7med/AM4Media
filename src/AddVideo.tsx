import { useState } from "react";


// مكونات بسيطة
const Input = ({ type, value, onChange, placeholder, className, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    {...props}
  />
);

const Button = ({ onClick, children, className, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const Label = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} {...props}>
    {children}
  </label>
);
const RadioGroup = ({ value, onValueChange, children, className, ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
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

const Textarea = ({ value, onChange, placeholder, className, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    {...props}
  />
);

const SECRET_PASSWORD = "353567"; // كلمة المرور

export default function AddVideo() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("square");
  const [videoUrl, setVideoUrl] = useState("");

  const handleLogin = () => {
    if (password === SECRET_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  const handleAddVideo = () => {
    if (videoUrl.trim() === "") {
      alert("يرجى إدخال رابط الفيديو");
      return;
    }
    
    if (videoName.trim() === "") {
      alert("يرجى إدخال اسم الفيديو");
      return;
    }
    
    if (videoThumbnail.trim() === "") {
      alert("يرجى إدخال رابط الصورة المصغرة");
      return;
    }
    
    const newVideo = {
      name: videoName,
      description: videoDescription,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio,
      url: videoUrl
    };
    
    console.log("تمت إضافة الفيديو:", newVideo);
    alert(`تمت إضافة الفيديو: ${videoName}`);
    
    // إعادة تعيين الحقول
    setVideoName("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardContent>
          {!authenticated ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">أدخل كلمة المرور</h2>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className="w-full" onClick={handleLogin}>
                دخول
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">إضافة فيديو جديد</h2>
              
              <div className="space-y-2">
                <Label htmlFor="videoName">اسم الفيديو</Label>
                <Input
                  id="videoName"
                  type="text"
                  placeholder="أدخل اسم الفيديو"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoDescription">وصف الفيديو</Label>
                <Textarea
                  id="videoDescription"
                  placeholder="أدخل وصف الفيديو"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoThumbnail">رابط الصورة المصغرة</Label>
                <Input
                  id="videoThumbnail"
                  type="text"
                  placeholder="أدخل رابط الصورة المصغرة"
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>أبعاد الفيديو</Label>
                <RadioGroup 
                  value={videoAspectRatio} 
                  onValueChange={setVideoAspectRatio}
                  className="flex space-x-4 rtl:space-x-reverse"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="square" id="square" />
                    <Label htmlFor="square">مربع</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="portrait" id="portrait" />
                    <Label htmlFor="portrait">طولي</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">رابط الفيديو (جوجل درايف)</Label>
                <Input
                  id="videoUrl"
                  type="text"
                  placeholder="أدخل رابط الفيديو من جوجل درايف"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <Button className="w-full" onClick={handleAddVideo}>
                إضافة الفيديو
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}