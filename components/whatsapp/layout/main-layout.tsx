"use client";

import { useState } from "react";
import { Chat } from "@/types/chat";
import { Message } from "@/types/message";
import { Sidebar } from "./sidebar";
import { ChatArea } from "./chat-area";
import { NavSidebar, NavTab } from "../navigation/nav-sidebar";
import type {
  SimulatedConversation,
  PlaybackEngine,
} from "@/types/simulation";

interface MainLayoutProps {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onSendMessage: (content: string) => void;
  isEditMode?: boolean;
  currentSimulation?: SimulatedConversation | null;
  onUpdateSimulation?: (simulation: SimulatedConversation) => void;
  onToggleEditMode?: () => void;
  onCreateSimulation?: () => void;
  onPlaySimulation?: () => void;
  playbackEngine?: PlaybackEngine;
  simulatedInputText?: string;
}

export function MainLayout({
  chats,
  messages,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
  onSendMessage,
  isEditMode,
  currentSimulation,
  onUpdateSimulation,
  onToggleEditMode,
  onCreateSimulation,
  onPlaySimulation,
  playbackEngine,
  simulatedInputText,
}: MainLayoutProps) {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("chats");
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <div className="flex h-screen bg-wa-bg-main min-w-[1280px] overflow-hidden">
      <NavSidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />
      <aside className="w-[420px] border-r border-wa-border flex-shrink-0">
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onCreateSimulation={onCreateSimulation}
        />
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        {selectedChat ? (
          <ChatArea
            chat={selectedChat}
            messages={messages}
            onSendMessage={onSendMessage}
            isEditMode={isEditMode}
            currentSimulation={currentSimulation}
            onUpdateSimulation={onUpdateSimulation}
            onToggleEditMode={onToggleEditMode}
            onPlaySimulation={onPlaySimulation}
            playbackEngine={playbackEngine}
            simulatedInputText={simulatedInputText}
            onDeleteChat={() => onDeleteChat(selectedChat.id)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-wa-text-secondary">Select a chat to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
}
