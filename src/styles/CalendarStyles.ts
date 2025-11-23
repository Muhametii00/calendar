import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
  },
  navButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  monthText: {
    ...typography.title,
    fontSize: 20,
    color: colors.text.primary,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dayNameText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days = 14.28% per day
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dayText: {
    ...typography.body,
    color: colors.text.primary,
  },
  todayCell: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
  },
  todayText: {
    fontWeight: '600',
    color: colors.primary,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  selectedText: {
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
