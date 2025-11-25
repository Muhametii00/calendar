import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../components';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/ProfileScreenStyles';
import { colors } from '../constants/theme';
import { firestore } from '../config/firebase';

interface UserData {
  fullName?: string;
  email?: string;
}

export default function ProfileScreen() {
  const { logout, isLoading, user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      setIsLoadingUserData(true);
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        const data = userDoc.data();
        if (data) {
          setUserData(data as UserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
  };

  const fullName =
    userData?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User';
  const userEmail = user?.email || 'N/A';

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.profileRow}>
          <Text style={styles.label}>Name:</Text>
          {isLoading || isLoadingUserData ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.value}>{fullName}</Text>
          )}
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.label}>Email:</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.value}>{userEmail}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutButtonText}>
            {isLoading ? 'Logging out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
