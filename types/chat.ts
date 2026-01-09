export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isGroup: boolean;
  isMuted: boolean;
  isOnline?: boolean;
}
