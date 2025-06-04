import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/lib/i18n';
import AuthForms from '@/components/auth/AuthForms';
import { Logo } from '@/components/ui/Logo';

const AuthPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  // If authenticated, redirect to chat
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#313338]">
      <div className="mb-8 text-center">
        <Logo className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white">{t('common.welcome')}</h1>
        <p className="text-gray-400 mt-2">
          Join the conversation with friends and communities
        </p>
      </div>
      
      <AuthForms />
      
      <p className="mt-8 text-sm text-gray-400 max-w-md text-center">
        By registering, you agree to Discord's Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default AuthPage;