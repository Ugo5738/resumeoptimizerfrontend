import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket, disconnectWebSocket } from '../../services/websocketService';
import axiosInstance from '../../utils/axiosConfig';

interface AuthContextType {
  isLoggedIn: boolean;
  isPaid: boolean;
  usageCount: number;
  hasFreeAccess: boolean;
  isLoading: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsPaid: (isPaid: boolean) => void;
  setUsageCount: (count: number) => void;
  setHasFreeAccess: (hasFreeAccess: boolean) => void;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUsageCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/signup', '/login', '/verify-email']; // Add other public routes as needed

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [hasFreeAccess, setHasFreeAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken || publicRoutes.includes(location.pathname)) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      await verifyAndRefreshToken();
      setIsLoggedIn(true);
      await checkUsageCount();
      // const websocketUrl = `ws://localhost:8000/ws/resume/?token=${accessToken}`;
      const websocketUrl = `wss://api.resumeguru.pro/ws/resume/?token=${accessToken}`;
      await connectWebSocket(websocketUrl);
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const verifyAndRefreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      throw new Error('No tokens found');
    }

    const decodedToken: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      try {
        const response = await axiosInstance.post('/api/auth/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('accessToken', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
        connectToWebSocket(response.data.access);
      } catch (error) {
        throw new Error('Token refresh failed');
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (isLoggedIn) {
        try {
          await verifyAndRefreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          await logout();
        }
      }
    }, 5 * 60 * 1000);  // 5 minutes

    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const checkUsageCount = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/payment-status/');
      setIsPaid(response.data.is_paid);
      setUsageCount(response.data.usage_count);
      setHasFreeAccess(response.data.has_free_access);
    } catch (error) {
      console.error('Error fetching usage count:', error);
    }
  };

  const connectToWebSocket = (token: string) => {
    // const websocketUrl = `ws://localhost:8000/ws/resume/?token=${token}`;
    const websocketUrl = `wss://api.resumeguru.pro/ws/resume/?token=${token}`;
    connectWebSocket(websocketUrl)
      .then(() => {
        // console.log("WebSocket connected successfully");
      })
      .catch((error) => {
        console.error("Failed to connect WebSocket:", error);
      });
  };

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsLoggedIn(true);
    await checkUsageCount();
    connectToWebSocket(accessToken);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await axiosInstance.post('/api/auth/logout/', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setIsPaid(false);
    setUsageCount(0);
    disconnectWebSocket();
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isPaid,
      usageCount,
      hasFreeAccess,
      isLoading,
      setIsLoggedIn,
      setIsPaid,
      setUsageCount,
      setHasFreeAccess,
      login,
      logout,
      checkUsageCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
