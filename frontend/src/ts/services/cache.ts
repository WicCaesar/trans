import userService from './user.service.js';
import { OnlineUser, OnlineUsersResponse, UserOnlineStatus } from '../types/cache.types.js';

class CacheService {
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL_MS = 30000;
  private isActive = false;
  private onlineUsersUpdateCallbacks: ((users: OnlineUser[]) => void)[] = [];

  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isActive) {
        this.pausePing();
      } else if (!document.hidden && this.isActive) {
        this.resumePing();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.stopPing();
    });
  }

  public startPing(): void {
    if (this.pingInterval) {
      this.stopPing();
    }

    this.isActive = true;
    
    this.ping();
    
    this.pingInterval = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL_MS);

    console.log('Started user ping service');
  }

  public stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    this.isActive = false;
    
    this.disconnect().catch(error => {
      console.error('Error disconnecting user:', error);
    });

    console.log('Stopped user ping service');
  }

  private pausePing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    console.log('Paused user ping service');
  }


  private resumePing(): void {
    if (this.isActive && !this.pingInterval) {
      this.ping();
      this.pingInterval = setInterval(() => {
        this.ping();
      }, this.PING_INTERVAL_MS);
      console.log('Resumed user ping service');
    }
  }


  private async ping(): Promise<void> {
    try {
      const response = await userService.pingUser();
      console.log('Ping successful:', response);
      
      this.updateOnlineUsers();
    } catch (error) {
      console.error('Ping failed:', error);
      if (error instanceof Error && error.message.includes('401')) {
        this.stopPing();
        window.location.href = '/login';
      }
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await userService.disconnectUser();
      console.log('User disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting user:', error);
    }
  }

  public async getOnlineUsers(): Promise<OnlineUser[]> {
    try {
      const response = await userService.getOnlineUsers();
      const data = response as any;
      return data.onlineUsers || [];
    } catch (error) {
      console.error('Error getting online users:', error);
      return [];
    }
  }

  public async checkUserOnline(userId: string): Promise<UserOnlineStatus> {
    try {
      const response = await userService.checkUserOnline(userId);
      const data = response as any;
      return {
        isOnline: data.isOnline || false,
        userId: data.userId || userId,
        lastPing: data.lastPing || null,
        minutesAgo: data.minutesAgo || null
      };
    } catch (error) {
      console.error('Error checking user online status:', error);
      return {
        isOnline: false,
        userId,
        lastPing: null,
        minutesAgo: null
      };
    }
  }

  public onOnlineUsersUpdate(callback: (users: OnlineUser[]) => void): void {
    this.onlineUsersUpdateCallbacks.push(callback);
  }

  public offOnlineUsersUpdate(callback: (users: OnlineUser[]) => void): void {
    const index = this.onlineUsersUpdateCallbacks.indexOf(callback);
    if (index > -1) {
      this.onlineUsersUpdateCallbacks.splice(index, 1);
    }
  }

  private async updateOnlineUsers(): Promise<void> {
    try {
      const onlineUsers = await this.getOnlineUsers();
      
      this.onlineUsersUpdateCallbacks.forEach(callback => {
        try {
          callback(onlineUsers);
        } catch (error) {
          console.error('Error in online users update callback:', error);
        }
      });
    } catch (error) {
      console.error('Error updating online users:', error);
    }
  }

  public isPinging(): boolean {
    return this.isActive && this.pingInterval !== null;
  }
}

const cacheService = new CacheService();

export default cacheService;
