"use client";

import { useState } from "react";
import { KnowledgeBaseEntry } from "@/types";

interface EntryCardProps {
  entry: KnowledgeBaseEntry;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/knowledge-base?id=${entry.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(entry.id);
      }
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-800 leading-relaxed flex-1 whitespace-pre-wrap">
          {entry.caption}
        </p>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-all
            ${confirmDelete
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
            }`}
          onBlur={() => setConfirmDelete(false)}
        >
          {isDeleting ? "..." : confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {entry.context && (
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {entry.context}
          </span>
        )}
        <span className="text-xs text-slate-400">{formattedDate}</span>
        {entry.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-xs text-pds-navy/60 bg-pds-navy/5 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
