import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../components';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/ProfileScreenStyles';
import { colors } from '../constants/theme';

export default function ProfileScreen() {
  const { logout, isLoading } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await (
          await import('@react-native-async-storage/async-storage')
        ).default.getItem('userEmail');
        setEmail(storedEmail);
      } catch (error) {
        setEmail(null);
      } finally {
        setLoadingEmail(false);
      }
    };
    fetchEmail();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.profileRow}>
          <Text style={styles.label}>Name:</Text>
          {loadingEmail ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.value}>Muhamet Konushevci</Text>
          )}
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.label}>Email:</Text>
          {loadingEmail ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.value}>{email || 'N/A'}</Text>
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
