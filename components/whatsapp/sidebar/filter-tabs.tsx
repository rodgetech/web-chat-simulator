"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "unread" | "favourites" | "groups";

const tabs: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "favourites", label: "Favourites" },
  { value: "groups", label: "Groups" },
];

export function FilterTabs() {
  const [activeTab, setActiveTab] = useState<FilterType>("all");

  return (
    <div className="flex gap-2 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
            activeTab === tab.value
              ? "bg-wa-tab-active-bg text-wa-text-primary border-wa-icon-active"
              : "bg-wa-tab-bg text-wa-text-secondary border-wa-tab-border hover:bg-wa-bg-hover"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
