import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

// Dùng "export default function"
// Đây là code đã fix của bạn
export default function CameraModal({ isOpen, onClose }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      alert('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera và thử lại.');
      onClose(); // Đóng modal nếu có lỗi
    }
  }, [onClose]);

  const stopStream = useCallback(() => {
    // Thêm kiểm tra 'stream' để tránh lỗi
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      stopStream();
      
      // Giả lập OCR
      alert('Đã quét đơn thuốc!\n\nPhát hiện:\n• Paracetamol 500mg\n• Vitamin C 1000mg\n\nLưu ý: Chức năng OCR đang phát triển.');
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    onClose();
  };

  const resetCapture = () => {
    setCapturedImage(null);
    openCamera(); // Mở lại camera
  };

  useEffect(() => {
    if (isOpen) {
      openCamera();
    } else {
      stopStream();
    }
    
    // Cleanup khi component unmount
    return () => {
      stopStream();
    };
  }, [isOpen, openCamera, stopStream]); // Dependencies đã chính xác

  if (!isOpen) return null;

  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 text-white">
          <h3 className="text-lg font-semibold">Ảnh đã chụp</h3>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <img src={capturedImage} alt="Captured" className="max-w-full max-h-full rounded-lg" />
        </div>
        
        <div className="p-6 flex gap-4">
          <button
            onClick={resetCapture}
            className="w-full py-4 bg-gray-600 text-white rounded-2xl font-bold"
          >
            Chụp lại
          </button>
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <h3 className="text-lg font-semibold">Quét đơn thuốc</h3>
        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full" />
      </div>
      
      <div className="p-6 flex justify-center">
        <button
          onClick={capturePhoto}
          className="w-20 h-20 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
        />
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
