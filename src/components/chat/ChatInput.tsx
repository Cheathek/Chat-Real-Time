import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Smile, Plus, Gift, AArrowDown as GIF, Paperclip, Send } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const ChatInput = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { sendMessage, activeChannel, activeDmUser, startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      startTyping();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping();
      }
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, startTyping, stopTyping]);

  // Handle file selection
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 50 * 1024 * 1024; // 50MB limit

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    try {
      // Convert files to attachments
      const uploadedAttachments = await Promise.all(
        attachments.map(async file => ({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server upload
          type: file.type,
          size: file.size
        }))
      );

      await sendMessage(message, uploadedAttachments);
      setMessage('');
      setAttachments([]);
      
      // Reset typing status
      setIsTyping(false);
      stopTyping();
      
      // Focus textarea
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChannel && !activeDmUser) {
    return null;
  }

  const recipientName = activeDmUser ? activeDmUser.username : `#${activeChannel?.name}`;

  return (
    <div className="px-4 py-3 bg-[#313338] border-t border-[#232428]">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative group bg-[#2E3035] rounded p-2 flex items-center gap-2"
            >
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute bottom-2 left-2 flex items-center space-x-1">
          <button className="text-gray-400 hover:text-gray-100 p-2 rounded-full hover:bg-[#36393F]">
            <Plus size={20} />
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`${t('chat.typeMessage')} ${recipientName}`}
          className={cn(
            "w-full resize-none bg-[#383A40] text-gray-100 rounded-md px-12 py-2.5 outline-none max-h-[200px]",
            "placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500"
          )}
          rows={1}
        />
        
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                  <Gift size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Nitro Gift</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                  <GIF size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">GIF Picker</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]"
                >
                  <Paperclip size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-100 p-1 rounded-full hover:bg-[#36393F]">
                  <Smile size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {(message.trim().length > 0 || attachments.length > 0) && (
            <button 
              onClick={handleSendMessage}
              className="text-white bg-[#5865F2] p-1 rounded-full hover:bg-[#4752C4] transition-colors"
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;