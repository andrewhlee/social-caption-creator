"use client";

import { useRef, useState, useCallback } from "react";

interface PhotoUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function PhotoUploader({
  onFileSelect,
  selectedFile,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const supported = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!supported.includes(file.type)) {
        setError("Please upload a JPEG, PNG, GIF, or WebP image.");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("Image must be under 4MB.");
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-pds-navy">
        Photo *
      </label>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
          ${isDragging ? "border-pds-gold bg-amber-50" : "border-slate-300 hover:border-pds-navy"}
          ${preview ? "border-pds-navy" : ""}
        `}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-72 object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                Click to change photo
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg
              className="w-12 h-12 text-slate-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-pds-navy">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-1">
              JPEG, PNG, WebP up to 4MB
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <p className="text-xs text-slate-500 truncate">{selectedFile.name}</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
