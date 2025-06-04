import { User, Message, DirectMessage } from '@/types';
import { getCurrentUser } from './auth';

// Mock Socket.io implementation
class MockSocket {
  private listeners: Record<string, ((...args: any[]) => void)[]> = {};
  private user: User | null = null;
  
  constructor() {
    this.user = getCurrentUser();
    
    // Simulate connection and receiving events
    setTimeout(() => {
      this.emit('connect');
    }, 1000);
  }

  // Add method to update current user
  public setCurrentUser(user: User | null) {
    this.user = user;
  }
  
  // Emit event to listeners
  private emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(...args));
    }
  }
  
  // Add event listener
  public on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }
  
  // Remove event listener
  public off(event: string, callback?: (...args: any[]) => void) {
    if (!callback) {
      delete this.listeners[event];
    } else if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }
  
  // Send message to channel
  public sendMessage(channelId: string, content: string, attachments: any[] = []) {
    if (!this.user) return Promise.reject(new Error('Not authenticated'));
    
    // Create a new message
    const message: Message = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      authorId: this.user.id,
      channelId,
      timestamp: new Date().toISOString(),
      edited: false,
      deleted: false,
      reactions: [],
      attachments,
      readBy: [this.user.id],
      mentions: [],
      pinned: false
    };
    
    // Simulate server processing delay
    return new Promise<Message>(resolve => {
      setTimeout(() => {
        // Simulate receiving the message back from the server
        this.emit('message', message);
        resolve(message);
      }, 300);
    });
  }
  
  // Send direct message
  public sendDirectMessage(recipientId: string, content: string, attachments: any[] = []) {
    if (!this.user) return Promise.reject(new Error('Not authenticated'));
    
    // Create a new direct message
    const message: DirectMessage = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      authorId: this.user.id,
      recipientId,
      timestamp: new Date().toISOString(),
      edited: false,
      deleted: false,
      reactions: [],
      attachments,
      readBy: [this.user.id],
      mentions: [],
      pinned: false
    };
    
    // Simulate server processing delay
    return new Promise<DirectMessage>(resolve => {
      setTimeout(() => {
        // Simulate receiving the message back from the server
        this.emit('directMessage', message);
        resolve(message);
      }, 300);
    });
  }
  
  // Update user status
  public updateStatus(status: User['status']) {
    if (!this.user) return Promise.reject(new Error('Not authenticated'));
    
    return new Promise<User>(resolve => {
      setTimeout(() => {
        if (this.user) {
          const updatedUser = {
            ...this.user,
            status,
            lastSeen: new Date().toISOString()
          };
          this.user = updatedUser;
          
          // Simulate receiving the updated user from the server
          this.emit('userUpdate', updatedUser);
          resolve(updatedUser);
        }
      }, 300);
    });
  }
  
  // Simulate typing indicator
  public startTyping(channelId: string) {
    if (!this.user) return;
    
    this.emit('typing', {
      userId: this.user.id,
      channelId,
      isTyping: true
    });
  }
  
  public stopTyping(channelId: string) {
    if (!this.user) return;
    
    this.emit('typing', {
      userId: this.user.id,
      channelId,
      isTyping: false
    });
  }
  
  // Mark message as read
  public markAsRead(messageId: string) {
    if (!this.user) return Promise.reject(new Error('Not authenticated'));
    
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.emit('messageRead', {
          messageId,
          userId: this.user?.id
        });
        resolve();
      }, 200);
    });
  }
  
  // Join a channel
  public joinChannel(channelId: string) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.emit('joinedChannel', { channelId });
        resolve();
      }, 300);
    });
  }
  
  // Leave a channel
  public leaveChannel(channelId: string) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.emit('leftChannel', { channelId });
        resolve();
      }, 300);
    });
  }
  
  // Disconnect socket
  public disconnect() {
    this.emit('disconnect');
    this.listeners = {};
  }
}

// Create and export a singleton instance
const socket = new MockSocket();
export default socket;