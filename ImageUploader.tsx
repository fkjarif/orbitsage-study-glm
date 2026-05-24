import { useState, useRef, useCallback } from 'react';
import { compressImage, isImageFile } from '../utils/imageCompression';

interface ImageUploaderProps {
  onImageReady: (base64: string) => void;
  attachedImage: string | null;
  onRemoveImage: () => void;
}

export default function ImageUploader({
  onImageReady,
  attachedImage,
  onRemoveImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!isImageFile(file)) return;
      setIsCompressing(true);
      try {
        const base64 = await compressImage(file);
        onImageReady(base64);
      } catch (err) {
        console.error('Image compression failed:', err);
      } finally {
        setIsCompressing(false);
      }
    },
    [onImageReady],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (attachedImage) {
    return (
      <div className="relative group">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-dark-border">
          <img
            src={attachedImage}
            alt="Attached"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={onRemoveImage}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Remove image"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative ${isDragging ? 'ring-2 ring-accent rounded-lg' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isCompressing}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-text-muted hover:text-accent hover:bg-dark-surface/80 transition-all duration-200 disabled:opacity-50"
        title="Attach image"
      >
        {isCompressing ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
