import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const statusIndicator = (
    <span className={`absolute bottom-0 right-0 rounded-full border-2 border-[#36393F] ${
      user.status === 'online' ? 'bg-green-500' : 
      user.status === 'idle' ? 'bg-yellow-500' : 
      user.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
    } ${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'}`} />
  );

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback className="bg-[#5865F2] text-white">
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>
      {statusIndicator}
    </div>
  );
};

export default UserAvatar;