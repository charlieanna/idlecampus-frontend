// Authentication service for managing user sessions and tokens

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  token: string;
}

class AuthService {
  private static readonly TOKEN_KEY = 'idlecampus_auth_token';
  private static readonly USER_KEY = 'idlecampus_user';

  /**
   * Get the current authentication token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  /**
   * Set the authentication token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  /**
   * Remove the authentication token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  /**
   * Get the current user from localStorage
   */
  getUser(): AuthUser | null {
    const userJson = localStorage.getItem(AuthService.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Set the current user in localStorage
   */
  setUser(user: AuthUser): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    this.setToken(user.token);
  }

  /**
   * Remove user and token from localStorage
   */
  logout(): void {
    this.removeToken();
    localStorage.removeItem(AuthService.USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};

    return {
      'Authorization': `Bearer ${token}`,
    };
  }
}

export const authService = new AuthService();
