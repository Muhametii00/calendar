import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authenticateWithBiometrics,
  isBiometricAvailable,
} from '../utils/biometricsService';
import BiometricBlurOverlay from '../components/BiometricBlurOverlay';
import auth from '@react-native-firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
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
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        const shouldPerformBiometrics = await AsyncStorage.getItem(
          'biometricEnabled',
        );
        if (shouldPerformBiometrics === 'true') {
          await performBiometricAuth();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      biometricPromptShown.current = false;
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      isAuthenticated &&
      !biometricPromptShown.current
    ) {
      await performBiometricAuth();
    }
    appState.current = nextAppState;
  };

  const performBiometricAuth = async () => {
    try {
      setShowBiometricBlur(true);

      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const available = await isBiometricAvailable();
      if (!available) {
        setShowBiometricBlur(false);
        biometricPromptShown.current = true;
        return;
      }

      const result = await authenticateWithBiometrics(
        'Authenticate to access your calendar',
      );

      setShowBiometricBlur(false);

      if (!result.success) {
        await logout();
      } else {
        biometricPromptShown.current = true;
      }
    } catch (error) {
      console.error('Error performing biometric auth:', error);
      setShowBiometricBlur(false);
      await logout();
    }
  };

  const handleBiometricAuth = async (): Promise<boolean> => {
    try {
      setShowBiometricBlur(true);

      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const result = await authenticateWithBiometrics(
        'Authenticate to continue',
      );

      setShowBiometricBlur(false);

      return result.success;
    } catch (error) {
      console.error('Error in biometric authentication:', error);
      setShowBiometricBlur(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem('userEmail', email);

      const available = await isBiometricAvailable();
      if (available) {
        setShowBiometricBlur(true);
        await new Promise<void>(resolve => setTimeout(resolve, 100));

        const result = await authenticateWithBiometrics(
          'Authenticate to access your calendar',
        );

        setShowBiometricBlur(false);

        if (!result.success) {
          await logout();
          throw new Error('Biometric verification failed');
        } else {
          await AsyncStorage.setItem('biometricEnabled', 'true');
        }
      }

      biometricPromptShown.current = true;
    } catch (error: any) {
      setShowBiometricBlur(false);
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error?.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error?.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error?.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error?.message === 'Biometric verification failed') {
        errorMessage =
          'Biometric verification is required to complete login. Please try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.updateProfile({
        displayName: name,
      });

      await AsyncStorage.setItem('userEmail', email);

      const available = await isBiometricAvailable();
      if (available) {
        setShowBiometricBlur(true);
        await new Promise<void>(resolve => setTimeout(resolve, 100));

        const result = await authenticateWithBiometrics(
          'Authenticate to access your calendar',
        );

        setShowBiometricBlur(false);

        if (result.success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
        }
      }

      biometricPromptShown.current = true;
    } catch (error: any) {
      setShowBiometricBlur(false);
      console.error('Sign up error:', error);

      let errorMessage = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('biometricEnabled');
      setIsAuthenticated(false);
      setUser(null);
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
        user,
        login,
        signUp,
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
