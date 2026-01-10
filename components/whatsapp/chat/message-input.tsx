"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sticker, Paperclip, Mic, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  simulatedTyping?: string;  // Text being typed during simulation (includes cursor |)
  disabled?: boolean;        // Disable during simulation playback
}

export function MessageInput({
  onSendMessage,
  simulatedTyping,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  // Check if we're actively simulating (has text with cursor)
  const isSimulating = simulatedTyping !== undefined && simulatedTyping !== "";

  // Split simulated text and cursor for styling
  const simulatedText = isSimulating && simulatedTyping.endsWith('|')
    ? simulatedTyping.slice(0, -1)
    : simulatedTyping || "";
  const hasCursor = isSimulating && simulatedTyping?.endsWith('|');

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

        <div className="flex-1 relative">
          {isSimulating ? (
            // Custom display for simulated typing with blinking cursor
            <div className="text-wa-text-primary text-[15px] py-[1px] whitespace-pre-wrap break-words">
              {simulatedText}
              {hasCursor && (
                <span
                  className="inline-block"
                  style={{ animation: 'cursor-blink 1s step-end infinite' }}
                >
                  |
                </span>
              )}
            </div>
          ) : (
            // Regular input for user typing
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="w-full bg-transparent border-none outline-none text-wa-text-primary placeholder:text-wa-text-tertiary text-[15px] disabled:opacity-100"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={disabled}
          className={`text-wa-icon hover:text-wa-text-primary transition-colors flex-shrink-0 ${
            isSimulating ? 'animate-pulse' : ''
          }`}
        >
          {(message.trim() || isSimulating) ? (
            <Send className="h-5 w-5" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
