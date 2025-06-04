import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Server, Channel, User, Message, DirectMessage } from '@/types';
import { useAuth } from '@/context/AuthContext';
import socket from '@/lib/socket';
import {
  getMessages,
  getDirectMessages,
  getUserServers,
  getDirectMessageUsers
} from '@/lib/mockData';

interface ChatContextType {
  servers: Server[];
  activeServer: Server | null;
  activeChannel: Channel | null;
  activeDmUser: User | null;
  messages: Message[];
  directMessages: DirectMessage[];
  directMessageUsers: User[];
  isLoading: boolean;
  typingUsers: Record<string, string[]>;
  
  setActiveServer: (server: Server | null) => void;
  setActiveChannel: (channel: Channel | null) => void;
  setActiveDmUser: (user: User | null) => void;
  sendMessage: (content: string, attachments?: any[]) => Promise<void>;
  markAsRead: (messageId: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [servers, setServers] = useState<Server[]>([]);
  const [activeServer, setActiveServer] = useState<Server | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeDmUser, setActiveDmUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [directMessageUsers, setDirectMessageUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  // Update socket's user when auth state changes
  useEffect(() => {
    socket.setCurrentUser(user);
  }, [user]);
  
  // Initialize chat data
  useEffect(() => {
    if (isAuthenticated && user) {
      // Get user's servers
      const userServers = getUserServers(user.id);
      setServers(userServers);
      
      // Set default active server and channel if available
      if (userServers.length > 0 && !activeServer) {
        const server = userServers[0];
        setActiveServer(server);
        
        if (server.channels.length > 0 && !activeChannel) {
          setActiveChannel(server.channels[0]);
        }
      }
      
      // Get direct message users
      const dmUsers = getDirectMessageUsers(user.id);
      setDirectMessageUsers(dmUsers);
      
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);
  
  // Load messages when active channel changes
  useEffect(() => {
    if (activeChannel) {
      setIsLoading(true);
      
      // Get channel messages
      const channelMessages = getMessages(activeChannel.id);
      setMessages(channelMessages);
      
      // Reset direct messages
      setDirectMessages([]);
      setActiveDmUser(null);
      
      // Join the channel
      socket.joinChannel(activeChannel.id);
      
      setIsLoading(false);
    }
  }, [activeChannel]);
  
  // Load direct messages when active DM user changes
  useEffect(() => {
    if (activeDmUser && user) {
      setIsLoading(true);
      
      // Get direct messages
      const dms = getDirectMessages(user.id, activeDmUser.id);
      setDirectMessages(dms);
      
      // Reset channel messages
      setMessages([]);
      setActiveServer(null);
      setActiveChannel(null);
      
      setIsLoading(false);
    }
  }, [activeDmUser, user]);
  
  // Socket event listeners
  useEffect(() => {
    if (isAuthenticated) {
      // Listen for new messages
      socket.on('message', (message: Message) => {
        if (activeChannel && message.channelId === activeChannel.id) {
          setMessages(prev => [...prev, message]);
        }
      });
      
      // Listen for direct messages
      socket.on('directMessage', (message: DirectMessage) => {
        if (
          user && 
          activeDmUser && 
          ((message.authorId === user.id && message.recipientId === activeDmUser.id) ||
           (message.authorId === activeDmUser.id && message.recipientId === user.id))
        ) {
          setDirectMessages(prev => [...prev, message]);
        }
      });
      
      // Listen for typing indicators
      socket.on('typing', ({ userId, channelId, isTyping }) => {
        if (activeChannel && channelId === activeChannel.id) {
          setTypingUsers(prev => {
            const channelTyping = prev[channelId] || [];
            if (isTyping && !channelTyping.includes(userId)) {
              return {
                ...prev,
                [channelId]: [...channelTyping, userId]
              };
            } else if (!isTyping && channelTyping.includes(userId)) {
              return {
                ...prev,
                [channelId]: channelTyping.filter(id => id !== userId)
              };
            }
            return prev;
          });
        }
      });
      
      // Clean up
      return () => {
        socket.off('message');
        socket.off('directMessage');
        socket.off('typing');
      };
    }
  }, [isAuthenticated, activeChannel, activeDmUser, user]);
  
  // Send message function
  const sendMessage = async (content: string, attachments: any[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    try {
      if (activeChannel) {
        await socket.sendMessage(activeChannel.id, content, attachments);
      } else if (activeDmUser && user) {
        await socket.sendDirectMessage(activeDmUser.id, content, attachments);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw to allow handling by UI components
    }
  };
  
  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      await socket.markAsRead(messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  // Typing indicator functions
  const startTyping = () => {
    if (activeChannel) {
      socket.startTyping(activeChannel.id);
    }
  };
  
  const stopTyping = () => {
    if (activeChannel) {
      socket.stopTyping(activeChannel.id);
    }
  };
  
  return (
    <ChatContext.Provider
      value={{
        servers,
        activeServer,
        activeChannel,
        activeDmUser,
        messages,
        directMessages,
        directMessageUsers,
        isLoading,
        typingUsers,
        setActiveServer,
        setActiveChannel,
        setActiveDmUser,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};