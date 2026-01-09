"use client";

import { useState } from "react";
import { MainLayout } from "@/components/whatsapp/layout/main-layout";
import { mockChats, mockMessages } from "@/lib/mock-data";
import { Message } from "@/types/message";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: selectedChatId,
      content: content.trim(),
      timestamp: new Date(),
      isOwnMessage: true,
      status: "sent",
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage],
    }));
  };

  return (
    <MainLayout
      chats={mockChats}
      messages={allMessages[selectedChatId] || []}
      selectedChatId={selectedChatId}
      onSelectChat={setSelectedChatId}
      onSendMessage={handleSendMessage}
    />
  );
}
