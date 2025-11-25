import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes',
    )
    .trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const eventSchema = yup.object().shape({
  title: yup
    .string()
    .required('Event title is required')
    .min(2, 'Event title must be at least 2 characters')
    .max(100, 'Event title must be less than 100 characters')
    .trim(),
  time: yup
    .string()
    .required('Time is required')
    .matches(
      /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time format (e.g., "10:00 AM" or "14:30")',
    )
    .trim(),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim(),
});

export const getValidationErrors = (
  error: yup.ValidationError,
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (error.inner && error.inner.length > 0) {
    error.inner.forEach(err => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
  } else if (error.path) {
    errors[error.path] = error.message;
  }
  return errors;
};
