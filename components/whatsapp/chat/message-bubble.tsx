"use client";

import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/date-utils";
import { StatusIcon } from "../common/status-icon";

interface MessageBubbleProps {
  message: Message;
  isDirectionChange?: boolean;
}

export function MessageBubble({ message, isDirectionChange = false }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex mb-1",
        message.isOwnMessage ? "justify-end" : "justify-start",
        isDirectionChange && "mt-3"
      )}
    >
      <div
        className={cn(
          "max-w-[65%] rounded-lg px-3 py-2 shadow-sm",
          message.isOwnMessage
            ? "bg-wa-bg-sender text-wa-text-primary rounded-tr-none"
            : "bg-wa-bg-recipient text-white rounded-tl-none"
        )}
      >
        <p className="text-[14px] leading-[20px] break-words font-normal">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={cn(
              "text-[11px]",
              message.isOwnMessage ? "text-wa-text-secondary" : "text-white/70"
            )}
          >
            {formatMessageTime(message.timestamp)}
          </span>
          {message.isOwnMessage && message.status && (
            <StatusIcon status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
}
