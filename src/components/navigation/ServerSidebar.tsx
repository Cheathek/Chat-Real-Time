import { useState } from 'react';
import { PlusCircle, Bot } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Server } from '@/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CreateServerModal from '@/components/modals/CreateServerModal';
import { useTranslation } from '@/lib/i18n';

const ServerSidebar = () => {
  const { t } = useTranslation();
  const { servers, activeServer, setActiveServer, setActiveChannel } = useChat();
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
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 space-y-2 flex-shrink-0">
      {/* Home Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleHomeClick}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center bg-[#5865F2] text-white transition-all hover:rounded-2xl",
                !activeServer && "rounded-2xl"
              )}
            >
              <Bot size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t('common.home')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-8 h-0.5 bg-[#35363C] rounded-full my-1" />

      {/* Server List */}
      <div className="flex flex-col items-center space-y-2 overflow-y-auto scrollbar-hide">
        {servers.map((server) => (
          <TooltipProvider key={server.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleServerClick(server)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-[#36393F] transition-all relative group",
                    activeServer?.id === server.id ? "rounded-2xl bg-[#5865F2]" : ""
                  )}
                >
                  <div className={cn(
                    "absolute left-0 w-1 bg-white rounded-r-full h-0 group-hover:h-5 transition-all",
                    activeServer?.id === server.id ? "h-10" : ""
                  )} />
                  <div className="text-xl font-bold">
                    {server.icon}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {server.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Add Server Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCreateServerOpen(true)}
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#36393F] text-[#3BA55D] hover:bg-[#3BA55D] hover:text-white transition-all"
            >
              <PlusCircle size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t('servers.createServer')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CreateServerModal open={createServerOpen} onOpenChange={setCreateServerOpen} />
    </div>
  );
};

export default ServerSidebar;