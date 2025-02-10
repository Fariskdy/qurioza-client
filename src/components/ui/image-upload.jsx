import { useState, useEffect } from "react";
import { Button } from "./button";
import { ImageIcon, X } from "lucide-react";

export const ImageUploadPreview = ({
  value,
  onChange,
  className,
  currentImage,
}) => {
  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    if (!value && !currentImage) {
      setPreview(null);
    } else if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage, value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onChange(null);
    setPreview(null);
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative rounded-full overflow-hidden border-2 border-violet-500/20 dark:border-violet-500/30">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full border border-white/20"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="h-full w-full rounded-full border-2 border-dashed border-violet-500/20 dark:border-violet-500/30 hover:border-violet-500/40 dark:hover:border-violet-500/50 transition-colors flex flex-col items-center justify-center gap-2 bg-violet-50/50 dark:bg-violet-500/5">
            <ImageIcon className="h-8 w-8 text-violet-500/70 dark:text-violet-400/70" />
            <div className="text-xs font-medium text-violet-600/70 dark:text-violet-400/70">
              Upload
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
