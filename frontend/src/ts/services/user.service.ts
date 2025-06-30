import { ApiResponse } from '../types/api.types.js';

class UserService {
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
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const token = this.getAuthToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    if (method !== 'GET') {
      options.body = JSON.stringify(data || {});
    }
    
    try {
      console.log(`Enviando requisição para ${url}:`, options);
      const response = await fetch(url, options);
      console.log(`Resposta recebida de ${url}:`, response.status);
      
      const result = await response.json();
      console.log(`Dados da resposta:`, result);
      
      if (!response.ok) {
        console.error(`Erro na requisição para ${url}:`, result);
        throw new Error(result.error || 'Something went wrong');
      }
      
      if (result.error) {
        console.error(`Erro na resposta (status 200) para ${url}:`, result);
        throw new Error(result.error);
      }
      
      if (result.data && !result.requires2FA) {
        return result.data as T;
      }
      
      return result as T;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  public async searchUsers(query: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/users/search?query=${encodeURIComponent(query)}`, 'GET');
  }
  
  public async findUserByUsername(username: string): Promise<ApiResponse> {
    console.log(`Buscando usuário pelo username: ${username}`);
    const result = await this.request<ApiResponse>(`/users/find-by-username/${encodeURIComponent(username)}`, 'GET');
    console.log(`Resultado da busca por username:`, result);
    return result;
  }

  public async pingUser(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/users/ping', 'POST');
  }

  public async disconnectUser(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/users/disconnect', 'POST');
  }

  public async getOnlineUsers(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/users/online', 'GET');
  }

  public async checkUserOnline(userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/users/${userId}/online`, 'GET');
  }

  public async getUserProfile(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/users/profile', 'GET');
  }

  public async toggle2FA(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/users/toggle-2fa', 'PUT');
  }
}

const userService = new UserService();

export default userService;
