"use client";

import { Message } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "../simulation/typing-indicator";
import { useEffect, useRef } from "react";

interface MessagesAreaProps {
  messages: Message[];
  isTyping?: boolean;
  typingIsOwnMessage?: boolean;
}

export function MessagesArea({
  messages,
  isTyping = false,
  typingIsOwnMessage = false,
}: MessagesAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea className="h-full">
      <div
        ref={scrollRef}
        className="px-16 py-6"
        style={{
          backgroundColor: '#161818',
        }}
      >
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : undefined;
          const isDirectionChange = prevMessage ? prevMessage.isOwnMessage !== message.isOwnMessage : false;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isDirectionChange={isDirectionChange}
            />
          );
        })}
        {isTyping && <TypingIndicator isOwnMessage={typingIsOwnMessage} />}
      </div>
    </ScrollArea>
  );
}
