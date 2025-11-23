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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '500',
  },
  loginButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.button,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
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
  signUpText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
});
