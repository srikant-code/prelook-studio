import React, { useRef, useState } from 'react';
import { Upload, Camera, X, Check } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
      setIsCameraOpen(true);
      // Wait for state update to mount video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        stopCamera();
        onImageSelect(dataUrl);
      }
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  if (isCameraOpen) {
    return (
      <div className="w-full h-96 bg-black relative rounded-none overflow-hidden flex flex-col">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover" 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 items-center z-10">
          <button 
            onClick={stopCamera}
            className="p-4 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={capturePhoto}
            className="p-1 rounded-full border-4 border-white transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
          
          <div className="w-14"></div> {/* Spacer for balance */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
        {/* Upload Option */}
        <div 
            onClick={triggerUpload}
            className="group cursor-pointer border border-brand-200 bg-brand-50 hover:bg-white transition-all flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="bg-white p-4 rounded-full mb-4 border border-brand-100 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg uppercase tracking-wider mb-2">Upload Photo</h3>
            <p className="text-xs text-brand-500 uppercase tracking-widest">From Device</p>
        </div>

        {/* Camera Option */}
        <div 
            onClick={startCamera}
            className="group cursor-pointer border border-brand-200 bg-brand-900 text-white hover:bg-black transition-all flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="bg-white/10 p-4 rounded-full mb-4 border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg uppercase tracking-wider mb-2">Use Camera</h3>
            <p className="text-xs text-brand-400 uppercase tracking-widest">Take Selfie</p>
        </div>
      </div>
    </div>
  );
};