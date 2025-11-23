import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  dateText: {
    ...typography.title,
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventsCount: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: spacing.md,
  },
  eventTime: {
    ...typography.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  eventTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventDescription: {
    ...typography.small,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
