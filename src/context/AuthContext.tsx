import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { login, register, logout, getCurrentUser, isAuthenticated } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const isLoggedIn = isAuthenticated();
        if (isLoggedIn) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: loggedInUser } = await login(email, password);
      setUser(loggedInUser);
      setAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user: registeredUser } = await register(username, email, password);
      setUser(registeredUser);
      setAuthenticated(true);
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};