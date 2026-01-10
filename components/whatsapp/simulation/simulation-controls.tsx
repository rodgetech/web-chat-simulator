"use client";

import { Play, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlaybackState } from "@/types/simulation";

interface SimulationControlsProps {
  isEditMode: boolean;
  playbackState: PlaybackState;
  onToggleMode: () => void;
  onPlay?: () => void;
}

export function SimulationControls({
  isEditMode,
  playbackState,
  onToggleMode,
  onPlay,
}: SimulationControlsProps) {
  // Hide controls entirely during active playback
  if (playbackState === "playing") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isEditMode && onPlay ? onPlay : onToggleMode}
      className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
      title={isEditMode ? "Play Simulation" : "Edit Simulation"}
    >
      {isEditMode ? (
        <Play className="h-5 w-5" />
      ) : (
        <Pencil className="h-5 w-5" />
      )}
    </Button>
  );
}
