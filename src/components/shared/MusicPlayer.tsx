import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
    { id: 1, url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', title: 'Lofi Chill' },
    { id: 2, url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6582570b77.mp3', title: 'Deep Focus' },
    { id: 3, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2456574f26.mp3', title: 'Ambient Lounge' }
];

export const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2; // Keep it ambient
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    
    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
        setIsPlaying(true);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="hidden md:flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-3 py-1.5 h-9">
            <audio 
                ref={audioRef} 
                src={TRACKS[currentTrack].url} 
                onEnded={nextTrack}
            />
            
            <button 
                onClick={togglePlay}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-900 text-white hover:bg-black transition-colors"
            >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
            </button>
            
            <div className="flex flex-col w-20 overflow-hidden">
                <span className="text-[10px] font-bold text-brand-900 truncate leading-none">Ambient</span>
                <span className="text-[8px] text-brand-500 truncate leading-none mt-0.5">{TRACKS[currentTrack].title}</span>
            </div>

            <div className="flex items-center gap-1 border-l border-brand-200 pl-2">
                 <button onClick={nextTrack} className="text-brand-400 hover:text-brand-900">
                    <SkipForward className="w-3 h-3" />
                 </button>
                 <button onClick={toggleMute} className="text-brand-400 hover:text-brand-900">
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                 </button>
            </div>
        </div>
    );
};