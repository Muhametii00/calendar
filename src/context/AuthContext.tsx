import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '../utils/biometricsService';
import BiometricBlurOverlay from '../components/BiometricBlurOverlay';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authenticateWithBiometrics: () => Promise<boolean>;
  showBiometricBlur: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBiometricBlur, setShowBiometricBlur] = useState(false);
  const appState = useRef(AppState.currentState);
  const biometricPromptShown = useRef(false);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Listen for app state changes to trigger biometrics when app comes to foreground
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // Reset biometric prompt flag when app goes to background
    if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      biometricPromptShown.current = false;
    }
    
    // When app comes to foreground and user is authenticated, prompt for biometrics
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      isAuthenticated &&
      !biometricPromptShown.current
    ) {
      // App has come to the foreground and user is authenticated
      await performBiometricAuth();
    }
    appState.current = nextAppState;
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const hasToken = !!token;
      setIsAuthenticated(hasToken);
      
      // If user is logged in, perform biometric authentication
      if (hasToken) {
        await performBiometricAuth();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performBiometricAuth = async () => {
    try {
      // Show blur overlay before biometric prompt
      setShowBiometricBlur(true);
      
      // Small delay to ensure blur is visible
      await new Promise(resolve => setTimeout(resolve, 100));

      const available = await isBiometricAvailable();
      if (!available) {
        // Biometrics not available, allow access
        setShowBiometricBlur(false);
        biometricPromptShown.current = true;
        return;
      }

      const result = await authenticateWithBiometrics(
        'Authenticate to access your calendar'
      );

      // Hide blur overlay after authentication attempt
      setShowBiometricBlur(false);

      if (!result.success) {
        // Biometric authentication failed, log out user
        await logout();
      } else {
        biometricPromptShown.current = true;
      }
    } catch (error) {
      console.error('Error performing biometric auth:', error);
      // Hide blur on error
      setShowBiometricBlur(false);
      // On error, log out for security
      await logout();
    }
  };

  const handleBiometricAuth = async (): Promise<boolean> => {
    try {
      // Show blur overlay before biometric prompt
      setShowBiometricBlur(true);
      
      // Small delay to ensure blur is visible
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await authenticateWithBiometrics(
        'Authenticate to continue'
      );

      // Hide blur overlay after authentication attempt
      setShowBiometricBlur(false);

      return result.success;
    } catch (error) {
      console.error('Error in biometric authentication:', error);
      setShowBiometricBlur(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    // In a real app, you would make an API call here
    // For now, we'll just store a token
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store auth token temporarily
      await AsyncStorage.setItem('authToken', 'dummy-token');
      await AsyncStorage.setItem('userEmail', email);
      
      // After email/password login, verify with biometrics
      const available = await isBiometricAvailable();
      if (available) {
        // Show blur overlay before biometric prompt
        setShowBiometricBlur(true);
        
        // Small delay to ensure blur is visible
        await new Promise(resolve => setTimeout(resolve, 100));

        const result = await authenticateWithBiometrics(
          'Verify your identity with biometrics'
        );

        // Hide blur overlay after authentication attempt
        setShowBiometricBlur(false);

        if (!result.success) {
          // If biometric verification fails, clean up and don't complete login
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userEmail');
          throw new Error('Biometric verification failed');
        }
      }
      
      setIsAuthenticated(true);
      biometricPromptShown.current = true;
    } catch (error) {
      // Hide blur on error
      setShowBiometricBlur(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      biometricPromptShown.current = false;
      setShowBiometricBlur(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        authenticateWithBiometrics: handleBiometricAuth,
        showBiometricBlur,
      }}
    >
      {children}
      <BiometricBlurOverlay visible={showBiometricBlur} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
