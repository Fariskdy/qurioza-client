import { useState, useEffect } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

export function VideoPlayer({ src, poster, options = {} }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("VideoPlayer mounted with src:", src);
    // Reset states when src changes
    setError(false);
    setIsLoading(true);
  }, [src]);

  const videoSource = {
    type: "video",
    sources: [
      {
        src,
        type: options.mimeType || "video/mp4",
      },
    ],
    poster,
  };

  const defaultOptions = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "settings",
      "pip",
      "fullscreen",
    ],
    settings: ["speed"],
    speed: {
      selected: 1,
      options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },
    keyboard: { focused: true, global: true },
    tooltips: { controls: true, seek: true },
    displayDuration: true,
    invertTime: true,
    clickToPlay: true,
    hideControls: true,
    resetOnEnd: false,
    disableContextMenu: true,
  };

  const handleError = (event) => {
    console.error("Video player error:", event);
    setError(true);
    setIsLoading(false);
  };

  const handleReady = (player) => {
    console.log("Video player ready");
    setIsLoading(false);
  };

  if (!src) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-white p-4 text-center">
        <p>No video source provided</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-white p-4 text-center">
        <p>Error loading video. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="plyr__video-embed relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <Plyr
        source={videoSource}
        options={{ ...defaultOptions, ...options }}
        onError={handleError}
        onReady={handleReady}
      />
    </div>
  );
}
