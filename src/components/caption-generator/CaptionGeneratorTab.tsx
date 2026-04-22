"use client";

import { useState } from "react";
import PhotoUploader from "./PhotoUploader";
import BackgroundInfoForm from "./BackgroundInfoForm";
import CaptionOutput from "./CaptionOutput";

export default function CaptionGeneratorTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState("");
  const [caption, setCaption] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError("Please upload a photo.");
      return;
    }
    if (!backgroundInfo.trim()) {
      setError("Please provide background information.");
      return;
    }

    setError(null);
    setCaption("");
    setIsStreaming(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("backgroundInfo", backgroundInfo);

      const response = await fetch("/api/generate-caption", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate caption");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setCaption((prev) => prev + parsed.text);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Inputs */}
      <div className="space-y-6">
        <PhotoUploader
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
        <BackgroundInfoForm
          value={backgroundInfo}
          onChange={setBackgroundInfo}
        />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isStreaming || !selectedFile || !backgroundInfo.trim()}
          className="w-full flex items-center justify-center gap-2 bg-pds-navy text-white font-semibold py-3 px-6 rounded-xl hover:bg-pds-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStreaming ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate Caption
            </>
          )}
        </button>
      </div>

      {/* Right: Output */}
      <div className="lg:pt-0">
        <CaptionOutput caption={caption} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
