import { ApiResponse } from '../types/api.types.js';

class FriendService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  
  private getAuthToken(): string | null {
    const cookies = document.cookie.split(';');
    let authToken = null;
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('auth_token=')) {
        authToken = cookie.substring('auth_token='.length, cookie.length);
        break;
      }
    }
    
    return authToken;
  }
  
  private async request<T>(endpoint: string, method: string = 'GET', data: any = null): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`Making ${method} request to: ${url}`);
    
    const options: RequestInit = {
      method,
      headers: {}
    };
    
    const token = this.getAuthToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    if (method !== 'GET' && data !== null && data !== undefined) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(data);
    }
    
    try {
      console.log(`Enviando requisição para ${url}:`, options);
      const response = await fetch(url, options);
      console.log(`Resposta recebida de ${url}:`, response.status);
      
      const result = await response.json();
      console.log(`Dados da resposta:`, result);
      
      if (!response.ok) {
        const errorMessage = result.error || result.message || 'Something went wrong';
        throw new Error(errorMessage);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data && !result.requires2FA) {
        return result.data as T;
      }
      
      return result as T;
    } catch (error) {
      throw error;
    }
  }

  public async getFriends(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/friends', 'GET');
  }

  public async getFriendRequests(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/friends/requests', 'GET');
  }

  public async sendFriendRequest(userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/friends/request', 'POST', { receiverId: userId });
  }

  public async acceptFriendRequest(requestId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/friends/request/${requestId}/accept`, 'POST');
  }

  public async rejectFriendRequest(requestId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/friends/request/${requestId}/reject`, 'POST');
  }

  public async removeFriend(friendId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/friends/${friendId}`, 'DELETE');
  }

  public async removeFriendByUserId(friendId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/friends/user/${friendId}`, 'DELETE');
  }
}

const friendService = new FriendService();

export default friendService;
