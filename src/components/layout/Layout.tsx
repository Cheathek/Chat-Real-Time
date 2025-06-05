import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import ServerSidebar from "@/components/navigation/ServerSidebar";
import ChannelSidebar from "@/components/navigation/ChannelSidebar";
import MobileNavigation from "@/components/navigation/MobileNavigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-[#313338] flex flex-col items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#313338] text-gray-100 overflow-hidden">
      {/* Server sidebar - always visible */}
      <ServerSidebar />

      {/* Channel sidebar - hidden on mobile */}
      <div className="hidden md:flex flex-col w-60 bg-[#2B2D31] flex-shrink-0">
        <ChannelSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>

      {/* Mobile navigation - visible only on mobile */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;
