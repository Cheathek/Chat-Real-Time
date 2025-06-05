import { Hash, Users, Bell, Pin, Search, HelpCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import UserAvatar from '@/components/ui/UserAvatar';

const ChatHeader = () => {
  const { activeChannel, activeDmUser } = useChat();

  if (!activeChannel && !activeDmUser) {
    return (
      <div className="h-12 px-3 flex items-center justify-between border-b border-[#232428] bg-[#313338]">
        <div className="flex items-center">
          <Users className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="font-semibold">Chat Message</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Bell size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Pin size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Search size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (activeDmUser) {
    return (
      <div className="h-12 px-3 flex items-center justify-between border-b border-[#232428] bg-[#313338]">
        <div className="flex items-center">
          <UserAvatar user={activeDmUser} size="sm" />
          <h3 className="font-semibold ml-2">{activeDmUser.username}</h3>
          <span className={`ml-2 w-2 h-2 rounded-full ${
            activeDmUser.status === 'online' ? 'bg-green-500' : 
            activeDmUser.status === 'idle' ? 'bg-yellow-500' : 
            activeDmUser.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
          }`} />
        </div>

        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Bell size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Pin size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <Search size={20} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-12 px-3 flex items-center justify-between border-b border-[#232428] bg-[#313338]">
      <div className="flex items-center">
        <Hash className="w-5 h-5 text-gray-400 mr-2" />
        <h3 className="font-semibold">{activeChannel?.name}</h3>
      </div>

      <div className="flex items-center space-x-2">
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
          <Pin size={20} />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
          <Users size={20} />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
          <Search size={20} />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#36393F] text-gray-400">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;