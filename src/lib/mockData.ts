import { User, Server, Channel, Message, DirectMessage } from '@/types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'Johndoe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'Janedoe',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=janedoe',
    status: 'idle',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    username: 'Bobsmith',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bobsmith',
    status: 'offline',
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    username: 'Alicejones',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alicejones',
    status: 'dnd',
    lastSeen: new Date().toISOString(),
  },
  {
    id: '5',
    username: 'Mikebrown',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mikebrown',
    status: 'online',
    lastSeen: new Date().toISOString(),
  },
];

// Mock servers data
export const mockServers: Server[] = [
  {
    id: '1',
    name: 'Gaming Lounge',
    icon: '🎮',
    ownerId: '1',
    members: ['1', '2', '3', '4'],
    channels: [
      {
        id: '101',
        name: 'general',
        type: 'text',
        serverId: '1',
        position: 0,
        isPrivate: false,
      },
      {
        id: '102',
        name: 'valorant',
        type: 'text',
        serverId: '1',
        position: 1,
        isPrivate: false,
      },
      {
        id: '103',
        name: 'minecraft',
        type: 'text',
        serverId: '1',
        position: 2,
        isPrivate: false,
      },
    ],
    roles: [
      {
        id: '201',
        name: 'Admin',
        color: '#FF0000',
        permissions: {
          manageServer: true,
          manageChannels: true,
          manageRoles: true,
          kickMembers: true,
          banMembers: true,
          createInvites: true,
          changeNickname: true,
          manageNicknames: true,
          readMessages: true,
          sendMessages: true,
          manageMessages: true,
          embedLinks: true,
          attachFiles: true,
          mentionEveryone: true,
        },
      },
      {
        id: '202',
        name: 'Moderator',
        color: '#00FF00',
        permissions: {
          manageServer: false,
          manageChannels: false,
          manageRoles: false,
          kickMembers: true,
          banMembers: false,
          createInvites: true,
          changeNickname: true,
          manageNicknames: false,
          readMessages: true,
          sendMessages: true,
          manageMessages: true,
          embedLinks: true,
          attachFiles: true,
          mentionEveryone: false,
        },
      },
    ],
    inviteCode: 'gaming123',
  },
  {
    id: '2',
    name: 'Study Group',
    icon: '📚',
    ownerId: '2',
    members: ['1', '2', '5'],
    channels: [
      {
        id: '104',
        name: 'general',
        type: 'text',
        serverId: '2',
        position: 0,
        isPrivate: false,
      },
      {
        id: '105',
        name: 'homework-help',
        type: 'text',
        serverId: '2',
        position: 1,
        isPrivate: false,
      },
    ],
    roles: [
      {
        id: '203',
        name: 'Teacher',
        color: '#0000FF',
        permissions: {
          manageServer: true,
          manageChannels: true,
          manageRoles: true,
          kickMembers: true,
          banMembers: true,
          createInvites: true,
          changeNickname: true,
          manageNicknames: true,
          readMessages: true,
          sendMessages: true,
          manageMessages: true,
          embedLinks: true,
          attachFiles: true,
          mentionEveryone: true,
        },
      },
    ],
  },
];

// Mock messages data
export const mockMessages: Record<string, Message[]> = {
  '101': [
    {
      id: '1001',
      content: 'Hey everyone! Welcome to the Gaming Lounge!',
      authorId: '1',
      channelId: '101',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [
        {
          emoji: '👋',
          count: 3,
          users: ['2', '3', '4'],
        },
      ],
      attachments: [],
      readBy: ['1', '2', '3', '4'],
      mentions: [],
      pinned: true,
    },
    {
      id: '1002',
      content: 'What games is everyone playing these days?',
      authorId: '2',
      channelId: '101',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [],
      attachments: [],
      readBy: ['1', '2', '3'],
      mentions: [],
      pinned: false,
    },
    {
      id: '1003',
      content: 'I\'ve been playing a lot of Valorant lately!',
      authorId: '3',
      channelId: '101',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      edited: true,
      deleted: false,
      reactions: [
        {
          emoji: '🎯',
          count: 1,
          users: ['1'],
        },
      ],
      attachments: [],
      readBy: ['1', '2', '3'],
      mentions: [],
      pinned: false,
    },
  ],
  '102': [
    {
      id: '1004',
      content: 'Anyone up for some Valorant games tonight?',
      authorId: '4',
      channelId: '102',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [
        {
          emoji: '👍',
          count: 2,
          users: ['1', '3'],
        },
      ],
      attachments: [],
      readBy: ['1', '3', '4'],
      mentions: [],
      pinned: false,
    },
  ],
  '104': [
    {
      id: '1005',
      content: 'Hello study buddies! Let\'s ace this semester!',
      authorId: '2',
      channelId: '104',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [
        {
          emoji: '📝',
          count: 2,
          users: ['1', '5'],
        },
      ],
      attachments: [],
      readBy: ['1', '2', '5'],
      mentions: [],
      pinned: true,
    },
  ],
};

// Mock direct messages
export const mockDirectMessages: Record<string, DirectMessage[]> = {
  // Conversation between users 1 and 2
  '1-2': [
    {
      id: '2001',
      content: 'Hey Jane, how are you doing?',
      authorId: '1',
      recipientId: '2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [],
      attachments: [],
      readBy: ['1', '2'],
      mentions: [],
      pinned: false,
    },
    {
      id: '2002',
      content: 'I\'m good John! Just working on some projects. How about you?',
      authorId: '2',
      recipientId: '1',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [
        {
          emoji: '👍',
          count: 1,
          users: ['1'],
        },
      ],
      attachments: [],
      readBy: ['1', '2'],
      mentions: [],
      pinned: false,
    },
  ],
  // Conversation between users 1 and 3
  '1-3': [
    {
      id: '2003',
      content: 'Are you joining the Valorant session tonight?',
      authorId: '1',
      recipientId: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [],
      attachments: [],
      readBy: ['1', '3'],
      mentions: [],
      pinned: false,
    },
    {
      id: '2004',
      content: 'Yeah, I\'ll be there! Looking forward to it.',
      authorId: '3',
      recipientId: '1',
      timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
      edited: false,
      deleted: false,
      reactions: [
        {
          emoji: '🎮',
          count: 1,
          users: ['1'],
        },
      ],
      attachments: [],
      readBy: ['1'],
      mentions: [],
      pinned: false,
    },
  ],
};

// Helper functions to get mock data
export const getUser = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getServer = (id: string): Server | undefined => {
  return mockServers.find(server => server.id === id);
};

export const getChannel = (id: string): Channel | undefined => {
  for (const server of mockServers) {
    const channel = server.channels.find(channel => channel.id === id);
    if (channel) {
      return channel;
    }
  }
  return undefined;
};

export const getMessages = (channelId: string): Message[] => {
  return mockMessages[channelId] || [];
};

export const getDirectMessages = (userId1: string, userId2: string): DirectMessage[] => {
  const key1 = `${userId1}-${userId2}`;
  const key2 = `${userId2}-${userId1}`;
  return mockDirectMessages[key1] || mockDirectMessages[key2] || [];
};

export const getUserServers = (userId: string): Server[] => {
  return mockServers.filter(server => server.members.includes(userId));
};

export const getDirectMessageUsers = (userId: string): User[] => {
  const dmUsers = new Set<string>();
  
  // Find all users this user has DMs with
  Object.keys(mockDirectMessages).forEach(key => {
    const [user1, user2] = key.split('-');
    if (user1 === userId) {
      dmUsers.add(user2);
    } else if (user2 === userId) {
      dmUsers.add(user1);
    }
  });
  
  return mockUsers.filter(user => dmUsers.has(user.id));
};