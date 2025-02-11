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
        className={cn(
          "group relative aspect-video bg-black overflow-hidden cursor-pointer",
          className
        )}
        onClick={handlePlayPause}
      >
        <ReactPlayer
          ref={playerRef}
          url={src}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onReady={onReady}
          onError={onError}
          onProgress={handleProgress}
          onDuration={setDuration}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          progressInterval={100}
          className="react-player"
        />

        {/* Loading Overlay */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <Loader2 className="w-12 h-12 animate-spin text-white/90" />
          </div>
        )}

        {/* Center Play/Pause Button */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10",
            "transition-opacity duration-300",
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
        </div>

        {/* Video Controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent",
            "transition-opacity duration-300",
            controlsVisible ? "opacity-100" : "opacity-0",
            "z-20 pb-2"
          )}
        >
          {/* Progress Bar */}
          <div className="px-4">
            <div className="relative group/progress">
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
          <div className="px-4 mt-2 flex items-center gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="hover:bg-white/10 rounded-sm p-1.5 transition-colors"
              >
                {playing ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white" />
                )}
              </button>

              {/* Skip Buttons */}
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

              {/* Time */}
              <div className="text-white text-sm font-medium ml-2 tabular-nums">
                {formatTime(duration * played)} / {formatTime(duration)}
              </div>

              {/* Volume */}
              <div className="flex items-center group/volume ml-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:bg-white/10 rounded-sm p-1.5 transition-colors"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
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

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white text-sm hover:bg-white/10 rounded-sm px-3 py-1.5 transition-colors">
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

              {/* Subtitles */}
              <button className="hover:bg-white/10 rounded-sm p-1.5 transition-colors">
                <Subtitles className="w-5 h-5 text-white" />
              </button>

              {/* Quality */}
              <button className="hover:bg-white/10 rounded-sm p-1.5 transition-colors">
                <MonitorPlay className="w-5 h-5 text-white" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hover:bg-white/10 rounded-sm p-1.5 transition-colors"
              >
                {fullscreen ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Maximize className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
