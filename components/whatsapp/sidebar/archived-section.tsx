"use client";

import { Archive } from "lucide-react";

export function ArchivedSection() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-wa-bg-hover transition-colors border-b border-wa-divider">
      <div className="flex items-center justify-center h-12 w-12 rounded-full">
        <Archive className="h-5 w-5 text-wa-icon-active" />
      </div>
      <div className="flex-1">
        <p className="text-base font-medium text-wa-text-primary">Archived</p>
      </div>
    </div>
  );
}
