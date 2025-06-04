import { useState } from 'react';
import { Hash, Settings, User, UserPlus, Plus, Headphones, LogOut } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Channel, User as UserType } from '@/types';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';
import UserAvatar from '@/components/ui/UserAvatar';
import CreateChannelModal from '@/components/modals/CreateChannelModal';

const ChannelSidebar = () => {
  const { t } = useTranslation();
  const { 
    activeServer, 
    activeChannel, 
    setActiveChannel, 
    directMessageUsers, 
    setActiveDmUser, 
    activeDmUser 
  } = useChat();
  const { user, logout } = useAuth();
  const [createChannelOpen, setCreateChannelOpen] = useState(false);

  const handleChannelClick = (channel: Channel) => {
    setActiveChannel(channel);
    setActiveDmUser(null);
  };

  const handleDmUserClick = (dmUser: UserType) => {
    setActiveDmUser(dmUser);
    setActiveChannel(null);
  };

  if (!activeServer && !activeDmUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 shadow-sm border-b border-[#232428]">
          <h1 className="font-bold text-white">{t('directMessages.title')}</h1>
        </div>

        <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase">{t('directMessages.title')}</h2>
            <button className="text-gray-400 hover:text-white">
              <UserPlus size={16} />
            </button>
          </div>

          {directMessageUsers.length > 0 ? (
            <div className="space-y-1">
              {directMessageUsers.map((dmUser) => (
                <button
                  key={dmUser.id}
                  onClick={() => handleDmUserClick(dmUser)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded hover:bg-[#36393F] group transition",
                    activeDmUser?.id === dmUser.id ? "bg-[#36393F]" : ""
                  )}
                >
                  <UserAvatar user={dmUser} />
                  <span className="truncate">{dmUser.username}</span>
                  <span className={cn(
                    "ml-auto w-2 h-2 rounded-full",
                    dmUser.status === 'online' ? "bg-green-500" : 
                    dmUser.status === 'idle' ? "bg-yellow-500" : 
                    dmUser.status === 'dnd' ? "bg-red-500" : "bg-gray-500"
                  )} />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 text-gray-400">
              <User size={40} className="mb-2 opacity-50" />
              <p>{t('directMessages.noConversations')}</p>
              <p className="text-xs">{t('directMessages.startConversation')}</p>
            </div>
          )}
        </div>

        {/* User panel */}
        <div className="p-2 bg-[#232428] flex items-center gap-2">
          {user && (
            <>
              <UserAvatar user={user} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">
                  {t(`chat.${user.status}`)}
                </p>
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-white p-1">
                <LogOut size={18} />
              </button>
              <button className="text-gray-400 hover:text-white p-1">
                <Settings size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Server name */}
      {activeServer && (
        <div className="p-4 shadow-sm border-b border-[#232428]">
          <h1 className="font-bold text-white truncate">{activeServer.name}</h1>
        </div>
      )}

      <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
        {activeServer && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase">{t('servers.channels')}</h2>
              <button 
                onClick={() => setCreateChannelOpen(true)}
                className="text-gray-400 hover:text-white"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {activeServer.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded hover:bg-[#36393F] group transition",
                    activeChannel?.id === channel.id ? "bg-[#36393F]" : ""
                  )}
                >
                  {channel.type === 'text' ? (
                    <Hash size={18} className="text-gray-400" />
                  ) : (
                    <Headphones size={18} className="text-gray-400" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>

            <Separator className="my-3 bg-[#232428]" />

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase">{t('servers.members')}</h2>
              <button className="text-gray-400 hover:text-white">
                <UserPlus size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {activeServer.members.map((memberId) => {
                const member = directMessageUsers.find(u => u.id === memberId) || {
                  id: memberId,
                  username: `User ${memberId}`,
                  status: 'offline',
                  avatar: '',
                  email: '',
                  lastSeen: ''
                };
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 rounded"
                  >
                    <UserAvatar user={member} />
                    <span className="truncate">{member.username}</span>
                    <span className={cn(
                      "ml-auto w-2 h-2 rounded-full",
                      member.status === 'online' ? "bg-green-500" : 
                      member.status === 'idle' ? "bg-yellow-500" : 
                      member.status === 'dnd' ? "bg-red-500" : "bg-gray-500"
                    )} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* User panel */}
      <div className="p-2 bg-[#232428] flex items-center gap-2">
        {user && (
          <>
            <UserAvatar user={user} />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">
                {t(`chat.${user.status}`)}
              </p>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-white p-1">
              <LogOut size={18} />
            </button>
            <button className="text-gray-400 hover:text-white p-1">
              <Settings size={18} />
            </button>
          </>
        )}
      </div>

      <CreateChannelModal 
        open={createChannelOpen} 
        onOpenChange={setCreateChannelOpen} 
        serverId={activeServer?.id || ''} 
      />
    </div>
  );
};

export default ChannelSidebar;