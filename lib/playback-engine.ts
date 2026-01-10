import type {
  SimulatedConversation,
  SimulatedMessage,
} from "@/types/simulation";
import type { Message, MessageStatus } from "@/types/message";

type OnMessageCallback = (message: Message) => void;
type OnTypingCallback = (isTyping: boolean, isOwnMessage: boolean) => void;
type OnInputTypingCallback = (text: string, isComplete: boolean) => void;
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
    onInputTyping: OnInputTypingCallback,
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
      onInputTyping,
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
    onInputTyping: OnInputTypingCallback,
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

      const typingMode = simulation.typingMode || "instant"; // Default to instant

      // Step 2: Show typing (behavior based on message type AND typing mode)
      if (simMsg.isOwnMessage) {
        // Own messages: behavior depends on typing mode
        if (typingMode === "realistic") {
          // Realistic mode: simulate typing in input box
          await this.simulateInputTyping(
            simMsg.content,
            simMsg.typingDurationMs || this.calculateTypingDuration(simMsg.content),
            onInputTyping
          );
        } else {
          // Instant mode: no typing indicator, no simulation
          // Just wait a brief moment (optional, for pacing)
          const briefDelay = Math.min(500, simMsg.content.length * 20);
          await this.wait(briefDelay);
          if (this.isPaused) return;
        }
      } else {
        // Received messages: always show typing indicator (both modes)
        onTyping(true, false);
        const typingDuration =
          simMsg.typingDurationMs ||
          this.calculateTypingDuration(simMsg.content);
        await this.wait(typingDuration);
        if (this.isPaused) return;
        onTyping(false, false);
      }

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
    onInputTyping: OnInputTypingCallback,
    onComplete: OnCompleteCallback,
    onStatusUpdate: OnStatusUpdateCallback
  ): void {
    if (!this.simulation) return;

    this.isPaused = false;
    this.playMessages(
      this.simulation,
      onMessage,
      onTyping,
      onInputTyping,
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
   * Generate random number between min and max (inclusive)
   */
  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Check if a two-character string is a common digraph
   * Common digraphs are typed faster due to muscle memory
   */
  private isCommonDigraph(pair: string): boolean {
    const common = ['th', 'he', 'in', 'er', 'an', 'ed', 'nd', 'to', 'en', 'es',
                    'on', 'at', 're', 'or', 'ti', 'hi', 'st', 'ou', 'it', 'ng'];
    return common.includes(pair.toLowerCase());
  }

  /**
   * Generate a typing delay for a character based on context
   * Implements human-like typing patterns with natural variations
   */
  private generateCharDelay(char: string, prevChar: string, baseDelay: number): number {
    // Base typing speed with ±40% variance
    let delay = baseDelay * this.randomBetween(0.6, 1.4);

    // Burst typing for common letter combinations
    if (prevChar && this.isCommonDigraph(prevChar + char)) {
      delay *= 0.5; // Much faster for common pairs
    }

    // Longer pauses after sentence-ending punctuation
    if (prevChar.match(/[.!?]/)) {
      delay += this.randomBetween(300, 600);
    }
    // Word boundary pauses (after space)
    else if (prevChar === ' ') {
      delay += this.randomBetween(150, 300);
    }
    // Comma/semicolon/colon pauses
    else if (prevChar.match(/[,;:]/)) {
      delay += this.randomBetween(200, 400);
    }

    // Occasional random hesitation (5% chance)
    if (Math.random() < 0.05) {
      delay += this.randomBetween(400, 800);
    }

    // Clamp to reasonable bounds
    return Math.max(40, Math.min(delay, 500));
  }

  /**
   * Get a random character for typo simulation
   * Returns plausible typo characters (lowercase letters)
   */
  private getRandomChar(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  /**
   * Simulate typing text into the input box character by character
   * Includes human-like timing variations and occasional typos with corrections
   */
  private async simulateInputTyping(
    content: string,
    totalDurationMs: number,
    onInputTyping: OnInputTypingCallback
  ): Promise<void> {
    // Reserve 10% of time for potential typo corrections
    const typingDuration = totalDurationMs * 0.9;
    const baseDelayPerChar = typingDuration / content.length;

    let currentText = "";
    let typoCount = 0;
    const maxTypos = Math.min(3, Math.floor(content.length / 15)); // ~1 typo per 15 chars, max 3

    for (let i = 0; i < content.length; i++) {
      if (this.isPaused) return;

      const char = content[i];
      const prevChar = i > 0 ? content[i - 1] : '';

      // Typo simulation: 7% chance per character
      // Skip first/last 2 characters and limit total typos
      const shouldTypo = Math.random() < 0.07
        && i > 2
        && i < content.length - 2
        && typoCount < maxTypos;

      if (shouldTypo) {
        // Type wrong character
        const wrongChar = this.getRandomChar();
        currentText += wrongChar;
        onInputTyping(currentText + '|', false);
        await this.wait(this.randomBetween(80, 150));
        if (this.isPaused) return;

        // Pause (noticing mistake)
        await this.wait(this.randomBetween(200, 400));
        if (this.isPaused) return;

        // Backspace
        currentText = currentText.slice(0, -1);
        onInputTyping(currentText + '|', false);
        await this.wait(this.randomBetween(100, 200));
        if (this.isPaused) return;

        typoCount++;
      }

      // Type the correct character
      currentText += char;
      const isComplete = i === content.length - 1;
      onInputTyping(currentText + '|', isComplete);

      // Calculate delay until next character (except for last character)
      if (!isComplete) {
        const delay = this.generateCharDelay(char, prevChar, baseDelayPerChar);
        await this.wait(delay);
      }
    }

    // Brief pause before "sending" (like user hitting Enter)
    await this.wait(300);
    if (this.isPaused) return;

    // Clear the input (signal send) - remove cursor for send
    onInputTyping("", true);
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
