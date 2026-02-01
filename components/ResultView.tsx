import React, { useState } from 'react';
import { Download, RefreshCw, User, Lock, FolderDown, CalendarCheck, MapPin, Maximize2, X, ImagePlus } from 'lucide-react';
import { GeneratedImages } from '../types';
import JSZip from 'jszip';
import { Button } from './Button';

interface ResultViewProps {
  originalImage: string;
  resultImages: GeneratedImages;
  isLoading: boolean;
  isUnlocking?: boolean;
  unlockedAngles: boolean;
  onUnlock: () => void;
  currentStyleName?: string;
  onBookNow: () => void;
  onSetAvatar?: (url: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  originalImage, 
  resultImages, 
  isLoading,
  isUnlocking,
  unlockedAngles,
  onUnlock,
  currentStyleName = "Modern Style",
  onBookNow,
  onSetAvatar
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const images = [
        { name: 'front-view.png', data: resultImages.front },
        { name: 'left-view.png', data: resultImages.left },
        { name: 'right-view.png', data: resultImages.right },
        { name: 'back-view.png', data: resultImages.back },
    ];

    let hasImages = false;
    images.forEach(img => {
        if (img.data) {
            hasImages = true;
            const data = img.data.split(',')[1];
            zip.file(img.name, data, { base64: true });
        }
    });

    if (hasImages) {
        const content = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prelook-studio-collection.zip';
        a.click();
        window.URL.revokeObjectURL(url);
    }
  };

  const ViewCard = ({ 
    title, 
    image, 
    isLoading, 
    isOriginal = false, 
    isLocked = false,
    onUnlock 
  }: { 
    title: string, 
    image: string | null, 
    isLoading: boolean, 
    isOriginal?: boolean,
    isLocked?: boolean,
    onUnlock?: () => void
  }) => (
    <div className={`relative group rounded-3xl overflow-hidden aspect-[3/4] transition-all duration-500 
        ${isOriginal ? 'shadow-xl ring-4 ring-white' : 'bg-brand-100 shadow-sm'}
        ${isLocked ? 'cursor-pointer hover:ring-2 hover:ring-brand-300' : ''}
    `}
    onClick={() => {
        if (isLocked) {
            onUnlock?.();
        } else if (image) {
            setZoomedImage(image);
        }
    }}
    >
        {isLoading && !isOriginal ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-brand-50/80 backdrop-blur-sm z-10">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Rendering</span>
            </div>
        ) : null}
        
        {image ? (
            <img 
                src={image} 
                alt={title} 
                className={`w-full h-full object-cover transition-transform duration-700 ${!isOriginal && !isLocked ? 'group-hover:scale-110' : ''} ${isLocked ? 'blur-md scale-105 opacity-60' : ''}`} 
            />
        ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-300 bg-brand-50">
                <User className="w-10 h-10 mb-3 opacity-20" />
            </div>
        )}

        {/* Lock Overlay */}
        {isLocked && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/10 transition-colors hover:bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-2">
                    <Lock className="w-5 h-5 text-brand-800" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-900 bg-white/90 px-3 py-1 rounded-full">Unlock View</span>
            </div>
        )}

        {/* Hover Actions */}
        {!isLocked && image && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-900 flex items-center justify-center backdrop-blur-md transition-colors">
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>
        )}

        <div className="absolute bottom-4 left-4 text-white z-10 pointer-events-none">
            <span className="text-xs font-medium tracking-wide opacity-90 drop-shadow-md">{title}</span>
        </div>
    </div>
  );

  const hasGeneratedImages = !!resultImages.front;

  return (
    <>
        <div className="h-full w-full overflow-y-auto p-4 pb-48 md:pb-64 md:p-8 bento-scroll">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-serif text-brand-800">Your Transformation</h2>
                        <p className="text-brand-500 text-sm mt-1">
                            {unlockedAngles 
                                ? "Complete 360° Studio View generated." 
                                : "Preview generated. Unlock full angles for a complete assessment."}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        {!unlockedAngles && hasGeneratedImages && (
                            <Button 
                                onClick={onUnlock} 
                                disabled={isUnlocking}
                                variant="accent"
                                className="bg-brand-800 text-white"
                            >
                            {isUnlocking ? 'Unlocking...' : 'Unlock 360° View (2 Credits)'} 
                            </Button>
                        )}
                        
                        {unlockedAngles && hasGeneratedImages && (
                            <button 
                                onClick={handleDownloadAll}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-200 transition-colors"
                            >
                                <FolderDown className="w-4 h-4" />
                                Download All
                            </button>
                        )}
                    </div>
                </div>

                {/* Smart Conversion Nudge */}
                {hasGeneratedImages && (
                    <div className="mb-8 bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-6 h-6 text-brand-200" />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg mb-1">Make this {currentStyleName} a reality</h3>
                                <p className="text-sm text-brand-200 opacity-90">
                                    <span className="font-bold text-white">Top Stylists</span> in Bhubaneswar can create this look for you.
                                </p>
                            </div>
                        </div>
                        <Button onClick={onBookNow} className="bg-white text-brand-900 hover:bg-brand-50 border-none min-w-[140px]">
                            Book Appointment
                        </Button>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                    {/* Main Original Image */}
                    <ViewCard 
                        title="Original" 
                        image={originalImage} 
                        isLoading={false} 
                        isOriginal={true}
                    />

                    {/* Generated Views */}
                    <ViewCard 
                        title="Front Style" 
                        image={resultImages.front} 
                        isLoading={isLoading} 
                    />
                    <ViewCard 
                        title="Left Profile" 
                        image={resultImages.left} 
                        isLoading={isUnlocking} 
                        isLocked={!unlockedAngles}
                        onUnlock={onUnlock}
                    />
                    <ViewCard 
                        title="Right Profile" 
                        image={resultImages.right} 
                        isLoading={isUnlocking} 
                        isLocked={!unlockedAngles}
                        onUnlock={onUnlock}
                    />
                    <ViewCard 
                        title="Back View" 
                        image={resultImages.back} 
                        isLoading={isUnlocking} 
                        isLocked={!unlockedAngles}
                        onUnlock={onUnlock}
                    />
                </div>
            </div>
        </div>

        {/* Zoom Modal */}
        {zoomedImage && (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomedImage(null)}>
                <button 
                    onClick={() => setZoomedImage(null)}
                    className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <img src={zoomedImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    
                    <div className="mt-6 flex gap-4">
                         <a 
                            href={zoomedImage} 
                            download={`prelook-studio-zoom.png`}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-brand-900 rounded-full font-bold uppercase tracking-widest hover:bg-brand-100 transition-colors"
                        >
                            <Download className="w-5 h-5" /> Download
                        </a>
                        {onSetAvatar && (
                            <button
                                onClick={() => {
                                    onSetAvatar(zoomedImage);
                                    setZoomedImage(null);
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-800 text-white rounded-full font-bold uppercase tracking-widest hover:bg-brand-700 transition-colors border border-white/10"
                            >
                                <ImagePlus className="w-5 h-5" /> Set as Profile Pic
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>
  );
};