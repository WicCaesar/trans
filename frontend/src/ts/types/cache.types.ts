export interface OnlineUser {
  userId: string;
  lastPing: number;
  minutesAgo: number;
}

export interface OnlineUsersResponse {
  onlineUsers: OnlineUser[];
  count: number;
  timestamp: number;
}

export interface UserOnlineStatus {
  isOnline: boolean;
  userId: string;
  lastPing: number | null;
  minutesAgo: number | null;
}
