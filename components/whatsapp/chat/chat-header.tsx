"use client";

import { Chat } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAvatarColor } from "@/lib/avatar-utils";
import { Video, Phone, Search, MoreVertical } from "lucide-react";
import { SimulationControls } from "../simulation/simulation-controls";
import type { PlaybackState } from "@/types/simulation";

interface ChatHeaderProps {
  chat: Chat;
  isEditMode?: boolean;
  playbackState?: PlaybackState;
  onToggleEditMode?: () => void;
  onPlaySimulation?: () => void;
  onDeleteChat?: () => void;
}

export function ChatHeader({
  chat,
  isEditMode = false,
  playbackState = "idle",
  onToggleEditMode,
  onPlaySimulation,
  onDeleteChat,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-wa-bg-main border-b border-wa-border">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback
            style={{ backgroundColor: getAvatarColor(chat.name) }}
            className="text-white font-semibold text-lg"
          >
            {chat.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-base font-medium text-wa-text-primary">
            {chat.name}
          </h2>
          {chat.isOnline && (
            <p className="text-xs text-wa-text-secondary">online</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {chat.isSimulated && onToggleEditMode && (
          <SimulationControls
            isEditMode={isEditMode}
            playbackState={playbackState}
            onToggleMode={onToggleEditMode}
            onPlay={onPlaySimulation}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
        >
          <Search className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-wa-icon hover:bg-wa-bg-hover"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-wa-bg-secondary border-wa-border text-wa-text-primary"
          >
            <DropdownMenuItem>Contact info</DropdownMenuItem>
            <DropdownMenuItem>Select messages</DropdownMenuItem>
            <DropdownMenuItem>Close chat</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Clear messages</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={(e) => {
                e.preventDefault();
                console.log("🗑️ DELETE FROM HEADER - Chat:", chat.id, chat.name);
                if (onDeleteChat) {
                  onDeleteChat();
                }
              }}
            >
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
