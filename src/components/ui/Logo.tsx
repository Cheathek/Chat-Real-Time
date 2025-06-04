import { MessageSquare } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-[#5865F2] p-3 rounded-full">
        <MessageSquare className="h-6 w-6 text-white" />
      </div>
      <span className="ml-2 text-xl font-bold text-white">Discord Chat</span>
    </div>
  );
};