/**
 * Test OAuth provider avatar functionality
 * Verifies that avatar images from Google and Microsoft OAuth providers are handled correctly
 */

import { getAvatarImage, getOAuthProviderInfo, getUserInitials, handleAvatarError } from '@/lib/avatar-utils';

describe('OAuth Provider Avatar Functionality', () => {
  describe('getUserInitials', () => {
    it('should return initials for valid names', () => {
      expect(getUserInitials('John Doe')).toBe('JD');
      expect(getUserInitials('Jane Smith Wilson')).toBe('JS');
      expect(getUserInitials('A')).toBe('A');
    });

    it('should handle edge cases', () => {
      expect(getUserInitials('')).toBe('U');
      expect(getUserInitials(null)).toBe('U');
      expect(getUserInitials(undefined)).toBe('U');
    });
  });

  describe('getAvatarImage', () => {
    it('should return valid image URLs', () => {
      const googleImage = 'https://lh3.googleusercontent.com/a/ACg8ocK...';
      const microsoftImage = 'https://graph.microsoft.com/v1.0/me/photo/$value';

      expect(getAvatarImage(googleImage)).toBe(googleImage);
      expect(getAvatarImage(microsoftImage)).toBe(microsoftImage);
    });

    it('should handle invalid image URLs', () => {
      expect(getAvatarImage('')).toBeUndefined();
      expect(getAvatarImage('   ')).toBeUndefined();
      expect(getAvatarImage(null)).toBeUndefined();
      expect(getAvatarImage(undefined)).toBeUndefined();
    });
  });

  describe('getOAuthProviderInfo', () => {
    it('should identify Google OAuth images', () => {
      const googleImage = 'https://lh3.googleusercontent.com/a/ACg8ocK...';
      const result = getOAuthProviderInfo(googleImage);

      expect(result.provider).toBe('google');
      expect(result.isOAuth).toBe(true);
    });

    it('should identify Microsoft OAuth images', () => {
      const microsoftImage = 'https://graph.microsoft.com/v1.0/me/photo/$value';
      const result = getOAuthProviderInfo(microsoftImage);

      expect(result.provider).toBe('microsoft');
      expect(result.isOAuth).toBe(true);
    });

    it('should identify other OAuth providers', () => {
      const githubImage = 'https://github.com/user/avatar.jpg';
      const result = getOAuthProviderInfo(githubImage);

      expect(result.provider).toBe('other');
      expect(result.isOAuth).toBe(true);
    });

    it('should handle unknown providers', () => {
      const localImage = '/uploads/avatars/user123.jpg';
      const result = getOAuthProviderInfo(localImage);

      expect(result.provider).toBe('unknown');
      expect(result.isOAuth).toBe(false);
    });

    it('should handle empty/null values', () => {
      expect(getOAuthProviderInfo('')).toEqual({ provider: 'unknown', isOAuth: false });
      expect(getOAuthProviderInfo(null)).toEqual({ provider: 'unknown', isOAuth: false });
      expect(getOAuthProviderInfo(undefined)).toEqual({ provider: 'unknown', isOAuth: false });
    });
  });

  describe('handleAvatarError', () => {
    it('should log warnings for failed images', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      handleAvatarError('https://example.com/failed-image.jpg');

      expect(consoleSpy).toHaveBeenCalledWith('Avatar image failed to load:', 'https://example.com/failed-image.jpg');

      consoleSpy.mockRestore();
    });

    it('should handle null/undefined image URLs', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      handleAvatarError(null);
      handleAvatarError(undefined);

      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });
});

/**
 * Integration test for OAuth provider avatar handling
 * This test simulates real OAuth provider scenarios
 */
describe('OAuth Provider Avatar Integration', () => {
  it('should handle Google OAuth user session', () => {
    const mockGoogleSession = {
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocK...',
        role: 'USER'
      }
    };

    // Test avatar image extraction
    const avatarImage = getAvatarImage(mockGoogleSession.user.image);
    expect(avatarImage).toBe(mockGoogleSession.user.image);

    // Test provider identification
    const providerInfo = getOAuthProviderInfo(mockGoogleSession.user.image);
    expect(providerInfo.provider).toBe('google');
    expect(providerInfo.isOAuth).toBe(true);

    // Test initials fallback
    const initials = getUserInitials(mockGoogleSession.user.name);
    expect(initials).toBe('JD');
  });

  it('should handle Microsoft OAuth user session', () => {
    const mockMicrosoftSession = {
      user: {
        id: '456',
        name: 'Jane Smith',
        email: 'jane@company.com',
        image: 'https://graph.microsoft.com/v1.0/me/photo/$value',
        role: 'ADMIN'
      }
    };

    // Test avatar image extraction
    const avatarImage = getAvatarImage(mockMicrosoftSession.user.image);
    expect(avatarImage).toBe(mockMicrosoftSession.user.image);

    // Test provider identification
    const providerInfo = getOAuthProviderInfo(mockMicrosoftSession.user.image);
    expect(providerInfo.provider).toBe('microsoft');
    expect(providerInfo.isOAuth).toBe(true);

    // Test initials fallback
    const initials = getUserInitials(mockMicrosoftSession.user.name);
    expect(initials).toBe('JS');
  });

  it('should handle credentials-based user session', () => {
    const mockCredentialsSession = {
      user: {
        id: '789',
        name: 'Bob Wilson',
        email: 'bob@company.com',
        image: null, // No OAuth image
        role: 'MANAGER'
      }
    };

    // Test avatar image extraction (should return undefined)
    const avatarImage = getAvatarImage(mockCredentialsSession.user.image);
    expect(avatarImage).toBeUndefined();

    // Test provider identification
    const providerInfo = getOAuthProviderInfo(mockCredentialsSession.user.image);
    expect(providerInfo.provider).toBe('unknown');
    expect(providerInfo.isOAuth).toBe(false);

    // Test initials fallback
    const initials = getUserInitials(mockCredentialsSession.user.name);
    expect(initials).toBe('BW');
  });
});
