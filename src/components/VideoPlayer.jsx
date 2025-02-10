import { useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

export function VideoPlayer({ src, poster, options = {} }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    settings: ["quality", "speed"],
    quality: {
      default: 1080,
      options: [1080, 720, 480, 360],
    },
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

  const videoSource = {
    type: "video",
    sources: [
      {
        src,
        type: "video/mp4",
      },
    ],
    poster,
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 text-white p-4 text-center">
        <p>Error loading video. Please try again later.</p>
      </div>
    );
  }

  return (
    <div
      className="plyr__video-embed relative"
      onContextMenu={(e) => e.preventDefault()}
    >
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
