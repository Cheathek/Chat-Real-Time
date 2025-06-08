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
import CustomAudioPlayer from "./CustomAudioPlayer";
import CustomVideoPlayer from "./CustomVideoPlayer";

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
            className="max-w-full sm:max-w-[400px] max-h-[300px] rounded-lg object-contain cursor-pointer 
            hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </AttachmentPreview>
      );
    }

    if (isVideo) {
      return (
        <div className="w-full max-w-[400px]">
          <CustomVideoPlayer
            src={attachment.url}
            title={attachment.name}
            fileSize={attachment.size}
            className="w-full"
          />
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="w-full max-w-[350px] min-w-[200px]">
          <CustomAudioPlayer
            src={attachment.url}
            title={attachment.name}
            fileSize={attachment.size}
            className="w-full"
          />
        </div>
      );
    }
    // For other file types
    return (
      <div className="flex items-center gap-2 p-2 bg-[#2E3035] rounded-lg max-w-full sm:max-w-[350px]">
        <FileIcon size={16} className="text-[#5865F2] flex-shrink-0" />
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#DCDDDE] hover:underline truncate"
        >
          {attachment.name}
        </a>
      </div>
    );
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Optional: Add highlight effect
      element.classList.add("bg-opacity-20", "bg-[#5865F2]");
      setTimeout(() => {
        element.classList.remove("bg-opacity-20", "bg-[#5865F2]");
      }, 2000);
    }
  };

  const renderMessage = (message: Message | DirectMessage) => {
    const author = getUserById(message.authorId);
    const isOwnMessage = user?.id === message.authorId;
    const hasMediaAttachment = message.attachments.some(
      (attachment) =>
        attachment.type.startsWith("image/") ||
        attachment.type.startsWith("video/") ||
        attachment.type.startsWith("audio/")
    );

    // Get replied message details if exists
    const repliedMessage = message.replyTo
      ? {
          author: getUserById(message.replyTo.authorId),
          content: message.replyTo.content,
        }
      : null;

    return (
      <MessageContextMenu key={message.id} message={message}>
        <div
          id={`message-${message.id}`}
          className={`px-4 py-1 group ${
            isOwnMessage ? "flex flex-row-reverse" : "flex"
          }`}
        >
          {/* Only show avatar for other users' messages */}
          {!isOwnMessage && (
            <div className={`flex-shrink-0 mr-2 mt-12`}>
              <UserAvatar user={author} size="sm" />
            </div>
          )}

          {/* Rest of the message content remains the same */}
          <div
            className={`flex-1 min-w-0 flex ${
              isOwnMessage ? "justify-end" : ""
            }`}
          >
            <div className="relative max-w-fit">
              {/* Message bubble */}
              <div
                className={`${
                  !hasMediaAttachment &&
                  (isOwnMessage ? "bg-[#5865F2]" : "bg-[#40444B]")
                } rounded-xl overflow-hidden`}
              >
                {/* Reply preview remains the same */}
                {repliedMessage && (
                  <div
                    onClick={() =>
                      message.replyTo?.id && scrollToMessage(message.replyTo.id)
                    }
                    className="flex mx-2 mt-2 cursor-pointer group max-w-full"
                  >
                    <div className="w-0.5 bg-[#00a8fc] rounded-l flex-shrink-0" />
                    <div className="select-none flex-1 bg-[#1E1F22] bg-opacity-70 px-2 py-1 rounded-r hover:bg-opacity-90 transition-colors min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#00a8fc] text-xs font-medium truncate">
                          {repliedMessage.author.username}
                        </span>
                        <span className="text-gray-400 text-xs line-clamp-1">
                          {repliedMessage.content || "Attachment"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Updated message content layout */}
                <div className="px-3 py-1">
                  {!isOwnMessage && (
                    <div className="select-none text-sm font-semibold text-[#00a8fc] mb-1">
                      {author.username}
                    </div>
                  )}

                  {/* Message content and timestamp wrapper */}
                  <div className="flex justify-between items-end w-full">
                    <div className="text-sm text-[#DCDDDE] mb-2 whitespace-pre-wrap break-words max-w-[85%]">
                      {message.content}
                    </div>
                    <div className="select-none text-xs text-gray-400 flex-shrink-0 ml-4 mt-5">
                      {message.edited && (
                        <span className="text-gray-400 mr-1">edited</span>
                      )}
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>

                  {/* Attachments section remains the same */}
                  {message.attachments.length > 0 && (
                    <div className="mt-2 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-1">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="w-full">
                          {renderAttachment(attachment)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
          {displayMessages.map((msg) => renderMessage(msg))}
          {renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatMessages;
