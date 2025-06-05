import { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Smile,
  PlusCircle,
  Gift,
  AArrowDown as GIF,
  Paperclip,
  SendHorizonal,
  X,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const ChatInput = () => {
  const { toast } = useToast();
  const {
    message,
    setMessage,
    editingMessageId,
    setEditingMessageId,
    updateMessage,
    originalMessage,
    setOriginalMessage,
    replyingTo,
    setReplyingTo,
    sendMessage,
    activeChannel,
    activeDmUser,
  } = useChat();

  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
      }
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 50 * 1024 * 1024; // 50MB limit

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!message?.trim() && attachments.length === 0) return;

    if (editingMessageId) {
      updateMessage(editingMessageId, message);
      setEditingMessageId(null);
    } else {
      await sendMessage({
        content: message,
        attachments: attachments,
      });
      setReplyingTo(null);
    }

    setMessage("");
    setAttachments([]);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setMessage(originalMessage);
    setOriginalMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === "Escape" && editingMessageId) {
      handleCancelEdit();
    }
  };

  if (!activeChannel && !activeDmUser) {
    return null;
  }

  const recipientName = activeDmUser
    ? activeDmUser.username
    : `#${activeChannel?.name}`;

  return (
    <div className="px-2 md:px-4 py-2 md:py-3 bg-[#313338] border-t border-[#232428]">
      {/* Show reply indicator */}
      {replyingTo && (
        <div className="flex items-center justify-between px-2 py-1 bg-[#3F4147] rounded-t text-xs text-gray-300">
          <div className="flex items-center gap-2">
            {/* <Reply className="w-4 h-4" /> */}
            <span>Replying to {replyingTo.authorId}</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {editingMessageId && (
        <div className="flex items-center justify-between px-2 py-1 bg-[#3F4147] rounded-t text-xs text-gray-300">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <span className="text-[#5865F2] font-medium">
                Editing message
              </span>
            </div>
            <div className="text-xs text-gray-400 break-words max-w-[300px] line-clamp-2">
              {originalMessage || "No message content"}
            </div>
          </div>
          <button
            onClick={handleCancelEdit}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative group bg-[#2E3035] rounded p-2 flex items-center gap-2 max-w-full"
            >
              <span className="text-sm truncate max-w-[120px] md:max-w-[200px]">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-white text-sm md:text-base"
              >
                <X size={16} className="w-2 h-2 md:w-3 md:h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-center">
        {/* Left side buttons */}
        <div className="absolute left-2 flex items-center space-x-1">
          <button className="text-gray-400 hover:text-gray-100 p-1 md:p-1.5 rounded-full hover:bg-[#36393F]">
            <PlusCircle size={18} className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            editingMessageId
              ? "Edit your message..."
              : `Message ${recipientName}`
          }
          className={cn(
            "w-full resize-none bg-[#383A40] text-gray-100 rounded-md",
            "pl-10 pr-24 py-2 md:py-2.5 outline-none max-h-[200px]",
            "placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500",
            "text-sm md:text-base",
            editingMessageId && "rounded-t-none"
          )}
          rows={1}
        />

        {/* Right side icons */}
        <div className="absolute right-2 flex items-center space-x-1 md:space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Mobile: Only show essential icons */}
          <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                    <Gift size={18} className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Nitro Gift</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                    <GIF size={18} className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">GIF Picker</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Always show these icons */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]"
                >
                  <Paperclip size={18} className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                  <Smile size={18} className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {(message.trim().length > 0 || attachments.length > 0) && (
            <button
              onClick={handleSendMessage}
              className="text-[#5865F2] hover:text-[#4752C4] p-1 md:p-1.5 rounded-full transition-colors"
            >
              <SendHorizonal
                size={18}
                className="w-4 h-4 md:w-5 md:h-5 fill-current"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
