"use client";

import { Chat } from "@/types/chat";
import { Message } from "@/types/message";
import { ChatHeader } from "../chat/chat-header";
import { MessagesArea } from "../chat/messages-area";
import { MessageInput } from "../chat/message-input";
import { SimulationEditor } from "../simulation/simulation-editor";
import type {
  SimulatedConversation,
  PlaybackEngine,
} from "@/types/simulation";

interface ChatAreaProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isEditMode?: boolean;
  currentSimulation?: SimulatedConversation | null;
  onUpdateSimulation?: (simulation: SimulatedConversation) => void;
  onToggleEditMode?: () => void;
  onPlaySimulation?: () => void;
  playbackEngine?: PlaybackEngine;
  simulatedInputText?: string;  // Text being typed in input box during simulation
}

export function ChatArea({
  chat,
  messages,
  onSendMessage,
  isEditMode = false,
  currentSimulation,
  onUpdateSimulation,
  onToggleEditMode,
  onPlaySimulation,
  playbackEngine,
  simulatedInputText,
}: ChatAreaProps) {
  const defaultPlaybackEngine: PlaybackEngine = {
    state: "idle",
    currentMessageIndex: 0,
    isTyping: false,
    typingIsOwnMessage: false,
  };

  const engine = playbackEngine || defaultPlaybackEngine;

  return (
    <div className="h-full flex flex-col bg-wa-bg-main">
      <ChatHeader
        chat={chat}
        isEditMode={isEditMode}
        playbackState={engine.state}
        onToggleEditMode={onToggleEditMode}
        onPlaySimulation={onPlaySimulation}
      />
      <div className="flex-1 overflow-hidden">
        {isEditMode && currentSimulation && onUpdateSimulation ? (
          <SimulationEditor
            simulation={currentSimulation}
            onUpdate={onUpdateSimulation}
          />
        ) : (
          <MessagesArea
            messages={messages}
            isTyping={engine.isTyping}
            typingIsOwnMessage={engine.typingIsOwnMessage}
          />
        )}
      </div>
      {!isEditMode && (
        <MessageInput
          onSendMessage={onSendMessage}
          simulatedTyping={simulatedInputText}
          disabled={engine.state === "playing"}
        />
      )}
    </div>
  );
}
