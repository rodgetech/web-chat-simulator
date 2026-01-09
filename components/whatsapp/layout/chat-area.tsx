"use client";

import { Chat } from "@/types/chat";
import { Message } from "@/types/message";
import { ChatHeader } from "../chat/chat-header";
import { MessagesArea } from "../chat/messages-area";
import { MessageInput } from "../chat/message-input";

interface ChatAreaProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatArea({ chat, messages, onSendMessage }: ChatAreaProps) {
  return (
    <div className="h-full flex flex-col bg-wa-bg-main">
      <ChatHeader chat={chat} />
      <div className="flex-1 overflow-hidden">
        <MessagesArea messages={messages} />
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
