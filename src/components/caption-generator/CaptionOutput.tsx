"use client";

import { useState } from "react";

interface CaptionOutputProps {
  caption: string;
  isStreaming: boolean;
}

export default function CaptionOutput({
  caption,
  isStreaming,
}: CaptionOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!caption && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-48 text-center p-8 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
        <svg
          className="w-10 h-10 text-slate-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-sm text-slate-400">
          Your generated caption will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-pds-navy">
          Generated Caption
        </label>
        {caption && !isStreaming && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all
              ${copied
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600 hover:bg-pds-navy hover:text-white"
              }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative rounded-xl border border-slate-200 bg-white p-5 min-h-36 shadow-sm">
        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
          {caption}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-pds-navy ml-0.5 animate-pulse align-text-bottom" />
          )}
        </p>
      </div>

      {caption && !isStreaming && (
        <p className="text-xs text-slate-400 text-right">
          {caption.length} characters
        </p>
      )}
    </div>
  );
}
