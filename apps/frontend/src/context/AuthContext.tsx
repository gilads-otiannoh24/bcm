import { createContext, useContext, useState } from "react";
import api from "../lib/axios";
import {
  LoginCredentials,
  PasswordResetRequest,
  RegisterData,
  User,
} from "@shared/types";
import { AxiosResponse } from "axios";
import { getTheme } from "../components/ThemeToggle";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AxiosResponse>;
  logout: () => Promise<void>;
  register: (credentials: RegisterData) => Promise<AxiosResponse>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  resetPassword: (passwordData: PasswordResetRequest) => Promise<AxiosResponse>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AxiosResponse>;
  validateResetToken: (token: string) => Promise<AxiosResponse>;
  setUser: (user: User | null) => void;
  getUserSettings: () => Promise<AxiosResponse>;
  setTheme: (theme: "light" | "dark") => void;
  theme: "light" | "dark";
  cardDisplayMode: "grid" | "list";
  setCardDisplayMode: (mode: "grid" | "list") => void;
}

export type Theme = "light" | "dark" | "system";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || getTheme("system")
  );
  const [loading, setLoading] = useState(true);
  const [cardDisplayMode, setCardDisplayMode] = useState<"grid" | "list">(
    "grid"
  );

  const checkAuth = async () => {
    api
      .get("/auth/me")
      .then((res) => {
        setLoading(false);
        setUser(res.data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);

    return response;
  };
  const register = async (credentials: RegisterData) => {
    const response = await api.post("/auth/register", credentials);

    return response;
  };
  const logout = async () => {
    await api.get("/auth/logout");
    setUser(null);
  };
  const refreshToken = async () => {
    const response = await api.post("/auth/refresh-token");
    setUser(response.data.user);
  };
  const updateUser = async (userData: Partial<User>) => {
    const response = await api.put("/auth/update", userData);
    setUser((prevUser) => ({
      ...prevUser,
      ...response.data.user,
    }));
  };
  const updatePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await api.put("/auth/updatepassword", passwordData);
  };
  const resetPassword = async (passwordData: PasswordResetRequest) => {
    return await api.patch(
      `/auth/resetpassword/${passwordData.token}`,
      passwordData
    );
  };
  const validateResetToken = async (token: string) => {
    const response = await api.post("/auth/validateresettoken", {
      resettoken: token,
    });
    return response;
  };
  const verifyEmail = async (token: string) => {
    await api.post("/auth/verify-email", { token });
  };
  const resendVerificationEmail = async () => {
    await api.post("/auth/resend-verification-email");
  };
  const forgotPassword = async (email: string) => {
    return await api.post("/auth/forgotpassword", { email });
  };
  const getUserSettings = async () => {
    const response = await api.get("/settings/me");
    return response;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setTheme,
        theme,
        loading,
        setUser,
        getUserSettings,
        login,
        logout,
        register,
        refreshToken,
        updateUser,
        updatePassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
        checkAuth,
        forgotPassword,
        validateResetToken,
        cardDisplayMode,
        setCardDisplayMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthProvider must be used within an AuthProvider");
  }
  return context;
};
