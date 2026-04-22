"use client";

import { useState } from "react";
import CaptionGeneratorTab from "@/components/caption-generator/CaptionGeneratorTab";
import KnowledgeBaseTab from "@/components/knowledge-base/KnowledgeBaseTab";

type Tab = "generate" | "knowledge-base";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-pds-navy text-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pds-gold flex items-center justify-center font-bold text-pds-navy text-sm leading-none">
              PDS
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Caption Creator</h1>
              <p className="text-xs text-white/60 leading-tight">Princeton Day School</p>
            </div>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-white/50">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Instagram Caption Generator
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab("generate")}
              className={`relative py-4 px-5 text-sm font-medium transition-colors
                ${activeTab === "generate"
                  ? "text-pds-navy"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Caption
              </span>
              {activeTab === "generate" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pds-gold rounded-t" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("knowledge-base")}
              className={`relative py-4 px-5 text-sm font-medium transition-colors
                ${activeTab === "knowledge-base"
                  ? "text-pds-navy"
                  : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Writing Style Library
              </span>
              {activeTab === "knowledge-base" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pds-gold rounded-t" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {activeTab === "generate" ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-pds-navy">Generate a Caption</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload a photo and describe what&apos;s happening. The AI will craft a caption in PDS&apos;s voice.
              </p>
            </div>
            <CaptionGeneratorTab />
          </div>
        ) : (
          <KnowledgeBaseTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6">
        <p className="text-center text-xs text-slate-400">
          Princeton Day School · Instagram Caption Creator · Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
