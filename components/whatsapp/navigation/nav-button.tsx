"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function NavButton({ icon: Icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative w-[70px] h-[70px] flex items-center justify-center transition-all duration-150",
        "hover:bg-wa-bg-hover/50",
        isActive && "bg-wa-bg-hover/30"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-wa-icon-active" />
      )}
      <Icon
        className={cn(
          "h-6 w-6 transition-colors duration-150",
          isActive ? "text-wa-icon-active" : "text-wa-icon"
        )}
      />
    </button>
  );
}
