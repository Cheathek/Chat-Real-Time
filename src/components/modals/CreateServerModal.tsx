import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CreateServerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateServerModal = ({ open, onOpenChange }: CreateServerModalProps) => {
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState('🎮');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = ['🎮', '🎯', '🏆', '📚', '🎵', '🎨', '💻', '🌍', '🔬', '🎬', '📷', '👾'];

  const handleCreateServer = () => {
    if (!serverName.trim()) return;
    
    setIsSubmitting(true);
    
    // Mock creating a server
    setTimeout(() => {
      // In a real app, this would be an API call
      console.log('Creating server:', { name: serverName, icon: serverIcon });
      
      // Reset form and close modal
      setServerName('');
      setServerIcon('🎮');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#313338] text-white border-[#232428] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create a Server
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Your server is where you and your friends hang out. Make yours and start talking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="server-icon">Server Icons</Label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setServerIcon(icon)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${serverIcon === icon ? 'bg-[#5865F2]' : 'bg-[#2B2D31] hover:bg-[#36393F]'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Enter server name"
              className="bg-[#1E1F22] border-[#232428] focus:ring-[#5865F2]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-[#232428] hover:bg-[#36393F] text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateServer}
            disabled={!serverName.trim() || isSubmitting}
            className="bg-[#5865F2] hover:bg-[#4752C4]"
          >
            {isSubmitting ? 'Creating...' : 'Create Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;