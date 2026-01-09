"use client";

import { BellOff, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#1f3b31] border-b border-wa-divider">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-wa-bg-main">
        <BellOff className="h-5 w-5 text-wa-icon" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-wa-text-primary">
          Message notifications are off.{" "}
          <span className="text-wa-icon-active cursor-pointer hover:underline">
            Turn on
          </span>
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-wa-text-secondary hover:bg-wa-bg-hover flex-shrink-0"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
