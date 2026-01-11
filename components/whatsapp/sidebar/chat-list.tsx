"use client";

import { Chat } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./chat-list-item";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat, onDeleteChat }: ChatListProps) {
  // Sort chats by most recent message time (newest first)
  const sortedChats = [...chats].sort((a, b) => {
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });

  return (
    <ScrollArea className="h-full">
      <div>
        {sortedChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
            onDelete={() => onDeleteChat(chat.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
