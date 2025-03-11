import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import { useVideos } from './videoStore';

function App() {
  const { loadVideos } = useVideos();

  // Load videos from localStorage when the app starts
  React.useEffect(() => {
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