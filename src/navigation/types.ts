import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Profile: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

export type HomeScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Home'
>;

export type EventScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Events'
>;

export type ProfileScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Profile'
>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;
export type HomeScreenRouteProp = RouteProp<MainTabParamList, 'Home'>;
export type EventScreenRouteProp = RouteProp<MainTabParamList, 'Events'>;
export type ProfileScreenRouteProp = RouteProp<MainTabParamList, 'Profile'>;
