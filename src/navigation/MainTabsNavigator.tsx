import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from './types';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={
        {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          animation: 'shift',
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 250,
            },
          },
        } as BottomTabNavigationOptions
      }
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
