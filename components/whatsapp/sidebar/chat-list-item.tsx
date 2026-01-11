"use client";

import { Chat } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/date-utils";
import { getAvatarColor } from "@/lib/avatar-utils";
import { Pin, Volume2, ChevronDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function ChatListItem({ chat, isSelected, onClick, onDelete }: ChatListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group relative",
        isSelected ? "bg-wa-bg-hover" : "hover:bg-wa-bg-hover/50"
      )}
    >
      <div onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback
            style={{ backgroundColor: getAvatarColor(chat.name) }}
            className="text-white font-semibold text-xl"
          >
            {chat.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="font-medium text-wa-text-primary truncate text-base flex-1 min-w-0">
              {chat.name}
            </span>
            <span className="text-xs text-wa-text-secondary flex-shrink-0 ml-2">
              {formatTimestamp(chat.lastMessageTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm text-wa-text-secondary truncate flex-1 min-w-0">
              {chat.lastMessage}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              {chat.isMuted && (
                <Volume2 className="h-4 w-4 text-wa-text-secondary" />
              )}
              {chat.isPinned && (
                <Pin className="h-3.5 w-3.5 text-wa-text-secondary" />
              )}
              {chat.unreadCount > 0 && (
                <Badge className="bg-wa-icon-active text-wa-bg-main hover:bg-wa-icon-active min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronDown className="h-4 w-4 text-wa-text-secondary hover:text-wa-text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-wa-bg-secondary border-wa-border">
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500 focus:bg-wa-bg-hover cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              console.log("DELETE CLICKED FOR CHAT:", chat.id, chat.name);
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
