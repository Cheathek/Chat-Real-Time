import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomAudioPlayerProps {
  src: string;
  className?: string;
  title: string;
  fileSize: number;
}

const CustomAudioPlayer = ({
  src,
  className,
  title,
  fileSize,
}: CustomAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Audio control functions
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        // Remember previous volume when unmuting
        setVolume(0);
      } else {
        setVolume(0.7);
      }
    }
  };

  // Progress handling
  const handleProgressInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * duration;

    audioRef.current.currentTime = time;
    setProgress(percentage);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isDragging) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      audio.volume = volume;
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isDragging, volume]);

  // Global mouse events for dragging
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className={cn(
      "w-full max-w-[400px] bg-[#2E3035] rounded-xl p-3 shadow-lg",
      className
    )}>
      {/* Header with title and file info */}
      <div className="flex justify-between items-start mb-3">
        <div className="max-w-[80%]">
          <h3 className="text-sm font-medium text-[#F2F3F5] truncate">
            {title.replace(/\.[^/.]+$/, "")} {/* Remove file extension */}
          </h3>
          <p className="text-xs text-[#B5BAC1] mt-0.5">
            <File className="inline w-4 h-4 mr-1 text-primary" />
            {Math.round(fileSize / 1024)} KB • Audio
          </p>
        </div>
        <button
          onClick={toggleMute}
          className="text-[#B5BAC1] hover:text-[#F2F3F5] transition-colors p-1"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div
          ref={progressBarRef}
          className="relative h-1.5 bg-[#383A40] rounded-full cursor-pointer group"
          onClick={handleProgressInteraction}
          onMouseDown={() => setIsDragging(true)}
        >
          <div
            className="absolute h-full bg-[#5865F2] rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 transition-opacity",
              isDragging ? "opacity-100" : "group-hover:opacity-100"
            )}
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>

      {/* Controls and time display */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#B5BAC1]">
          {formatTime(duration * (progress / 100))}
        </span>
        
        <button
          onClick={togglePlay}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full transition-all",
            isPlaying ? "bg-[#5865F2] hover:bg-[#4752C4]" : "bg-[#383A40] hover:bg-[#40444B]"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-white" />
          ) : (
            <Play className="w-4 h-4 fill-current text-white ml-0.5" />
          )}
        </button>
        
        <span className="text-xs text-[#B5BAC1]">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume control (optional) */}
      <div className="mt-3 flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-[#B5BAC1]" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume;
              audioRef.current.muted = newVolume === 0;
              setIsMuted(newVolume === 0);
            }
          }}
          className="flex-1 h-1 bg-[#383A40] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default CustomAudioPlayer;