import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.title,
    fontSize: 28,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
