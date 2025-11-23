import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../constants/theme';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.text.secondary,
    marginRight: spacing.md,
    width: 72,
  },
  value: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
