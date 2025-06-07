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
import type { LucideIcon } from "lucide-react";

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

  // Auto-focus when replying or editing
  useEffect(() => {
    if ((replyingTo || editingMessageId) && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [replyingTo, editingMessageId]);

  // Typing indicator
  useEffect(() => {
    if (message && !isTyping) setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message, isTyping]);

  // Viewport height adjustment
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 50 * 1024 * 1024;
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleSendMessage = async () => {
    if (!message?.trim() && attachments.length === 0) return;
    if (editingMessageId) {
      updateMessage(editingMessageId, message);
      setEditingMessageId(null);
    } else {
      await sendMessage({ content: message, attachments });
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
    if (e.key === "Escape" && editingMessageId) handleCancelEdit();
  };

  const getPlaceholderText = () => {
    if (editingMessageId) return "Edit your message...";
    if (replyingTo) return `Reply to ${replyingTo.username}...`;
    if (activeDmUser) return `Message @${activeDmUser.username}`;
    if (activeChannel) return `Message #${activeChannel.name}`;
    return "Type a message...";
  };

  if (!activeChannel && !activeDmUser) return null;

  return (
    <div className="sticky bottom-0 inset-x-0 z-10 bg-[#313338] border-t border-[#232428]">
      <div className="relative flex flex-col max-h-[50vh] overflow-y-auto px-2 md:px-4 py-2 md:py-3">
        {replyingTo && (
          <div className="flex items-center justify-between px-2 py-1 bg-[#3F4147] rounded-t text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[#DCDDDE]">
                  Replying to{" "}
                  <span className="text-[#5865F2] font-medium">
                    {replyingTo.username}
                  </span>
                </span>
                <span className="text-gray-400 text-xs truncate max-w-[300px]">
                  {replyingTo.content}
                </span>
              </div>
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
              <span className="text-[#5865F2] font-medium">
                Editing message
              </span>
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

        <div className="relative flex items-center min-h-[44px]">
          <div className="absolute left-2 flex items-center space-x-1">
            <button className="text-gray-400 hover:text-gray-100 p-1 md:p-1.5 rounded-full hover:bg-[#36393F]">
              <PlusCircle size={18} className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={getPlaceholderText()}
            className={cn(
              "w-full resize-none bg-[#383A40] text-gray-100 rounded-md",
              "pl-10 pr-24 py-2 md:py-2.5 outline-none max-h-[200px]",
              "placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500",
              "text-sm md:text-base",
              (editingMessageId || replyingTo) && "rounded-t-none"
            )}
            rows={1}
          />

          <div className="absolute right-2 flex items-center space-x-1 md:space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
              <IconButton icon={Gift} tooltip="Nitro Gift" />
              <IconButton icon={GIF} tooltip="GIF Picker" />
            </div>
            <IconButton
              icon={Paperclip}
              tooltip="Attach File"
              onClick={() => fileInputRef.current?.click()}
            />
            <IconButton icon={Smile} tooltip="Emoji" />
            {(message.trim().length > 0 || attachments.length > 0) && (
              <IconButton
                icon={SendHorizonal}
                tooltip="Send Message"
                onClick={handleSendMessage}
                className="text-[#5865F2] hover:text-[#4752C4]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IconButton = ({
  icon: Icon,
  tooltip,
  onClick,
  className,
}: {
  icon: LucideIcon;
  tooltip: string;
  onClick?: () => void;
  className?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]",
            className
          )}
        >
          <Icon size={18} className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ChatInput;
