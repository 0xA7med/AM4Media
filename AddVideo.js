import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SECRET_PASSWORD = "353567"; // قم بتغيير كلمة المرور هنا

export default function AddVideo() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("square");
  const [videos, setVideos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

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

    const newVideo = {
      name: videoName,
      description: videoDescription,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio,
      url: videoUrl
    };

    if (editingIndex !== null) {
      const updatedVideos = [...videos];
      updatedVideos[editingIndex] = newVideo;
      setVideos(updatedVideos);
      setEditingIndex(null);
    } else {
      setVideos([...videos, newVideo]);
    }

    alert(`تمت ${editingIndex !== null ? 'تعديل' : 'إضافة'} الفيديو: ${videoName}`);
    setVideoUrl("");
    setVideoName("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
  };

  const handleDeleteVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    alert("تم حذف الفيديو بنجاح");
  };

  const handleEditVideo = (index) => {
    const video = videos[index];
    setVideoName(video.name);
    setVideoDescription(video.description);
    setVideoThumbnail(video.thumbnail);
    setVideoAspectRatio(video.aspectRatio);
    setVideoUrl(video.url);
    setEditingIndex(index);
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
              <Input
                type="text"
                placeholder="اسم الفيديو"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="وصف الفيديو"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
              <Input
                type="text"
                placeholder="رابط الصورة المصغرة"
                value={videoThumbnail}
                onChange={(e) => setVideoThumbnail(e.target.value)}
              />
              <select
                value={videoAspectRatio}
                onChange={(e) => setVideoAspectRatio(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="square">مربع</option>
                <option value="portrait">طولى</option>
              </select>
              <Input
                type="text"
                placeholder="رابط الفيديو من جوجل درايف"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button className="w-full" onClick={handleAddVideo}>
                {editingIndex !== null ? 'تعديل الفيديو' : 'إضافة الفيديو'}
              </Button>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">قائمة الفيديوهات</h2>
                {videos.map((video, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h3 className="font-semibold">{video.name}</h3>
                    <p>{video.description}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={() => handleEditVideo(index)}>
                        تعديل
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteVideo(index)}>
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
