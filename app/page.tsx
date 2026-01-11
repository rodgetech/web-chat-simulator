"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MainLayout } from "@/components/whatsapp/layout/main-layout";
import { mockChats, mockMessages } from "@/lib/mock-data";
import { Message } from "@/types/message";
import { Chat } from "@/types/chat";
import type { SimulatedConversation, PlaybackEngine } from "@/types/simulation";
import {
  loadSimulations,
  saveSimulation,
  savePlayedMessages,
  clearPlayedMessages,
  deleteSimulation,
} from "@/lib/simulation-storage";
import { CreateSimulationDialog } from "@/components/whatsapp/simulation/create-simulation-dialog";
import { ConversationPlayer } from "@/lib/playback-engine";

export default function Home() {
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [allMessages, setAllMessages] =
    useState<Record<string, Message[]>>(mockMessages);

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
    simulatedInputText: "",
  });

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // All chats (mock + simulated)
  const [allChats, setAllChats] = useState<Chat[]>(mockChats);

  // Track if initial load is complete
  const initialLoadRef = useRef<boolean>(false);

  // Playback engine player instance
  const playerRef = useRef<ConversationPlayer>(new ConversationPlayer());

  // Track messages during playback (ref for reliable async tracking)
  const playbackMessagesRef = useRef<Message[]>([]);

  // Shared logic for selecting a chat (used by both user clicks and auto-select)
  const selectChatInternal = useCallback(
    (
      chatId: string,
      chats: Chat[],
      simulationsData: Record<string, SimulatedConversation>
    ) => {
      const chat = chats.find((c) => c.id === chatId);

      if (!chat) {
        console.warn(`Chat ${chatId} not found`);
        return;
      }

      setSelectedChatId(chatId);

      // Check if this is a simulated chat
      if (chat.isSimulated && chat.simulationId) {
        const simulation = simulationsData[chat.simulationId];

        if (!simulation) {
          console.warn(`Simulation ${chat.simulationId} not found`);
          return;
        }

        setActiveSimulation(chat.simulationId);

        // Check if simulation has been played before
        if (simulation.playedMessages && simulation.playedMessages.length > 0) {
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
    },
    []
  );

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

    const combinedChats = [...mockChats, ...simChats];
    setAllChats(combinedChats);

    // Auto-select most recent chat after data is loaded
    if (!initialLoadRef.current && combinedChats.length > 0) {
      const sortedChats = [...combinedChats].sort((a, b) => {
        return (
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
        );
      });

      initialLoadRef.current = true;

      // Call selectChatInternal directly with loaded data
      const mostRecentChat = sortedChats[0];
      const chat = combinedChats.find((c) => c.id === mostRecentChat.id);

      if (!chat) return;

      setSelectedChatId(mostRecentChat.id);

      if (chat.isSimulated && chat.simulationId) {
        const simulation = loadedSimulations[chat.simulationId];

        if (!simulation) return;

        setActiveSimulation(chat.simulationId);

        if (simulation.playedMessages && simulation.playedMessages.length > 0) {
          setIsEditMode(false);
          setAllMessages((prev) => ({
            ...prev,
            [mostRecentChat.id]: simulation.playedMessages!,
          }));
          setPlaybackEngine({
            state: "completed",
            currentMessageIndex: simulation.playedMessages.length,
            isTyping: false,
            typingIsOwnMessage: false,
          });
        } else {
          setIsEditMode(true);
          setAllMessages((prev) => ({ ...prev, [mostRecentChat.id]: [] }));
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              avatar: simulation.participantAvatar,
              lastMessage:
                simulation.playedMessages &&
                simulation.playedMessages.length > 0
                  ? simulation.playedMessages[
                      simulation.playedMessages.length - 1
                    ].content
                  : simulation.messages[0]?.content ||
                    "Start building your conversation",
              lastMessageTime: simulation.updatedAt,
            }
          : chat
      )
    );
  };

  const handleSelectChat = useCallback(
    (chatId: string) => {
      selectChatInternal(chatId, allChats, simulations);
    },
    [selectChatInternal, allChats, simulations]
  );

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      console.log("🗑️ handleDeleteChat called with chatId:", chatId);

      setAllChats((currentChats) => {
        console.log("Current chats count:", currentChats.length);
        const chat = currentChats.find((c) => c.id === chatId);

        if (!chat) {
          console.error("❌ Chat not found:", chatId);
          return currentChats;
        }

        console.log("✅ Found chat to delete:", chat.name);

        // If it's a simulated chat, delete from localStorage
        if (chat.isSimulated && chat.simulationId) {
          console.log("Deleting simulated chat from localStorage");
          deleteSimulation(chat.simulationId);

          // Remove from simulations state
          setSimulations((prev) => {
            const updated = { ...prev };
            delete updated[chat.simulationId!];
            return updated;
          });
        }

        // Remove from allChats
        const updatedChats = currentChats.filter((c) => c.id !== chatId);
        console.log("✅ Chats after deletion:", updatedChats.length);

        // If the deleted chat was selected, select another chat
        if (selectedChatId === chatId) {
          if (updatedChats.length > 0) {
            // Select the most recent chat
            const sortedChats = [...updatedChats].sort((a, b) => {
              return (
                new Date(b.lastMessageTime).getTime() -
                new Date(a.lastMessageTime).getTime()
              );
            });
            setSelectedChatId(sortedChats[0].id);
          } else {
            setSelectedChatId("");
            setActiveSimulation(null);
            setIsEditMode(false);
          }
        }

        return updatedChats;
      });
    },
    [selectedChatId]
  );

  const getCurrentSimulation = (): SimulatedConversation | null => {
    if (!activeSimulation) return null;
    return simulations[activeSimulation] || null;
  };

  // Playback handlers
  const handlePlaySimulation = () => {
    const simulation = getCurrentSimulation();
    if (!simulation || simulation.messages.length === 0) {
      alert(
        "Please add at least one message to the conversation before playing."
      );
      return;
    }

    setIsEditMode(false);
    setAllMessages((prev) => ({ ...prev, [selectedChatId]: [] }));
    setPlaybackEngine({
      state: "playing",
      currentMessageIndex: 0,
      isTyping: false,
      typingIsOwnMessage: false,
      simulatedInputText: "",
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
      // onInputTyping callback for realistic mode
      (text, isComplete) => {
        setPlaybackEngine((prev) => ({
          ...prev,
          simulatedInputText: text,
        }));
      },
      () => {
        setPlaybackEngine((prev) => ({
          ...prev,
          state: "completed",
          simulatedInputText: "", // Clear on complete
        }));

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
            playbackMessagesRef.current[playbackMessagesRef.current.length - 1];
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
            // onInputTyping callback for realistic mode
            (text, isComplete) => {
              setPlaybackEngine((prev) => ({
                ...prev,
                simulatedInputText: text,
              }));
            },
            () => {
              setPlaybackEngine((prev) => ({
                ...prev,
                state: "completed",
                simulatedInputText: "", // Clear on complete
              }));

              // Save played messages to localStorage
              if (activeSimulation && playbackMessagesRef.current.length > 0) {
                savePlayedMessages(
                  activeSimulation,
                  playbackMessagesRef.current
                );

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
        onDeleteChat={handleDeleteChat}
        onSendMessage={handleSendMessage}
        isEditMode={isEditMode}
        currentSimulation={getCurrentSimulation()}
        onUpdateSimulation={handleUpdateSimulation}
        onToggleEditMode={handleToggleEditMode}
        onCreateSimulation={() => setCreateDialogOpen(true)}
        onPlaySimulation={handlePlaySimulation}
        playbackEngine={playbackEngine}
        simulatedInputText={playbackEngine.simulatedInputText}
      />

      <CreateSimulationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateSimulation}
      />
    </>
  );
}
