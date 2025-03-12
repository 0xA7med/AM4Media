import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import { useEffect } from 'react';
import { useVideos } from './videoStore';

function App() {
  const loadVideos = useVideos(state => state.loadVideos);
  
  useEffect(() => {
    console.log("تحميل الفيديوهات عند بدء التطبيق...");
    loadVideos();
  }, [loadVideos]);

  return (
      <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;