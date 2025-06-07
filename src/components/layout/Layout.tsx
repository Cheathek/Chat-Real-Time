import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import ServerSidebar from "@/components/navigation/ServerSidebar";
import ChannelSidebar from "@/components/navigation/ChannelSidebar";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import ChatArea from "@/components/chat/ChatArea";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const { activeChannel, activeDmUser } = useChat();
  const [showChat, setShowChat] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (activeChannel || activeDmUser) {
      setShowChat(true);
    }
  }, [activeChannel, activeDmUser]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-[#313338] flex flex-col items-center justify-center p-4">
        {children}
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    if (showChat) {
      return (
        <div className="h-screen bg-[#313338] text-gray-100">
          <ChatArea onBack={() => setShowChat(false)} />
        </div>
      );
    }

    return (
      <div className="flex h-screen bg-[#313338] text-gray-100">
        <ServerSidebar />
        <div className="flex-1 bg-[#2B2D31]">
          <ChannelSidebar />
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-[#313338] text-gray-100 overflow-hidden">
      {/* Server sidebar - always visible */}
      <ServerSidebar />

      {/* Channel sidebar - hidden on mobile */}
      <div className="hidden md:flex flex-col w-60 bg-[#2B2D31] flex-shrink-0">
        <ChannelSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatArea />
      </div>

      {/* Mobile navigation - visible only on mobile */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;
