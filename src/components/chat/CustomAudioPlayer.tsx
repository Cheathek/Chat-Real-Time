import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
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
  }, []);

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressChange(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressChange(e);
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * duration;

    audio.currentTime = time;
    setProgress(percentage);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
        const percentage = (x / rect.width) * 100;
        const time = (percentage / 100) * duration;
        if (audioRef.current) {
          audioRef.current.currentTime = time;
          setProgress(percentage);
        }
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center w-full">
      <div
        className={cn(
          "flex flex-col w-full min-w-[300px] max-w-[350px] bg-[#2E3035] p-2 rounded-lg",
          className
        )}
      >
        {/* Title */}
        <div className="mb-2 px-1">
          <p className="text-sm font-medium text-[#DCDDDE] truncate">
            {title.replace(".m4a", "").replace(/_/g, " ")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {" "}
          {/* Increased gap from 2 to 3 */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current text-white" />
            ) : (
              <Play className="w-4 h-4 fill-current text-white" />
            )}
          </button>
          <div className="flex-1">
            <div
              ref={progressBarRef}
              className="group relative h-1.5 bg-[#5865F2] bg-opacity-20 rounded-full cursor-pointer transition-all hover:bg-opacity-30"
              onClick={handleProgressChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {/* Progress Track */}
              <div className="absolute inset-0 rounded-full bg-[#5865F2] bg-opacity-20" />

              <div
                className="absolute h-full bg-[#5865F2] rounded-full transition-all origin-left"
                style={{
                  width: `${Math.max(2, progress)}%`,
                  borderRadius: progress < 2 ? "9999px 0 0 9999px" : "9999px",
                }}
              />

              {/* Progress Handle */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-2/2 h-2.5 w-2.5 bg-white rounded-full transition-opacity shadow-sm",
                  isDragging
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-400">
                  {formatTime(duration * (progress / 100))}
                </span>
                <span className="text-gray-500 text-[10px]">
                  {Math.round(fileSize / 1024)} KB • Audio
                </span>
              </div>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>
          <audio ref={audioRef} src={src} preload="metadata" />
        </div>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
