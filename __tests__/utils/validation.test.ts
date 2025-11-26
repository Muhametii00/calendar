import {
  loginSchema,
  signUpSchema,
  eventSchema,
  getValidationErrors,
} from '../../src/utils/validation';
import * as yup from 'yup';

describe('validation', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(loginSchema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      await expect(loginSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing password', async () => {
      const invalidData = {
        email: 'test@example.com',
      };
      await expect(loginSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('signUpSchema', () => {
    it('should validate correct signup data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject mismatched passwords', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject short name', async () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject invalid name characters', async () => {
      const invalidData = {
        name: 'John123',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject short password', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: '12345',
        confirmPassword: '12345',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing name', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing email', async () => {
      const invalidData = {
        name: 'John Doe',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing password', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        confirmPassword: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing confirmPassword', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('eventSchema', () => {
    it('should validate correct event data', async () => {
      const validData = {
        title: 'Test Event',
        time: '14:30',
        description: 'Test description',
      };
      await expect(eventSchema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject invalid time format', async () => {
      const invalidData = {
        title: 'Test Event',
        time: '25:00',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject short title', async () => {
      const invalidData = {
        title: 'A',
        time: '14:30',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should accept event without description', async () => {
      const validData = {
        title: 'Test Event',
        time: '14:30',
      };
      await expect(eventSchema.validate(validData)).resolves.toBeTruthy();
    });

    it('should reject missing title', async () => {
      const invalidData = {
        time: '14:30',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject missing time', async () => {
      const invalidData = {
        title: 'Test Event',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject invalid time format (not 24-hour)', async () => {
      const invalidData = {
        title: 'Test Event',
        time: '1:30',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject time with invalid minutes', async () => {
      const invalidData = {
        title: 'Test Event',
        time: '14:60',
        description: 'Test description',
      };
      await expect(eventSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('getValidationErrors', () => {
    it('should extract errors from ValidationError', () => {
      const error = new yup.ValidationError('Test error', 'value', 'path');
      const errors = getValidationErrors(error);
      expect(errors).toHaveProperty('path');
      expect(errors.path).toBe('Test error');
    });

    it('should handle errors with inner errors', () => {
      const innerError = new yup.ValidationError(
        'Inner error',
        'value',
        'innerPath',
      );
      const error = new yup.ValidationError('Main error', 'value', 'path');
      error.inner = [innerError];
      const errors = getValidationErrors(error);
      expect(errors).toHaveProperty('innerPath');
      expect(errors.innerPath).toBe('Inner error');
    });

    it('should handle inner errors without paths', () => {
      const innerError = new yup.ValidationError(
        'Inner error',
        'value',
        undefined,
      );
      const error = new yup.ValidationError('Main error', 'value', 'path');
      error.inner = [innerError];
      const errors = getValidationErrors(error);
      expect(errors).toEqual({});
    });

    it('should handle error with no inner and no path', () => {
      const error = new yup.ValidationError('Test error', 'value', undefined);
      error.inner = [];
      const errors = getValidationErrors(error);
      expect(errors).toEqual({});
    });

    it('should handle multiple inner errors', () => {
      const innerError1 = new yup.ValidationError('Error 1', 'value', 'field1');
      const innerError2 = new yup.ValidationError('Error 2', 'value', 'field2');
      const error = new yup.ValidationError('Main error', 'value', undefined);
      error.inner = [innerError1, innerError2];
      const errors = getValidationErrors(error);
      expect(errors).toHaveProperty('field1');
      expect(errors).toHaveProperty('field2');
      expect(errors.field1).toBe('Error 1');
      expect(errors.field2).toBe('Error 2');
    });

    it('should handle error with inner array but empty', () => {
      const error = new yup.ValidationError('Main error', 'value', 'path');
      error.inner = [];
      const errors = getValidationErrors(error);
      expect(errors).toHaveProperty('path');
      expect(errors.path).toBe('Main error');
    });

    it('should handle error with null inner', () => {
      const error = new yup.ValidationError('Main error', 'value', 'path');
      error.inner = null as any;
      const errors = getValidationErrors(error);
      expect(errors).toHaveProperty('path');
      expect(errors.path).toBe('Main error');
    });
  });
});
