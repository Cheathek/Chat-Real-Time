import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForms = () => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle login
  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoggingIn(true);
      await login(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle registration
  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsRegistering(true);
      await register(values.username, values.email, values.password);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#36393F] p-8 rounded-lg shadow-lg">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4 bg-[#2E3035]">
          <TabsTrigger value="login" className="text-white data-[state=active]:bg-[#5865F2]">
            {t('common.login')}
          </TabsTrigger>
          <TabsTrigger value="register" className="text-white data-[state=active]:bg-[#5865F2]">
            {t('common.register')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-100">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                {...loginForm.register('email')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="name@example.com"
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-100">{t('common.password')}</Label>
                <a href="#" className="text-xs text-[#5865F2] hover:underline hover:text-[#4752C4]">
                  {t('auth.forgotPassword')}
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...loginForm.register('password')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="••••••••"
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-white">{t('common.loading')}</span>
                </>
              ) : t('common.login')}
            </Button>
            
            <p className="text-sm text-center text-gray-300 mt-4">
              {t('auth.noAccount')} 
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-[#5865F2] hover:underline hover:text-[#4752C4] ml-1"
              >
                {t('common.register')}
              </button>
            </p>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-100">{t('common.username')}</Label>
              <Input
                id="username"
                {...registerForm.register('username')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="cooluser123"
              />
              {registerForm.formState.errors.username && (
                <p className="text-red-500 text-sm">{registerForm.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-100">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register('email')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="name@example.com"
              />
              {registerForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-100">{t('common.password')}</Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register('password')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-100">{t('common.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerForm.register('confirmPassword')}
                className="bg-[#2E3035] border-[#1E1F22] text-white placeholder:text-gray-400"
                placeholder="••••••••"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white" 
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-white">{t('common.loading')}</span>
                </>
              ) : t('common.register')}
            </Button>
            
            <p className="text-sm text-center text-gray-300 mt-4">
              {t('auth.hasAccount')} 
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#5865F2] hover:underline hover:text-[#4752C4] ml-1"
              >
                {t('common.login')}
              </button>
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForms;