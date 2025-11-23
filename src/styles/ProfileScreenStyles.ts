import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../constants/theme';

export const styles = StyleSheet.create({
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
