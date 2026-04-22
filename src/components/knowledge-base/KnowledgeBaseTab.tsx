"use client";

import { useState, useEffect } from "react";
import { KnowledgeBaseEntry } from "@/types";
import AddEntryForm from "./AddEntryForm";
import EntryCard from "./EntryCard";

export default function KnowledgeBaseTab() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/knowledge-base");
        if (!response.ok) throw new Error("Failed to load knowledge base");
        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleAdd = (entry: KnowledgeBaseEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-pds-navy">
            Writing Style Library
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Add past Instagram captions to teach the AI your organization&apos;s
            voice. The more examples you add, the better the captions become.
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <AddEntryForm onAdd={handleAdd} />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="w-6 h-6 animate-spin text-pds-navy"
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
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="w-12 h-12 text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-slate-500 font-medium">No captions yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Add your first past caption to start building the knowledge base.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
