import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

const ChatPage = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      window.location.href = '/auth';
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#313338]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#5865F2] mb-4"></div>
          <div className="h-4 w-24 bg-[#36393F] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </>
  );
};

export default ChatPage;