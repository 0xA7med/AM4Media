import React from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

// تأكد من ضبط عنصر الجذر - هذا مهم جداً للتشغيل الصحيح
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root'); // استبدل هذا بمعرف العنصر الجذر الخاص بك إذا كان مختلفاً
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId }) => {
  // استخدام أنماط مخصصة مع التركيز على التوسيط
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000000,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      position: 'relative',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      background: 'transparent',
      padding: 0,
      width: '100%',
      maxWidth: '56rem', // عرض محدد بـ 4xl
      margin: '0 auto',
      overflow: 'visible'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Video Modal"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      closeTimeoutMS={300}
    >
      <div className="relative bg-black rounded-lg overflow-hidden w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          aria-label="إغلاق"
        >
          <X size={24} />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={videoId ? `https://drive.google.com/file/d/${videoId}/preview` : ''}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
            title="عرض الفيديو"
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;