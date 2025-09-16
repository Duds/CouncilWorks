/**
 * Device detection utilities for platform-specific UI elements
 * @fileoverview Provides functions to detect Apple devices and determine appropriate UI symbols
 */

/**
 * Detects if the current device is an Apple device (Mac, iPhone, iPad)
 * @returns {boolean} True if the device is an Apple device
 */
export function isAppleDevice(): boolean {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback - assume non-Apple for consistency
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // Check for macOS, iOS, iPadOS
  return (
    userAgent.includes('mac') ||
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('ipod')
  );
}

/**
 * Gets the appropriate modifier key symbol for the current platform
 * @returns {string} "⌘" for Apple devices, "^" for non-Apple devices
 */
export function getModifierKeySymbol(): string {
  return isAppleDevice() ? '⌘' : '^';
}

/**
 * Gets the appropriate keyboard shortcut display for the current platform
 * @param key - The key to display after the modifier (e.g., 'F')
 * @returns {string} Platform-appropriate shortcut display
 */
export function getKeyboardShortcut(key: string): string {
  const modifier = getModifierKeySymbol();
  return `${modifier}${key}`;
}
