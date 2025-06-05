import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/lib/mockData";
import { FileIcon } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { Message, DirectMessage, User, Attachment } from "@/types";
import AttachmentPreview from "./AttachmentPreview";
import MessageContextMenu from "./MessageContextMenu";

const ChatMessages = () => {
  const { user } = useAuth();
  const { messages, directMessages, activeChannel, activeDmUser, typingUsers } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getUserById = (id: string): User => {
    return (
      mockUsers.find((user) => user.id === id) || {
        id,
        username: "Unknown User",
        email: "",
        avatar: "",
        status: "offline",
        lastSeen: new Date().toISOString(),
      }
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, directMessages]);

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };

  const renderAttachment = (attachment: Attachment) => {
    const isImage = attachment.type.startsWith("image/");
    const isVideo = attachment.type.startsWith("video/");
    const isAudio = attachment.type.startsWith("audio/");

    if (isImage) {
      return (
        <AttachmentPreview attachment={attachment}>
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-[400px] max-h-[300px] rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity"
          />
        </AttachmentPreview>
      );
    }

    if (isVideo) {
      return (
        <AttachmentPreview attachment={attachment}>
          <video
            controls
            className="max-w-[400px] max-h-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          >
            <source src={attachment.url} type={attachment.type} />
          </video>
        </AttachmentPreview>
      );
    }

    if (isAudio) {
      return (
        <audio controls className="w-full max-w-[240px]">
          <source src={attachment.url} type={attachment.type} />
        </audio>
      );
    }

    // For other file types
    return (
      <div className="flex items-center gap-2 text-blue-500 hover:underline">
        <FileIcon size={16} />
        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
          {attachment.name}
        </a>
      </div>
    );
  };

  const renderMessage = (
    message: Message | DirectMessage,
    isDm: boolean = false // Renamed for clarity and used below
  ) => {
    const author = getUserById(message.authorId);
    const isOwnMessage = user?.id === message.authorId;

    return (
      <MessageContextMenu message={message}>
        <div
          key={message.id}
          className={`px-4 py-1 group ${
            isOwnMessage ? "flex flex-row-reverse" : "flex"
          }`}
        >
          <div
            className={`flex-shrink-0 ${isOwnMessage ? "ml-2" : "mr-2"} mt-1`}
          >
            <UserAvatar user={author} size="sm" />
          </div>

          {/* Message bubble container - removed background */}
          <div
            className={`flex-1 min-w-0 flex ${
              isOwnMessage ? "justify-end" : ""
            }`}
          >
            <div className="max-w-[75%] px-2 py-1.5">
              {/* Display read receipts only for DMs */}
              {isDm &&
                "readBy" in message &&
                "recipientId" in message &&
                message.readBy.includes(message.recipientId) && (
                  <div className="text-xs text-gray-400 mt-1">Seen</div>
                )}

              {/* Username for others' messages */}
              {!isOwnMessage && (
                <div className="text-sm font-semibold text-[#DCDDDE] mb-1">
                  {author.username}
                </div>
              )}

              {/* Message content */}
              <div className="text-sm text-[#DCDDDE]">{message.content}</div>

              {/* Attachments - without background */}
              {message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="inline-block">
                      {renderAttachment(attachment)}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Reactions */}
              {message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.reactions.map((reaction, index) => (
                    <div
                      key={index}
                      className="bg-[#3E4147] hover:bg-[#45494F] rounded-full px-2 py-0.5 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-gray-300">{reaction.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-gray-400 mt-1 text-right">
                {message.edited && (
                  <span className="text-gray-500 mr-1">(edited)</span>
                )}
                {formatMessageTime(message.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </MessageContextMenu>
    );
  };

  const currentTypingUsers = activeChannel
    ? (typingUsers[activeChannel.id] || []).map((id) => getUserById(id))
    : [];

  const renderTypingIndicator = () => {
    if (currentTypingUsers.length === 0) return null;

    const names = currentTypingUsers.map((user) => user.username).join(", ");
    return (
      <div className="px-4 py-1 text-gray-400 text-xs italic">
        <div className="flex items-center">
          <div className="bg-[#2E3035] rounded-full px-2 py-1">
            {names}{" "}
            {currentTypingUsers.length === 1 ? "is typing" : "are typing"}
            <span className="inline-block animate-pulse ml-1">...</span>
          </div>
        </div>
      </div>
    );
  };

  const displayMessages = activeDmUser ? directMessages : messages;

  if (!activeChannel && !activeDmUser) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#313338] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h3 className="text-xl font-bold text-[#DCDDDE] mb-2">
            Direct Messages
          </h3>
          <p className="text-gray-400 mb-4">
            Select a friend to start a conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#313338] scrollbar-thin">
      {/* Date separator */}
      <div className="px-4 py-2 sticky top-0 z-10 bg-[#313338] shadow-sm">
        <div className="flex items-center justify-center">
          <div className="h-px bg-[#3F4147] flex-1" />
          <span className="px-2 text-xs text-gray-400">
            {format(new Date(), "MMMM d, yyyy")}
          </span>
          <div className="h-px bg-[#3F4147] flex-1" />
        </div>
      </div>

      {/* Messages */}
      {displayMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="w-full max-w-md text-center">
            <h3 className="text-xl font-bold text-[#DCDDDE] mb-2">
              {activeDmUser
                ? `Start a conversation with ${activeDmUser.username}`
                : `Welcome to #${activeChannel?.name}`}
            </h3>
            <p className="text-gray-400">
              No messages here yet. Start the conversation!
            </p>
          </div>
        </div>
      ) : (
        <>
          {displayMessages.map((msg) => renderMessage(msg, !!activeDmUser))}
          {renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;
