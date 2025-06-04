import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import Layout from '@/components/layout/Layout';
import AuthPage from '@/pages/AuthPage';
import ChatPage from '@/pages/ChatPage';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Main App content with route handling
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Set page title
  useEffect(() => {
    document.title = 'Discord Chat App';
  }, []);

  // Simple route handling
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

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <ChatPage />;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Layout>
          <AppContent />
        </Layout>
        <Toaster />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;