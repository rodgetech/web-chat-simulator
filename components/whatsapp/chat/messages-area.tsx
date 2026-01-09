"use client";

import { Message } from "@/types/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { useEffect, useRef } from "react";

interface MessagesAreaProps {
  messages: Message[];
}

export function MessagesArea({ messages }: MessagesAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const isDirectionChange = prevMessage && prevMessage.isOwnMessage !== message.isOwnMessage;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isDirectionChange={isDirectionChange}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}
