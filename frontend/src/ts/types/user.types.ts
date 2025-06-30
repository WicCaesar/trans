export interface UserData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface ProfileData {
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface Friend {
  id: string;
  nickName: string;
  foto?: string;
  status?: 'online' | 'offline' | 'playing';
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    nickName: string;
    foto?: string;
  };
  receiver: {
    id: string;
    nickName: string;
    foto?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
} 