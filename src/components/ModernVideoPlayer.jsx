import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Loader2,
  Subtitles,
  MonitorPlay,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModernVideoPlayer({
  src,
  poster,
  title,
  onReady,
  onError,
  onEnded,
  className,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setControlsVisible(true);
      setLastActivity(Date.now());

      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      if (playing) {
        controlsTimeout.current = setTimeout(() => {
          if (Date.now() - lastActivity > 2000) {
            setControlsVisible(false);
          }
        }, 2000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleActivity);
      container.addEventListener("mousedown", handleActivity);
      container.addEventListener("touchstart", handleActivity);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleActivity);
        container.removeEventListener("mousedown", handleActivity);
        container.removeEventListener("touchstart", handleActivity);
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [playing, lastActivity]);

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  const handleSeekChange = (value) => {
    setPlayed(value[0]);
    playerRef.current?.seekTo(value[0]);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  const skipSeconds = (seconds) => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds);
  };

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="group relative h-full w-full bg-black overflow-hidden cursor-pointer"
      >
        <ReactPlayer
          ref={playerRef}
          url={src}
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onReady={onReady}
          onError={onError}
          onEnded={onEnded}
          onProgress={handleProgress}
          onDuration={setDuration}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          progressInterval={100}
          className="react-player"
        />

        {/* Click area for play/pause - covers only the video area */}
        <div className="absolute inset-0 z-20" onClick={handlePlayPause} />

        {/* Center Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-300 z-30",
            "hover:scale-110 transform",
            playing && !controlsVisible ? "opacity-0" : "opacity-100",
            "group-hover:opacity-100"
          )}
        >
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
            {playing ? (
              <Pause className="w-12 h-12 text-white fill-white" />
            ) : (
              <Play className="w-12 h-12 text-white fill-white translate-x-0.5" />
            )}
          </div>
        </button>

        {/* Loading Overlay */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
            <Loader2 className="w-12 h-12 animate-spin text-white/90" />
          </div>
        )}

        {/* Video Controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent",
            "transition-opacity duration-300",
            controlsVisible ? "opacity-100" : "opacity-0",
            "z-30 pb-2"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="px-4">
            <div
              className="relative group/progress"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-3 left-0 right-0 h-8 bg-transparent" />
              <div className="relative h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[#A435F0] rounded-full"
                  style={{ width: `${played * 100}%` }}
                />
                <div
                  className="absolute left-0 top-0 h-full bg-white/20 rounded-full"
                  style={{ width: `${loaded * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step={0.000001}
                  value={played}
                  onChange={(e) =>
                    handleSeekChange([parseFloat(e.target.value)])
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div
            className={cn(
              "px-2 sm:px-4 mt-1 sm:mt-2 flex items-center gap-2 sm:gap-4",
              "text-sm sm:text-base"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Controls - More compact for mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="hover:bg-white/10 rounded-sm p-1 sm:p-1.5 transition-colors"
              >
                {playing ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                )}
              </button>

              {/* Skip Buttons - Hide on mobile */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => skipSeconds(-10)}
                  className="hover:bg-white/10 rounded-sm p-1.5 transition-colors"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => skipSeconds(10)}
                  className="hover:bg-white/10 rounded-sm p-1.5 transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Time - Smaller on mobile */}
              <div className="text-white text-xs sm:text-sm font-medium ml-1 sm:ml-2 tabular-nums">
                {formatTime(duration * played)} / {formatTime(duration)}
              </div>

              {/* Volume - Hide slider on mobile */}
              <div className="flex items-center group/volume ml-1 sm:ml-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:bg-white/10 rounded-sm p-1 sm:p-1.5 transition-colors"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>
                <div className="hidden sm:block w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="ml-2 volume-slider"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1" />

            {/* Right Controls - Simplified for mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Playback Speed - Simplified on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white text-xs sm:text-sm hover:bg-white/10 rounded-sm px-2 sm:px-3 py-1 sm:py-1.5 transition-colors">
                    {playbackRate}x
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-neutral-900/95 border-neutral-800"
                >
                  <DropdownMenuLabel className="text-white">
                    Playback Speed
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-neutral-800" />
                  {playbackRates.map((rate) => (
                    <DropdownMenuItem
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={cn(
                        "text-white hover:bg-white/10",
                        playbackRate === rate && "text-primary"
                      )}
                    >
                      {rate}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Subtitles and Quality - Hide on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="hover:bg-white/10 rounded-sm p-1.5 transition-colors">
                  <Subtitles className="w-5 h-5 text-white" />
                </button>
                <button className="hover:bg-white/10 rounded-sm p-1.5 transition-colors">
                  <MonitorPlay className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hover:bg-white/10 rounded-sm p-1 sm:p-1.5 transition-colors"
              >
                {fullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
