/**
 * Tests for device detection utilities
 * @fileoverview Tests for platform-specific UI symbol detection
 */

import { isAppleDevice, getModifierKeySymbol, getKeyboardShortcut } from '@/lib/device-detection';

// Mock window.navigator for testing
const mockNavigator = (userAgent: string) => {
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent,
    },
    writable: true,
  });
};

describe('Device Detection', () => {
  beforeEach(() => {
    // Reset window.navigator before each test
    delete (window as any).navigator;
  });

  describe('isAppleDevice', () => {
    it('should return true for macOS', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      expect(isAppleDevice()).toBe(true);
    });

    it('should return true for iPhone', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');
      expect(isAppleDevice()).toBe(true);
    });

    it('should return true for iPad', () => {
      mockNavigator('Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');
      expect(isAppleDevice()).toBe(true);
    });

    it('should return false for Windows', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(isAppleDevice()).toBe(false);
    });

    it('should return false for Android', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36');
      expect(isAppleDevice()).toBe(false);
    });

    it('should return false for Linux', () => {
      mockNavigator('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
      expect(isAppleDevice()).toBe(false);
    });

    it('should return false when window is undefined (SSR)', () => {
      // Mock SSR scenario by setting window to undefined
      const originalWindow = global.window;
      // @ts-ignore - Testing SSR scenario
      global.window = undefined;
      expect(isAppleDevice()).toBe(false);
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('getModifierKeySymbol', () => {
    it('should return ⌘ for Apple devices', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      expect(getModifierKeySymbol()).toBe('⌘');
    });

    it('should return ^ for non-Apple devices', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(getModifierKeySymbol()).toBe('^');
    });
  });

  describe('getKeyboardShortcut', () => {
    it('should return ⌘F for Apple devices', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
      expect(getKeyboardShortcut('F')).toBe('⌘F');
    });

    it('should return ^F for non-Apple devices', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(getKeyboardShortcut('F')).toBe('^F');
    });

    it('should work with different keys', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      expect(getKeyboardShortcut('K')).toBe('^K');
    });
  });
});
