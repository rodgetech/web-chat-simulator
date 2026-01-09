"use client";

import { Chat } from "@/types/chat";
import { SidebarHeader } from "../sidebar/sidebar-header";
import { SearchBar } from "../sidebar/search-bar";
import { FilterTabs } from "../sidebar/filter-tabs";
import { NotificationBanner } from "../sidebar/notification-banner";
import { ChatList } from "../sidebar/chat-list";

interface SidebarProps {
  chats: Chat[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ chats, selectedChatId, onSelectChat }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-wa-bg-main">
      <SidebarHeader />
      <div className="px-3 py-2">
        <SearchBar />
      </div>
      <div className="px-3">
        <FilterTabs />
      </div>
      <NotificationBanner />
      <div className="flex-1 overflow-hidden">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
        />
      </div>
    </div>
  );
}
