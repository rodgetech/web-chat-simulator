import type { Message, MessageStatus } from "./message";

// Represents a message in the simulation with timing metadata
export interface SimulatedMessage {
  id: string;
  content: string;
  isOwnMessage: boolean;
  delayMs: number; // Delay BEFORE this message appears (milliseconds)
  typingDurationMs?: number; // Optional custom typing duration (defaults based on content length)
}

// Represents an entire simulated conversation
export interface SimulatedConversation {
  id: string;
  chatId: string; // References a Chat.id
  name: string; // Conversation name for user reference
  participantName: string;
  participantAvatar?: string;
  messages: SimulatedMessage[];
  playedMessages?: Message[]; // Stores completed playback messages for persistence
  createdAt: Date;
  updatedAt: Date;
}

// Playback state machine
export type PlaybackState = "idle" | "playing" | "paused" | "completed";

// Status transition for scheduled updates
export interface StatusTransition {
  messageId: string;
  targetStatus: MessageStatus;
  scheduledTime: number;
}

// Playback engine state
export interface PlaybackEngine {
  state: PlaybackState;
  currentMessageIndex: number;
  isTyping: boolean;
  typingIsOwnMessage: boolean; // Track whose typing indicator to show
  currentStatusTransition?: StatusTransition;
}
