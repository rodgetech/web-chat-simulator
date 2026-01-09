export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  chatId: string;
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
  status?: MessageStatus;
  isStarred?: boolean;
}
