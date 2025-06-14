import { config } from '../config';
import { AuthResponse, LoginDto, User, CreateUserDto } from '../types/user';

const API_URL = config.apiBaseUrl;

class AuthService {
  private setAuthData(authResponse: AuthResponse) {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login. Please try again.');
      }

      const data = await response.json();
      
      // Transform backend response to match frontend AuthResponse type
      const authResponse: AuthResponse = {
        accessToken: data.accessToken,
        user: {
          id: data.id,
          email: loginDto.email, // Backend doesn't return email, so we use the one from login
          firstName: data.firstName,
          lastName: data.lastName,
        }
      };

      this.setAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: CreateUserDto): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        // If no token, just clear local storage
        this.clearAuthData();
        return;
      }

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      // Even if the server request fails, we should clear local storage
      this.clearAuthData();

      if (!response.ok) {
        console.warn('Server logout failed, but local data was cleared');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we should clear local storage
      this.clearAuthData();
    }
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        this.clearAuthData();
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Transform backend response to match frontend AuthResponse type
      const authResponse: AuthResponse = {
        accessToken: data.accessToken,
        user: {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      };

      this.setAuthData(authResponse);
      return authResponse;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService(); 