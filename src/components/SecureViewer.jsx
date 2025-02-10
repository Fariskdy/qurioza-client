import { useState, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { PDFViewer } from "./PDFViewer";
import { Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import "./VideoPlayer.css"; // Import the custom styles

export function SecureViewer({ contentId, type, moduleId, courseId }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get secure content URL with temporary token
  const getSecureContent = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/courses/${courseId}/modules/${moduleId}/content/${contentId}/secure-view`
      );
      setContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSecureContent();
  }, [contentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Failed to load content: {error}</div>
    );
  }

  if (!content) return null;

  return (
    <div className="relative w-full">
      {type === "video" && content && (
        <div className="relative w-full aspect-video bg-black">
          <div className="absolute inset-0">
            <VideoPlayer
              src={content.url}
              fallbackSrc={content.fallbackUrl}
              poster={content.thumbnail}
              options={{
                controls: true,
                autoplay: false,
                hideControls: false,
              }}
            />
          </div>
        </div>
      )}
      {type === "document" && content && (
        <div className="max-h-[80vh] overflow-auto">
          <PDFViewer url={content.url} />
        </div>
      )}
    </div>
  );
}
