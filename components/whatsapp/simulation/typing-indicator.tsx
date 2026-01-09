"use client";

interface TypingIndicatorProps {
  isOwnMessage: boolean;
}

export function TypingIndicator({ isOwnMessage }: TypingIndicatorProps) {
  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } px-16 py-1 animate-in fade-in duration-200`}
    >
      <div
        className={`${
          isOwnMessage
            ? "bg-wa-bg-sender"
            : "bg-wa-bg-recipient"
        } rounded-lg px-4 py-2 max-w-[65%] shadow-sm`}
      >
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full bg-wa-text-secondary/60 animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-wa-text-secondary/60 animate-bounce"
            style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-wa-text-secondary/60 animate-bounce"
            style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
