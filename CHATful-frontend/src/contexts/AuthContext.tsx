import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, api, LoginResponse } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  provider: "local" | "google" | "github";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const checkAuth = async () => {
      if (authApi.isAuthenticated()) {
        // Try to refresh token or validate session
        const result = await authApi.refreshToken();
        if (result.error) {
          authApi.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval> | undefined;

    const scheduleRefresh = () => {
      refreshInterval = setInterval(async () => {
        const result = await authApi.refreshToken();
        if (result.error) {
          authApi.clearToken();
          setUser(null);
        }
      }, 20 * 60 * 1000);
    };

    if (authApi.isAuthenticated()) {
      scheduleRefresh();
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    if (result.data) {
      setUser(result.data.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const register = async (email: string, username: string, password: string) => {
    const result = await authApi.register(email, username, password);
    if (result.data) {
      // Auto-login after registration
      const loginResult = await authApi.login(email, password);
      if (loginResult.data) {
        setUser(loginResult.data.user);
        return { success: true };
      }
      return { success: true }; // Registration succeeded but login may need email verification
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user || authApi.isAuthenticated(),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
