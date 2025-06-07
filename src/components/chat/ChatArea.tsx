import { useChat } from "@/context/ChatContext";
import { ArrowLeft } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatAreaProps {
  onBack?: () => void;
  className?: string;
}

const ChatArea = ({ onBack, className }: ChatAreaProps) => {
  const { activeChannel, activeDmUser } = useChat();
  const isMobile = window.innerWidth <= 768;

  if (!activeChannel && !activeDmUser) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Fixed header */}
      <div className="flex items-center h-12 px-4 border-b border-[#2D2F32] bg-[#313338] flex-shrink-0">
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-gray-200 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <ChatHeader />
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ChatMessages />
      </div>

      {/* Fixed input area */}
      <div className="mt-auto flex-shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatArea;
