export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: "online" | "offline" | "idle" | "dnd";
  lastSeen: string;
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  ownerId: string;
  members: string[];
  channels: Channel[];
  roles: Role[];
  inviteCode?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice" | "announcement";
  serverId: string;
  position: number;
  isPrivate: boolean;
  allowedRoles?: string[];
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: {
    manageServer: boolean;
    manageChannels: boolean;
    manageRoles: boolean;
    kickMembers: boolean;
    banMembers: boolean;
    createInvites: boolean;
    changeNickname: boolean;
    manageNicknames: boolean;
    readMessages: boolean;
    sendMessages: boolean;
    manageMessages: boolean;
    embedLinks: boolean;
    attachFiles: boolean;
    mentionEveryone: boolean;
  };
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: string;
  edited: boolean;
  deleted: boolean;
  reactions: MessageReaction[];
  attachments: Attachment[];
  readBy: string[];
  mentions: string[];
  pinned: boolean;
  replyTo?: {
    id: string;
    authorId: string;
    content: string;
  } | null;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Attachment {
  duration: number;
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DirectMessage extends Omit<Message, "channelId"> {
  recipientId: string;
}
