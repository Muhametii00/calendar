import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../../src/constants/theme';

describe('theme', () => {
  it('should export colors', () => {
    expect(colors.primary).toBe('#007AFF');
    expect(colors.background).toBe('#fff');
    expect(colors.text.primary).toBe('#1a1a1a');
  });

  it('should export spacing', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
  });

  it('should export typography', () => {
    expect(typography.title.fontSize).toBe(32);
    expect(typography.body.fontSize).toBe(16);
  });

  it('should export borderRadius', () => {
    expect(borderRadius.sm).toBe(8);
    expect(borderRadius.md).toBe(12);
  });

  it('should export shadows', () => {
    expect(shadows.button.shadowColor).toBe(colors.shadow);
    expect(shadows.button.elevation).toBe(8);
  });
});
