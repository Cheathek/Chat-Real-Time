import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Server, Channel, User, Message, DirectMessage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import socket from "@/lib/socket";
import {
  getMessages,
  getDirectMessages,
  getUserServers,
  getDirectMessageUsers,
} from "@/lib/mockData";

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

  setMessage: (content: string) => void;
  sendMessage: (message: {
    content: string;
    attachments?: File[];
  }) => Promise<void>;
  setEditingMessageId: (id: string | null) => void;
  setOriginalMessage: (content: string) => void;
  setActiveServer: (server: Server | null) => void;
  setActiveChannel: (channel: Channel | null) => void;
  setActiveDmUser: (user: User | null) => void;
  markAsRead: (messageId: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  updateMessage: (messageId: string, newContent: string) => void;
  editingMessageId: string | null;
  originalMessage: string;
  message: string;

  replyingTo: {
    id: string;
    username: string;
    content: string;
    authorId: string;
  } | null;
  setReplyingTo: (message: Message | DirectMessage | null) => void;
  deleteMessage: (messageId: string) => void;
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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>(""); // Initialize as empty string
  const [originalMessage, setOriginalMessage] = useState<string>("");
  const [replyingTo, setInternalReplyingTo] = useState<{
    id: string;
    username: string;
    content: string;
    authorId: string;
  } | null>(null);

  const getUsernameById = (userId: string): string => {
    const dmUser = directMessageUsers.find((u) => u.id === userId);
    if (dmUser) return dmUser.username;

    return `User ${userId}`;
  };

  const setReplyingTo = (message: Message | DirectMessage | null) => {
    if (!message) {
      setInternalReplyingTo(null);
      return;
    }
    setInternalReplyingTo({
      id: message.id,
      username: getUsernameById(message.authorId), // Get real username
      content: message.content,
      authorId: message.authorId,
    });
  };

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
      socket.on("message", (message: Message) => {
        if (activeChannel && message.channelId === activeChannel.id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      // Listen for direct messages
      socket.on("directMessage", (message: DirectMessage) => {
        if (
          user &&
          activeDmUser &&
          ((message.authorId === user.id &&
            message.recipientId === activeDmUser.id) ||
            (message.authorId === activeDmUser.id &&
              message.recipientId === user.id))
        ) {
          setDirectMessages((prev) => [...prev, message]);
        }
      });

      // Listen for typing indicators
      socket.on("typing", ({ userId, channelId, isTyping }) => {
        if (activeChannel && channelId === activeChannel.id) {
          setTypingUsers((prev) => {
            const channelTyping = prev[channelId] || [];
            if (isTyping && !channelTyping.includes(userId)) {
              return {
                ...prev,
                [channelId]: [...channelTyping, userId],
              };
            } else if (!isTyping && channelTyping.includes(userId)) {
              return {
                ...prev,
                [channelId]: channelTyping.filter((id) => id !== userId),
              };
            }
            return prev;
          });
        }
      });

      // Clean up
      return () => {
        socket.off("message");
        socket.off("directMessage");
        socket.off("typing");
      };
    }
  }, [isAuthenticated, activeChannel, activeDmUser, user]);

  // Send message function
  const sendMessage = async (message: {
    content: string;
    attachments?: File[];
  }) => {
    const attachments = message.attachments || [];
    if (!message.content?.trim() && attachments.length === 0) return;

    // Upload attachments first
    const uploadedAttachments = await Promise.all(
      attachments.map(async (file) => {
        // Simulate file upload - replace with your actual upload logic
        const url = URL.createObjectURL(file);
        return {
          id: Date.now().toString(),
          url,
          name: file.name,
          type: file.type,
          size: file.size,
          duration:
            file.type.startsWith("video/") || file.type.startsWith("audio/")
              ? 0
              : 0, // Add default duration
        };
      })
    );

    const newMessage = {
      id: Date.now().toString(),
      content: message.content.trim(),
      authorId: user?.id || "",
      timestamp: new Date().toISOString(),
      attachments: uploadedAttachments,
      reactions: [],
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            authorId: replyingTo.authorId,
            content: replyingTo.content,
          }
        : null,
      edited: false,
      deleted: false,
      mentions: [],
      pinned: false,
      ...(activeChannel
        ? {
            type: "channel" as const,
            channelId: activeChannel.id,
          }
        : {
            type: "directMessage" as const,
            recipientId: activeDmUser?.id || "",
            readBy: [user?.id || ""],
          }),
    };

    if (activeChannel) {
      const channelMessage: Message = {
        id: newMessage.id,
        content: newMessage.content,
        authorId: newMessage.authorId,
        channelId: activeChannel.id,
        timestamp: newMessage.timestamp,
        edited: newMessage.edited,
        deleted: newMessage.deleted,
        reactions: newMessage.reactions,
        attachments: newMessage.attachments,
        readBy: [],
        mentions: newMessage.mentions,
        pinned: newMessage.pinned,
        replyTo: newMessage.replyTo,
      };
      setMessages((prev) => [...prev, channelMessage]);
    } else {
      setDirectMessages((prev) => [...prev, newMessage as DirectMessage]);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      await socket.markAsRead(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
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

  const updateMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    );
    setDirectMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    );
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setDirectMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const value = {
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
    stopTyping,
    updateMessage,
    editingMessageId,
    setEditingMessageId,
    message,
    setMessage,
    originalMessage,
    setOriginalMessage,
    replyingTo,
    setReplyingTo,
    deleteMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
