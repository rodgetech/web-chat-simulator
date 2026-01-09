import type {
  SimulatedConversation,
  SimulatedMessage,
} from "@/types/simulation";
import type { Message, MessageStatus } from "@/types/message";

type OnMessageCallback = (message: Message) => void;
type OnTypingCallback = (isTyping: boolean, isOwnMessage: boolean) => void;
type OnCompleteCallback = () => void;
type OnStatusUpdateCallback = (messageId: string, status: MessageStatus) => void;

export class ConversationPlayer {
  private timers: NodeJS.Timeout[] = [];
  private currentIndex: number = 0;
  private isPaused: boolean = false;
  private simulation: SimulatedConversation | null = null;

  /**
   * Start playing the simulation
   */
  async play(
    simulation: SimulatedConversation,
    startIndex: number = 0,
    onMessage: OnMessageCallback,
    onTyping: OnTypingCallback,
    onComplete: OnCompleteCallback,
    onStatusUpdate: OnStatusUpdateCallback
  ): Promise<void> {
    this.simulation = simulation;
    this.currentIndex = startIndex;
    this.isPaused = false;
    this.clearTimers();

    await this.playMessages(
      simulation,
      onMessage,
      onTyping,
      onComplete,
      onStatusUpdate
    );
  }

  /**
   * Internal method to play messages sequentially
   */
  private async playMessages(
    simulation: SimulatedConversation,
    onMessage: OnMessageCallback,
    onTyping: OnTypingCallback,
    onComplete: OnCompleteCallback,
    onStatusUpdate: OnStatusUpdateCallback
  ): Promise<void> {
    for (
      let i = this.currentIndex;
      i < simulation.messages.length;
      i++
    ) {
      if (this.isPaused) {
        this.currentIndex = i;
        return;
      }

      const simMsg = simulation.messages[i];
      this.currentIndex = i;

      // Step 1: Wait for delay before this message
      await this.wait(simMsg.delayMs);
      if (this.isPaused) return;

      // Step 2: Show typing indicator
      onTyping(true, simMsg.isOwnMessage);
      const typingDuration =
        simMsg.typingDurationMs ||
        this.calculateTypingDuration(simMsg.content);
      await this.wait(typingDuration);
      if (this.isPaused) return;

      // Step 3: Hide typing indicator
      onTyping(false, simMsg.isOwnMessage);

      // Step 4: Display the message
      const message: Message = {
        id: simMsg.id,
        chatId: simulation.chatId,
        content: simMsg.content,
        timestamp: new Date(),
        isOwnMessage: simMsg.isOwnMessage,
        status: simMsg.isOwnMessage ? "sent" : undefined,
      };
      onMessage(message);

      // Step 5: Schedule status transitions for own messages
      if (simMsg.isOwnMessage) {
        this.scheduleStatusTransition(simMsg.id, "delivered", 1500, onStatusUpdate);
        this.scheduleStatusTransition(simMsg.id, "read", 4000, onStatusUpdate);
      }
    }

    // All messages played
    if (!this.isPaused) {
      this.currentIndex = simulation.messages.length;
      onComplete();
    }
  }

  /**
   * Pause the playback
   */
  pause(): void {
    this.isPaused = true;
    this.clearTimers();
  }

  /**
   * Resume playback from where it was paused
   */
  resume(
    onMessage: OnMessageCallback,
    onTyping: OnTypingCallback,
    onComplete: OnCompleteCallback,
    onStatusUpdate: OnStatusUpdateCallback
  ): void {
    if (!this.simulation) return;

    this.isPaused = false;
    this.playMessages(
      this.simulation,
      onMessage,
      onTyping,
      onComplete,
      onStatusUpdate
    );
  }

  /**
   * Reset the playback to the beginning
   */
  reset(): void {
    this.currentIndex = 0;
    this.isPaused = false;
    this.clearTimers();
  }

  /**
   * Get the current playback position
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Check if playback is paused
   */
  getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Calculate realistic typing duration based on content length
   * Simulates ~60 WPM typing speed (5 chars/second)
   */
  private calculateTypingDuration(content: string): number {
    const baseMs = content.length * 200; // ~5 chars per second
    const minMs = 1000; // Minimum 1 second
    const maxMs = 5000; // Maximum 5 seconds

    return Math.max(minMs, Math.min(baseMs, maxMs));
  }

  /**
   * Schedule a status transition (sent -> delivered -> read)
   */
  private scheduleStatusTransition(
    messageId: string,
    targetStatus: MessageStatus,
    delayMs: number,
    onStatusUpdate: OnStatusUpdateCallback
  ): void {
    const timer = setTimeout(() => {
      if (!this.isPaused) {
        onStatusUpdate(messageId, targetStatus);
      }
    }, delayMs);

    this.timers.push(timer);
  }

  /**
   * Wait for a specified duration (respects pause state)
   */
  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, ms);

      this.timers.push(timer);
    });
  }

  /**
   * Clear all active timers
   */
  private clearTimers(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }
}
