import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Trash, Reply, Copy } from "lucide-react";
import { Message, DirectMessage } from "@/types";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

interface MessageContextMenuProps {
  message: Message | DirectMessage;
  children: React.ReactNode;
}

const MessageContextMenu = ({ message, children }: MessageContextMenuProps) => {
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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
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
