export const colors = {
  primary: '#007AFF',
  background: '#fff',
  text: {
    primary: '#1a1a1a',
    secondary: '#666',
    tertiary: '#999',
    inverse: '#fff',
  },
  border: '#e0e0e0',
  inputBackground: '#f9f9f9',
  shadow: '#007AFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 16,
  },
  body: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 14,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 30,
};

export const shadows = {
  button: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
