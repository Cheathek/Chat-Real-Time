import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Trash, Reply, Copy, MoreVertical } from "lucide-react";
import { Message, DirectMessage } from "@/types";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MessageContextMenuProps {
  message: Message | DirectMessage;
  children: React.ReactNode;
}

const MessageContextMenu = ({ message, children }: MessageContextMenuProps) => {
  const { toast } = useToast();
  const [, setIsOpen] = useState(false);
  const { user } = useAuth();
  const {
    setEditingMessageId,
    setMessage,
    setOriginalMessage,
    setReplyingTo,
    deleteMessage,
  } = useChat();
  const isOwnMessage = user?.id === message.authorId;

  const handleEdit = () => {
    setEditingMessageId(message.id);
    setOriginalMessage(message.content);
    setMessage(message.content);
  };

  const handleDelete = () => {
    let toastDismiss: () => void;

    const { dismiss } = toast({
      title: "Delete Message",
      description: "Are you sure you want to delete this message?",
      duration: 5000,
      variant: "destructive",
      className: "bg-[#313338] border-[#2f3136] text-gray-100",
      action: (
        <div className="flex gap-2">
          <button
            onClick={() => {
              deleteMessage(message.id);
              toastDismiss?.();
            }}
            className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toastDismiss?.()}
            className="px-3 py-1 text-xs font-medium text-white bg-[#2b2d31] rounded hover:bg-[#2b2d31]/90"
          >
            Cancel
          </button>
        </div>
      ),
      onOpenChange: (open: boolean) => {
        if (!open) {
          toastDismiss?.();
        }
      },
    });

    // Store the dismiss function
    toastDismiss = dismiss;
  };

  const handleReply = () => {
    setReplyingTo(message);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
      duration: 2000,
      className: "bg-[#313338] border-[#2f3136] text-gray-100",
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <ContextMenu onOpenChange={setIsOpen}>
      <ContextMenuTrigger asChild>
        <div onClick={handleClick} className="relative">
          {children}
          <button
            className="absolute right-2 top-2 p-1.5 rounded-full 
              bg-[#2f3136] text-gray-400 opacity-0 
              group-hover:opacity-100 md:hidden 
              hover:bg-[#36393f] hover:text-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52 bg-[#18191c] border-[#2f3136] text-gray-100">
        <ContextMenuItem
          className="hover:bg-[#5865F2] focus:bg-[#5865F2] cursor-pointer"
          onClick={handleReply}
        >
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </ContextMenuItem>

        {isOwnMessage && (
          <ContextMenuItem
            className="hover:bg-[#5865F2] focus:bg-[#5865F2] cursor-pointer"
            onClick={handleEdit}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </ContextMenuItem>
        )}

        <ContextMenuItem
          className="hover:bg-[#5865F2] focus:bg-[#5865F2] cursor-pointer"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </ContextMenuItem>

        {isOwnMessage && (
          <ContextMenuItem
            className="text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white cursor-pointer"
            onClick={handleDelete}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
