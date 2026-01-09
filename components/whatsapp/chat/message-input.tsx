"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sticker, Paperclip, Mic, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-wa-bg-main">
      <div className="flex-1 flex items-center gap-3 bg-wa-bg-recipient rounded-[18px] px-4 py-2.5">
        <button className="text-wa-icon hover:text-wa-text-primary transition-colors flex-shrink-0">
          <Sticker className="h-6 w-6" />
        </button>
        <button className="text-wa-icon hover:text-wa-text-primary transition-colors flex-shrink-0">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-wa-text-primary placeholder:text-wa-text-tertiary text-[15px]"
        />
        <button
          onClick={handleSubmit}
          className="text-wa-icon hover:text-wa-text-primary transition-colors flex-shrink-0"
        >
          {message.trim() ? (
            <Send className="h-5 w-5" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
