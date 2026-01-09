"use client";

import { Chat } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./chat-list-item";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <ScrollArea className="h-full">
      <div>
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
