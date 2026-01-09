"use client";

import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/whatsapp/layout/main-layout";
import { mockChats, mockMessages } from "@/lib/mock-data";
import { Message, MessageStatus } from "@/types/message";
import { Chat } from "@/types/chat";
import type {
  SimulatedConversation,
  PlaybackEngine,
} from "@/types/simulation";
import {
  loadSimulations,
  saveSimulation,
  savePlayedMessages,
  clearPlayedMessages,
} from "@/lib/simulation-storage";
import { CreateSimulationDialog } from "@/components/whatsapp/simulation/create-simulation-dialog";
import { ConversationPlayer } from "@/lib/playback-engine";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);

  // Simulation state
  const [simulations, setSimulations] = useState<
    Record<string, SimulatedConversation>
  >({});
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [playbackEngine, setPlaybackEngine] = useState<PlaybackEngine>({
    state: "idle",
    currentMessageIndex: 0,
    isTyping: false,
    typingIsOwnMessage: false,
  });

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // All chats (mock + simulated)
  const [allChats, setAllChats] = useState<Chat[]>(mockChats);

  // Playback engine player instance
  const playerRef = useRef<ConversationPlayer>(new ConversationPlayer());

  // Track messages during playback (ref for reliable async tracking)
  const playbackMessagesRef = useRef<Message[]>([]);

  // Load simulations from localStorage on mount
  useEffect(() => {
    const loadedSimulations = loadSimulations();
    setSimulations(loadedSimulations);

    // Create virtual chats for each simulation
    const simChats: Chat[] = Object.values(loadedSimulations).map((sim) => ({
      id: sim.chatId,
      name: sim.participantName,
      avatar: sim.participantAvatar,
      lastMessage:
        sim.playedMessages && sim.playedMessages.length > 0
          ? sim.playedMessages[sim.playedMessages.length - 1].content
          : sim.messages[0]?.content || "Start building your conversation",
      lastMessageTime: sim.updatedAt,
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isGroup: false,
      isMuted: false,
      isSimulated: true,
      simulationId: sim.id,
    }));

    setAllChats([...mockChats, ...simChats]);
  }, []);

  // Auto-save simulation on changes (debounced)
  useEffect(() => {
    if (!activeSimulation || !simulations[activeSimulation]) return;

    const timer = setTimeout(() => {
      saveSimulation(simulations[activeSimulation]);
    }, 500);

    return () => clearTimeout(timer);
  }, [simulations, activeSimulation]);

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

  // Simulation handlers
  const handleCreateSimulation = (simulation: SimulatedConversation) => {
    setSimulations((prev) => ({ ...prev, [simulation.id]: simulation }));

    // Create virtual chat
    const newChat: Chat = {
      id: simulation.chatId,
      name: simulation.participantName,
      avatar: simulation.participantAvatar,
      lastMessage: "Start building your conversation",
      lastMessageTime: simulation.createdAt,
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isGroup: false,
      isMuted: false,
      isSimulated: true,
      simulationId: simulation.id,
    };

    setAllChats((prev) => [...prev, newChat]);
    setSelectedChatId(simulation.chatId);
    setActiveSimulation(simulation.id);
    setIsEditMode(true);
  };

  const handleUpdateSimulation = (simulation: SimulatedConversation) => {
    setSimulations((prev) => ({ ...prev, [simulation.id]: simulation }));

    // Update the chat in allChats
    setAllChats((prev) =>
      prev.map((chat) =>
        chat.simulationId === simulation.id
          ? {
              ...chat,
              name: simulation.participantName,
              lastMessage:
                simulation.messages[0]?.content ||
                "Start building your conversation",
              lastMessageTime: simulation.updatedAt,
            }
          : chat
      )
    );
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);

    // Check if this is a simulated chat
    const chat = allChats.find((c) => c.id === chatId);
    if (chat?.isSimulated && chat.simulationId) {
      setActiveSimulation(chat.simulationId);
      const simulation = simulations[chat.simulationId];

      // Check if simulation has been played before
      if (simulation?.playedMessages && simulation.playedMessages.length > 0) {
        // Show messages view (not editor)
        setIsEditMode(false);
        setAllMessages((prev) => ({
          ...prev,
          [chatId]: simulation.playedMessages!,
        }));
        setPlaybackEngine({
          state: "completed",
          currentMessageIndex: simulation.playedMessages.length,
          isTyping: false,
          typingIsOwnMessage: false,
        });
      } else {
        // Never played - show editor
        setIsEditMode(true);
        setAllMessages((prev) => ({ ...prev, [chatId]: [] }));
        setPlaybackEngine({
          state: "idle",
          currentMessageIndex: 0,
          isTyping: false,
          typingIsOwnMessage: false,
        });
      }
    } else {
      setActiveSimulation(null);
      setIsEditMode(false);
    }
  };

  const getCurrentSimulation = (): SimulatedConversation | null => {
    if (!activeSimulation) return null;
    return simulations[activeSimulation] || null;
  };

  // Playback handlers
  const handlePlaySimulation = () => {
    const simulation = getCurrentSimulation();
    if (!simulation || simulation.messages.length === 0) {
      alert("Please add at least one message to the conversation before playing.");
      return;
    }

    setIsEditMode(false);
    setAllMessages((prev) => ({ ...prev, [selectedChatId]: [] }));
    setPlaybackEngine({
      state: "playing",
      currentMessageIndex: 0,
      isTyping: false,
      typingIsOwnMessage: false,
    });

    // Initialize playback messages tracking
    playbackMessagesRef.current = [];

    playerRef.current.play(
      simulation,
      0,
      (message) => {
        // Track message in ref for reliable persistence
        playbackMessagesRef.current.push(message);
        setAllMessages((prev) => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), message],
        }));
      },
      (isTyping, isOwnMessage) => {
        setPlaybackEngine((prev) => ({
          ...prev,
          isTyping,
          typingIsOwnMessage: isOwnMessage,
        }));
      },
      () => {
        setPlaybackEngine((prev) => ({ ...prev, state: "completed" }));

        // Save played messages to localStorage
        if (activeSimulation && playbackMessagesRef.current.length > 0) {
          savePlayedMessages(activeSimulation, playbackMessagesRef.current);

          // Update local state
          const updatedSimulation = {
            ...simulations[activeSimulation],
            playedMessages: playbackMessagesRef.current,
          };

          setSimulations((prev) => ({
            ...prev,
            [activeSimulation]: updatedSimulation,
          }));

          // Update chat last message
          const lastMsg =
            playbackMessagesRef.current[
              playbackMessagesRef.current.length - 1
            ];
          setAllChats((prev) =>
            prev.map((chat) =>
              chat.simulationId === activeSimulation
                ? {
                    ...chat,
                    lastMessage: lastMsg.content,
                    lastMessageTime: lastMsg.timestamp,
                  }
                : chat
            )
          );
        }
      },
      (messageId, status) => {
        setAllMessages((prev) => ({
          ...prev,
          [selectedChatId]: (prev[selectedChatId] || []).map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
          ),
        }));
      }
    );
  };

  const handleToggleEditMode = () => {
    if (!isEditMode && playbackEngine.state === "playing") {
      // Switching from play mode to edit mode - pause playback
      playerRef.current.pause();
      setPlaybackEngine((prev) => ({ ...prev, state: "paused" }));
    }

    // Clear played messages when entering edit mode
    if (!isEditMode && activeSimulation) {
      clearPlayedMessages(activeSimulation);
      setSimulations((prev) => ({
        ...prev,
        [activeSimulation]: {
          ...prev[activeSimulation],
          playedMessages: undefined,
        },
      }));
    }

    setIsEditMode((prev) => !prev);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && activeSimulation && !isEditMode) {
        e.preventDefault();

        if (playbackEngine.state === "playing") {
          playerRef.current.pause();
          setPlaybackEngine((prev) => ({ ...prev, state: "paused" }));
        } else if (playbackEngine.state === "paused") {
          setPlaybackEngine((prev) => ({ ...prev, state: "playing" }));
          playerRef.current.resume(
            (message) => {
              playbackMessagesRef.current.push(message);
              setAllMessages((prev) => ({
                ...prev,
                [selectedChatId]: [...(prev[selectedChatId] || []), message],
              }));
            },
            (isTyping, isOwnMessage) => {
              setPlaybackEngine((prev) => ({
                ...prev,
                isTyping,
                typingIsOwnMessage: isOwnMessage,
              }));
            },
            () => {
              setPlaybackEngine((prev) => ({ ...prev, state: "completed" }));

              // Save played messages to localStorage
              if (activeSimulation && playbackMessagesRef.current.length > 0) {
                savePlayedMessages(activeSimulation, playbackMessagesRef.current);

                // Update local state
                const updatedSimulation = {
                  ...simulations[activeSimulation],
                  playedMessages: playbackMessagesRef.current,
                };

                setSimulations((prev) => ({
                  ...prev,
                  [activeSimulation]: updatedSimulation,
                }));

                // Update chat last message
                const lastMsg =
                  playbackMessagesRef.current[
                    playbackMessagesRef.current.length - 1
                  ];
                setAllChats((prev) =>
                  prev.map((chat) =>
                    chat.simulationId === activeSimulation
                      ? {
                          ...chat,
                          lastMessage: lastMsg.content,
                          lastMessageTime: lastMsg.timestamp,
                        }
                      : chat
                  )
                );
              }
            },
            (messageId, status) => {
              setAllMessages((prev) => ({
                ...prev,
                [selectedChatId]: (prev[selectedChatId] || []).map((msg) =>
                  msg.id === messageId ? { ...msg, status } : msg
                ),
              }));
            }
          );
        } else {
          handlePlaySimulation();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeSimulation, isEditMode, playbackEngine.state, selectedChatId]);

  return (
    <>
      <MainLayout
        chats={allChats}
        messages={allMessages[selectedChatId] || []}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
        isEditMode={isEditMode}
        currentSimulation={getCurrentSimulation()}
        onUpdateSimulation={handleUpdateSimulation}
        onToggleEditMode={handleToggleEditMode}
        onCreateSimulation={() => setCreateDialogOpen(true)}
        onPlaySimulation={handlePlaySimulation}
        playbackEngine={playbackEngine}
      />

      <CreateSimulationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateSimulation}
      />
    </>
  );
}
