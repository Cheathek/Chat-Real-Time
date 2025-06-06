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

interface MessageContextMenuProps {
  message: Message | DirectMessage;
  children: React.ReactNode;
}

const MessageContextMenu = ({ message, children }: MessageContextMenuProps) => {
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
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id);
    }
  };

  const handleReply = () => {
    setReplyingTo(message);
    setMessage(`@${message.authorId} `);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
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
