import React from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

Modal.setAppElement('#root');

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black/75 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X size={24} />
        </button>
        <div className="aspect-video w-full">
          <iframe
            src={`https://drive.google.com/file/d/${videoId}/preview`}
            width="100%"
            height="100%"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;