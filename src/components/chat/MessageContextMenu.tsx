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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageContextMenuProps {
  message: Message | DirectMessage;
  children: React.ReactNode;
}

const MessageContextMenu = ({ message, children }: MessageContextMenuProps) => {
  const { toast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
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
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    deleteMessage(message.id);
    setShowDeleteAlert(false);
  };

  const handleReply = () => {
    setReplyingTo(message);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
      duration: 1700,
      className:
        "bg-[#1e1f22]/80 backdrop-blur-md border-[#42444a]/50 text-[#f2f3f5] shadow-lg",
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
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
        <ContextMenuContent className="w-52 bg-[#18191c]/80 backdrop-blur-md border-[#2f3136]/50 text-gray-100 shadow-lg">
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

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-[#313338]/95 backdrop-blur-md border border-[#2f3136]/50 text-gray-100 shadow-lg max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-[17px] font-medium text-white">
              Delete Message
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#b5bac1] mt-1 text-[15px]">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-end gap-4 mt-5">
            <AlertDialogCancel
              className="
          m-0 px-4 py-1.5
          bg-transparent hover:bg-[#393b41]
          text-[#dbdee1] hover:text-white
          rounded-md
          border-0
          transition-colors
          focus:ring-0
        "
              onClick={() => setShowDeleteAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="
          bg-transparent hover:bg-red-500/20
          text-red-400 hover:text-red-300
          rounded-md
          border-0
          transition-colors
          focus:ring-0
        "
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessageContextMenu;
