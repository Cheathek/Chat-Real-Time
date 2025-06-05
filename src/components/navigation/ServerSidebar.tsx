import { useState } from "react";
import { PlusCircle, Bot } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { Server } from "@/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateServerModal from "@/components/modals/CreateServerModal";

const ServerSidebar = () => {
  const { servers, activeServer, setActiveServer, setActiveChannel } =
    useChat();
  const [createServerOpen, setCreateServerOpen] = useState(false);

  const handleServerClick = (server: Server) => {
    setActiveServer(server);
    if (server.channels.length > 0) {
      setActiveChannel(server.channels[0]);
    }
  };

  const handleHomeClick = () => {
    setActiveServer(null);
    setActiveChannel(null);
  };

  return (
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 space-y-2 flex-shrink-0 relative">
      {/* Home Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleHomeClick}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center bg-[#5865F2] text-white transition-all hover:rounded-2xl relative",
                !activeServer && "rounded-2xl"
              )}
            >
              <Bot size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-8 h-0.5 bg-[#35363C] rounded-full my-1" />

      {/* Server List */}
      <div className="flex flex-col items-center space-y-2 overflow-y-auto scrollbar-hide w-full">
        {servers.map((server) => (
          <TooltipProvider key={server.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-full flex justify-center group">
                  {/* Sticky indicator bar - now part of the hover group */}
                  <div
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-full h-0 transition-all z-10",
                      "group-hover:h-5",
                      activeServer?.id === server.id
                        ? "h-10 group-hover:h-10"
                        : ""
                    )}
                  />

                  {/* Server button */}
                  <button
                    onClick={() => handleServerClick(server)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-[#36393F] transition-all",
                      activeServer?.id === server.id
                        ? "rounded-2xl bg-[#5865F2]"
                        : ""
                    )}
                  >
                    <div className="text-xl font-bold">{server.icon}</div>
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{server.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Add Server Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full flex justify-center">
              <button
                onClick={() => setCreateServerOpen(true)}
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#36393F] text-[#3BA55D] hover:bg-[#3BA55D] hover:text-white transition-all"
              >
                <PlusCircle size={24} />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Create Server</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CreateServerModal
        open={createServerOpen}
        onOpenChange={setCreateServerOpen}
      />
    </div>
  );
};

export default ServerSidebar;
