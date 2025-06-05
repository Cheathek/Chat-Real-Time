import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/lib/mockData";
import { Check, Pencil, FileIcon } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { Message, DirectMessage, User, Attachment } from "@/types";
import AttachmentPreview from "./AttachmentPreview";

const ChatMessages = () => {
  const { user } = useAuth();
  const { messages, directMessages, activeChannel, activeDmUser, typingUsers } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to get user from ID
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, directMessages]);

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MM/dd/yyyy h:mm a");
    }
  };

  // Render attachment preview
  const renderAttachment = (attachment: Attachment) => {
    const isImage = attachment.type.startsWith("image/");
    const isVideo = attachment.type.startsWith("video/");
    const isAudio = attachment.type.startsWith("audio/");

    if (isImage || isVideo) {
      return <AttachmentPreview attachment={attachment} />;
    }

    if (isAudio) {
      return (
        <div className="mt-2">
          <audio controls className="w-full max-w-md">
            <source src={attachment.url} type={attachment.type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // Default file attachment
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-[#2E3035] hover:bg-[#36393F] transition-colors"
      >
        <FileIcon className="w-6 h-6 text-[#5865F2]" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-gray-400">
            {Math.round(attachment.size / 1024)} KB
          </p>
        </div>
      </a>
    );
  };

  // Render message component
  const renderMessage = (
    message: Message | DirectMessage,
    isDirectMessage: boolean = false
  ) => {
    const author = getUserById(message.authorId);
    const isOwnMessage = user?.id === message.authorId;

    return (
      <div
        key={message.id}
        className={`px-4 py-2 hover:bg-[#2E3035] group ${
          isOwnMessage ? "flex flex-row-reverse" : "flex"
        }`}
      >
        <div
          className={`mr-3 mt-1 flex-shrink-0 ${
            isOwnMessage ? "ml-3 mr-0" : ""
          }`}
        >
          <UserAvatar user={author} />
        </div>
        <div className={`flex-1 min-w-0 ${isOwnMessage ? "items-end" : ""}`}>
          <div
            className={`flex items-baseline ${
              isOwnMessage ? "flex-row-reverse" : ""
            }`}
          >
            <h4
              className={`font-medium text-white ${
                isOwnMessage ? "ml-2" : "mr-2"
              }`}
            >
              {author.username}
            </h4>
            <span className="text-xs text-gray-400">
              {formatMessageTime(message.timestamp)}
            </span>
            <div
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                isOwnMessage ? "mr-2" : "ml-2"
              }`}
            >
              <button className="text-gray-400 hover:text-white p-1">
                <Pencil size={14} />
              </button>
            </div>
          </div>
          <div
            className={`text-sm text-gray-300 ${
              isOwnMessage ? "text-right" : ""
            }`}
          >
            {message.content}
            {message.edited && (
              <span className="text-xs text-gray-400 ml-1">(edited)</span>
            )}
          </div>

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div
              className={`flex flex-col ${
                isOwnMessage ? "items-end" : "items-start"
              }`}
            >
              {message.attachments.map((attachment, index) => (
                <div key={index}>{renderAttachment(attachment)}</div>
              ))}
            </div>
          )}

          {/* Message Reactions */}
          {message.reactions.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 mt-1 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {message.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-[#2E3035] hover:bg-[#36393F] rounded-full px-2 py-1 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-400">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Read receipts for DMs */}
          {isDirectMessage &&
            (message as DirectMessage).readBy.includes(
              (message as DirectMessage).recipientId
            ) && (
              <div
                className={`flex items-center mt-1 text-gray-400 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <Check size={12} className="mr-1" />
                <span className="text-xs">Seen</span>
              </div>
            )}
        </div>
      </div>
    );
  };

  // Get typing users for the current channel
  const currentTypingUsers = activeChannel
    ? (typingUsers[activeChannel.id] || []).map((id) => getUserById(id))
    : [];

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (currentTypingUsers.length === 0) return null;

    const names = currentTypingUsers.map((user) => user.username).join(", ");
    return (
      <div className="px-4 py-2 text-gray-400 text-sm italic text-right">
        {names} {currentTypingUsers.length === 1 ? "is typing" : "are typing"}
        <span className="inline-block animate-pulse">...</span>
      </div>
    );
  };

  // Determine which messages to show
  const displayMessages = activeDmUser ? directMessages : messages;

  if (!activeChannel && !activeDmUser) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#313338] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Direct Messages</h3>
          <p className="text-gray-400 mb-4">
            Select a friend to start a conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#313338] scrollbar-thin">
      {displayMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">
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
          {displayMessages.map((msg) => renderMessage(msg, !!activeDmUser))}

          {/* Typing indicator */}
          {renderTypingIndicator()}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;
