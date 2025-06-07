import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomVideoPlayerProps {
  src: string;
  className?: string;
  title: string;
  fileSize: number;
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

const CustomVideoPlayer = ({
  src,
  className,
  title,
  aspectRatio = "16/9",
}: CustomVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Aspect ratio classes
  const aspectRatioClasses = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (isPreviewMode) setIsPreviewMode(false);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Show controls when entering fullscreen
      if (!!document.fullscreenElement) {
        setShowControls(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [volume, isPreviewMode]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode && !isPlaying) {
      togglePlay();
    }
    setShowControls(true);
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsPreviewMode(true);
    } else {
      document.exitFullscreen();
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPreviewMode) return;
    
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * duration;

    video.currentTime = time;
    setProgress(percentage);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        videoRef.current.volume = volume || 1;
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSettings(false);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    resetControlsTimeout();
  };

  const handleMouseLeave = () => {
    if (isPlaying && isPreviewMode && !isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleMouseMove = () => {
    if (isPreviewMode) {
      setShowControls(true);
      resetControlsTimeout();
    }
  };

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative group w-full bg-black rounded-lg overflow-hidden",
        aspectRatioClasses[aspectRatio],
        isFullscreen ? "fixed inset-0 z-50 w-screen h-screen" : "max-w-[800px]",
        isPreviewMode ? "cursor-default" : "cursor-pointer",
        className
      )}
      onClick={!isPreviewMode ? togglePreviewMode : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
      />

      {/* Minimal view (duration only) */}
      {!isPreviewMode && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatTime(duration)}
        </div>
      )}

      {/* Preview mode controls */}
      {isPreviewMode && showControls && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-3">
          {/* Progress bar */}
          <div
            ref={progressBarRef}
            className="relative h-1.5 bg-white/30 rounded-full cursor-pointer mb-3"
            onClick={handleProgressChange}
          >
            <div
              className="absolute h-full bg-[#5865F2] rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 transition-opacity",
                "group-hover:opacity-100"
              )}
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-[#5865F2] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="fill-current w-5 h-5" />
                ) : (
                  <Play className="fill-current w-5 h-5" />
                )}
              </button>

              <div className="text-white text-sm">
                {formatTime(duration * (progress / 100))} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Volume control - only in fullscreen */}
              {isFullscreen && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-[#5865F2] transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-[#5865F2]"
                  />
                </div>
              )}

              {/* Settings dropdown - only in fullscreen */}
              {isFullscreen && (
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-[#5865F2] transition-colors text-sm font-medium px-2 py-1 bg-black/30 rounded"
                  >
                    {playbackRate}x
                  </button>
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-[#2E3035] rounded-md shadow-lg z-10 border border-[#40444B]">
                      {[0.5, 1, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={cn(
                            "block w-full px-4 py-2 text-sm text-white hover:bg-[#5865F2] text-left",
                            playbackRate === rate && "bg-[#5865F2]"
                          )}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Download button - only in fullscreen */}
              {isFullscreen && (
                <button
                  onClick={handleDownload}
                  className="text-white hover:text-[#5865F2] transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#5865F2] transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;