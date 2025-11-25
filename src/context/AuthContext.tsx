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
import { firestore } from '../config/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authenticateWithBiometrics: () => Promise<boolean>;
  showBiometricBlur: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBiometricBlur, setShowBiometricBlur] = useState(false);
  const appState = useRef(AppState.currentState);
  const biometricPromptShown = useRef(false);
  const biometricPromptInProgress = useRef(false);
  const [user, setUser] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        const shouldPerformBiometrics = await AsyncStorage.getItem(
          'biometricEnabled',
        );
        if (shouldPerformBiometrics === 'true') {
          setIsLoading(false);
          requestAnimationFrame(async () => {
            await new Promise<void>(resolve => setTimeout(resolve, 100));
            await performBiometricAuth();
          });
        } else {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
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
    if (biometricPromptInProgress.current) {
      return;
    }

    try {
      biometricPromptInProgress.current = true;
      setShowBiometricBlur(true);

      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const available = await isBiometricAvailable();
      if (!available) {
        setShowBiometricBlur(false);
        biometricPromptShown.current = true;
        biometricPromptInProgress.current = false;
        return;
      }

      const result = await authenticateWithBiometrics(
        'Authenticate to access your calendar',
      );

      setShowBiometricBlur(false);

      if (!result.success) {
        if (result.error && result.error.includes('another authentication')) {
          biometricPromptShown.current = false;
          biometricPromptInProgress.current = false;
          setTimeout(() => {
            performBiometricAuth();
          }, 500);
          return;
        }

        if (result.error && result.error.includes('cancelled')) {
          biometricPromptShown.current = false;
        } else {
          await logout();
        }
      } else {
        biometricPromptShown.current = true;
      }
    } catch (error) {
      console.error('Error performing biometric auth:', error);
      setShowBiometricBlur(false);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('another authentication') ||
        (error as any)?.code === -4
      ) {
        biometricPromptShown.current = false;
        biometricPromptInProgress.current = false;
        setTimeout(() => {
          performBiometricAuth();
        }, 500);
        return;
      }

      if (!errorMessage.includes('cancel')) {
        await logout();
      }
    } finally {
      biometricPromptInProgress.current = false;
    }
  };

  const handleBiometricAuth = async (): Promise<boolean> => {
    if (biometricPromptInProgress.current) {
      return false;
    }

    try {
      biometricPromptInProgress.current = true;
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
    } finally {
      biometricPromptInProgress.current = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem('userEmail', email);

      const available = await isBiometricAvailable();
      if (available && !biometricPromptInProgress.current) {
        biometricPromptInProgress.current = true;
        setShowBiometricBlur(true);
        await new Promise<void>(resolve => setTimeout(resolve, 100));

        const result = await authenticateWithBiometrics(
          'Authenticate to access your calendar',
        );

        setShowBiometricBlur(false);
        biometricPromptInProgress.current = false;

        if (!result.success) {
          await logout();
          const isCancelled =
            result.error?.includes('cancelled') ||
            result.error?.includes('Cancel');
          throw new Error(
            isCancelled
              ? 'Biometric verification cancelled'
              : 'Biometric verification failed',
          );
        } else {
          await AsyncStorage.setItem('biometricEnabled', 'true');
        }
      }

      biometricPromptShown.current = true;
    } catch (error: any) {
      setShowBiometricBlur(false);
      biometricPromptInProgress.current = false;
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

      await firestore().collection('users').doc(userCredential.user.uid).set({
        fullName: name,
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await AsyncStorage.setItem('userEmail', email);

      const available = await isBiometricAvailable();
      if (available && !biometricPromptInProgress.current) {
        biometricPromptInProgress.current = true;
        setShowBiometricBlur(true);
        await new Promise<void>(resolve => setTimeout(resolve, 100));

        const result = await authenticateWithBiometrics(
          'Authenticate to access your calendar',
        );

        setShowBiometricBlur(false);
        biometricPromptInProgress.current = false;

        if (result.success) {
          await AsyncStorage.setItem('biometricEnabled', 'true');
        }
      }

      biometricPromptShown.current = true;
    } catch (error: any) {
      setShowBiometricBlur(false);
      biometricPromptInProgress.current = false;
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
        selectedDate,
        setSelectedDate,
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
