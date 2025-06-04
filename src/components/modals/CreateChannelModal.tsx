import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CreateChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverId: string;
}

const CreateChannelModal = ({ open, onOpenChange, serverId }: CreateChannelModalProps) => {
  const { t } = useTranslation();
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateChannel = () => {
    if (!channelName.trim()) return;
    
    setIsSubmitting(true);
    
    // Mock creating a channel
    setTimeout(() => {
      // In a real app, this would be an API call
      console.log('Creating channel:', { 
        name: channelName,
        type: channelType,
        isPrivate,
        serverId
      });
      
      // Reset form and close modal
      setChannelName('');
      setChannelType('text');
      setIsPrivate(false);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#313338] text-white border-[#232428] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('servers.createChannel')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="channel-type">{t('servers.channelType')}</Label>
            <Select
              value={channelType}
              onValueChange={(value) => setChannelType(value as 'text' | 'voice')}
            >
              <SelectTrigger className="bg-[#1E1F22] border-[#232428] focus:ring-[#5865F2]">
                <SelectValue placeholder={t('servers.channelType')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1F22] border-[#232428]">
                <SelectItem value="text">{t('servers.textChannel')}</SelectItem>
                <SelectItem value="voice">{t('servers.voiceChannel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="channel-name">{t('servers.channelName')}</Label>
            <Input
              id="channel-name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={channelType === 'text' ? 'new-channel' : 'Voice Channel'}
              className="bg-[#1E1F22] border-[#232428] focus:ring-[#5865F2]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="private-channel">Private Channel</Label>
            <Switch
              id="private-channel"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
          
          {isPrivate && (
            <div className="text-sm text-gray-400 bg-[#2B2D31] p-3 rounded-md">
              <p>This channel will only be visible to selected members and roles.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-[#232428] hover:bg-[#36393F] text-white"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleCreateChannel}
            disabled={!channelName.trim() || isSubmitting}
            className="bg-[#5865F2] hover:bg-[#4752C4]"
          >
            {isSubmitting ? 'Creating...' : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;