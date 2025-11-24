import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../components';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/ProfileScreenStyles';
import { colors } from '../constants/theme';

export default function ProfileScreen() {
  const { logout, isLoading, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const fullName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'N/A';

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.profileRow}>
          <Text style={styles.label}>Name:</Text>
          {isLoading ? (
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
