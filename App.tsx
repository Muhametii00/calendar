/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>(
    'login',
  );

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'login' ? (
        <LoginScreen onNavigateToSignUp={() => setCurrentScreen('signup')} />
      ) : (
        <SignUpScreen onNavigateToLogin={() => setCurrentScreen('login')} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
