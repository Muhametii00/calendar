import { StyleSheet } from 'react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.md + 4,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.inputBackground,
    color: colors.text.primary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
  },
  passwordInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  passwordToggle: {
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    ...typography.small,
    color: '#FF3B30',
    marginTop: spacing.xs,
  },
  signUpButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.button,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  signInText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
});
