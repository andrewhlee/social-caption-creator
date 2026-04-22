"use client";

import { useState } from "react";
import { KnowledgeBaseEntry } from "@/types";

interface AddEntryFormProps {
  onAdd: (entry: KnowledgeBaseEntry) => void;
}

export default function AddEntryForm({ onAdd }: AddEntryFormProps) {
  const [caption, setCaption] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError("Caption text is required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: caption.trim(), context: context.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add entry");
      }

      const data = await response.json();
      onAdd(data.entry);
      setCaption("");
      setContext("");
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-pds-gold text-pds-navy font-semibold py-4 px-6 rounded-xl hover:bg-amber-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Caption to Knowledge Base
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-pds-gold bg-amber-50/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-pds-navy">Add New Caption Example</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          className="text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Caption Text *
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Paste a previous Instagram caption here..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pds-navy resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Context{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Upper School lacrosse championship win, Spring 2024"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pds-navy"
          />
          <p className="text-xs text-slate-400">
            Describe what the post was about to improve caption matching.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !caption.trim()}
            className="flex-1 bg-pds-navy text-white font-semibold py-2.5 rounded-lg hover:bg-pds-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? "Saving..." : "Save to Knowledge Base"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
