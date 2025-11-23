import { StyleSheet } from 'react-native';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.sm,
  },
  eventsSection: {
    marginTop: spacing.sm,
  },
  settingsContainer: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 500,
  },
  logoutButton: {
    height: 52,
    backgroundColor: '#FF3B30',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.button,
  },
  logoutButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  loaderText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
