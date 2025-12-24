import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL 
const REFRESH_TOKEN_KEY = "chatful_refresh_token";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status?: number;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  type: string;
  user: {
    id: string;
    email: string;
    username: string;
    provider: "local" | "google" | "github";
  };
}

interface RegisterResponse {
  id: string;
  email: string;
  username: string;
  provider: "local" | "google" | "github";
}

interface MessageResponse {
  message: string;
}

const getToken = (): string | null => {
  return localStorage.getItem("chatful_token");
};

const setToken = (token: string): void => {
  localStorage.setItem("chatful_token", token);
};

const clearToken = (): void => {
  localStorage.removeItem("chatful_token");
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 401) {
    clearToken();
    window.location.href = "/login";
    return { error: "Session expired. Please log in again." };
  }

  try {
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.detail || data.message || "Something went wrong";
      return { error: errorMessage, status: response.status };
    }

    return { data, status: response.status };
  } catch {
    if (!response.ok) {
      return { error: `Request failed with status ${response.status}`, status: response.status };
    }
    return { data: undefined as T, status: response.status };
  }
};

const createHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const api = {
  get: async <T = unknown>(endpoint: string, requiresAuth = true): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "GET",
        headers: createHeaders(requiresAuth),
      });
      return handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return { error: message };
    }
  },

  post: async <T = unknown>(endpoint: string, body?: unknown, requiresAuth = true): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: createHeaders(requiresAuth),
        body: body ? JSON.stringify(body) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return { error: message };
    }
  },

  put: async <T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "PUT",
        headers: createHeaders(true),
        body: body ? JSON.stringify(body) : undefined,
      });
      return handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return { error: message };
    }
  },

  delete: async <T = unknown>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "DELETE",
        headers: createHeaders(true),
      });
      return handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return { error: message };
    }
  },

  uploadFile: async <T = unknown>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });
      return handleResponse<T>(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message);
      return { error: message };
    }
  },
};

// Auth-specific API methods
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const result = await api.post<LoginResponse>("/login", { email, password }, false);
    if (result.data?.token) {
      setToken(result.data.token);
    }
    if (result.data?.refresh_token) {
      setRefreshToken(result.data.refresh_token);
    }
    return result;
  },

  register: async (email: string, username: string, password: string): Promise<ApiResponse<RegisterResponse>> => {
    return api.post<RegisterResponse>("/register", { email, username, password }, false);
  },

  logout: (): void => {
    clearToken();
    window.location.href = "/login";
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string; refresh_token: string; type: string }>> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return { error: "Missing refresh token" };
    }
    const query = new URLSearchParams({ token: refreshToken });
    const result = await api.post<{ token: string; refresh_token: string; type: string }>(
      `/refresh-token?${query.toString()}`,
      undefined,
      false
    );
    if (result.data?.token) {
      setToken(result.data.token);
    }
    if (result.data?.refresh_token) {
      setRefreshToken(result.data.refresh_token);
    }
    return result;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse>("/change-password", { 
      old_password: oldPassword, 
      new_password: newPassword 
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse>("/forget-password", { email }, false);
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse>("/new-password", { token, password }, false);
  },

  isAuthenticated: (): boolean => {
    return !!getToken() || !!getRefreshToken();
  },

  getToken,
  setToken,
  clearToken,
  getRefreshToken,
};

export type { LoginResponse, RegisterResponse, MessageResponse, ApiResponse };
